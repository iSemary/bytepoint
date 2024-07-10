<?php

namespace Modules\Auth\Http\Controllers\Api;

use App\Http\Controllers\Api\ApiController;
use App\Models\Customer;
use Modules\Auth\Services\RegistrationService;
use Modules\Auth\Services\ActivityLogService;
use Modules\Auth\Http\Requests\ForgetPasswordRequest;
use Modules\Auth\Http\Requests\LoginUserRequest;
use Modules\Auth\Http\Requests\RegisterUserRequest;
use Modules\Auth\Http\Requests\ResetPasswordRequest;
use Modules\Auth\Http\Requests\UpdatePasswordRequest;
use Modules\Auth\Jobs\AttemptMailJob;
use Modules\Auth\Jobs\ForgetPasswordMailJob;
use Modules\Auth\Jobs\RegistrationMailJob;
use Modules\Auth\Entities\EmailToken;
use Modules\Auth\Entities\LoginAttempt;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use stdClass;
use Exception;
use Modules\Auth\Entities\FactorAuthenticateToken;
use Modules\Tenant\Helper\TenantHelper;
use Spatie\Multitenancy\Models\Tenant;

class AuthController extends ApiController
{
    protected $registrationService;
    protected $activityLogService;

    public function __construct(RegistrationService $registrationService, ActivityLogService $activityLogService)
    {
        $this->registrationService = $registrationService;
        $this->activityLogService = $activityLogService;
    }

    /**
     * The function registers a new user, creates a user record, fires an email confirmation queue,
     * collects user details, and returns a success JSON response.
     * 
     * @param RegisterUserRequest request The  parameter is an instance of the RegisterUserRequest
     * class. It contains the data that was sent in the HTTP request to register a new user. This data is
     * validated against the rules defined in the RegisterUserRequest class before being used to create a
     * new user record.
     * 
     * @return JsonResponse a JsonResponse object.
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        /* Requested data passed the validation */
        try {
            $validatedRequest = $request->validated();
            // Register new user / customer / tenant
            $registrationService = $this->registrationService->register($validatedRequest);
            // collect user details to return in the json response
            $user = $this->collectUserDetails($registrationService['user'], true, true);
            // Return Success Json Response
            return $this->return(200, 'Owner Registered Successfully', [
                'user' => $user,
                'redirect' => $registrationService['redirect'] . "/2fa/generate"
            ]);
        } catch (\Exception $e) {
            return $this->return(400, 'Something went wrong', debug: $e->getMessage());
        }
    }

    /**
     * The function attempts to log in a user by checking their login credentials and returns a JSON
     * response indicating whether the login was successful or not.
     * 
     * @param LoginUserRequest request The  parameter is an instance of the LoginUserRequest
     * class. It contains the data submitted by the user during the login process, such as the email
     * and password.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function login(LoginUserRequest $request): JsonResponse
    {
        $tenant = TenantHelper::makeCurrent($request->subdomain);

        if ($this->attemptLogin($request)) {
            return $this->handleSuccessfulLogin($request);
        }

        return $this->handleFailedLogin($request, $tenant);
    }

    private function attemptLogin(LoginUserRequest $request): bool
    {
        return auth()->attempt([
            'email' => $request->email,
            'password' => $request->password
        ]);
    }

    private function handleSuccessfulLogin(LoginUserRequest $request): JsonResponse
    {
        $user = auth()->user();
        $response = $this->collectUserDetails($user);

        $redirect = $this->handle2FARedirection($user, $request);

        return $this->return(200, 'User Logged in Successfully', [
            'user' => $response,
            'redirect' => $redirect
        ]);
    }

    public function check2FA(Request $request)
    {
        $user = auth()->guard('api')->user();
        $tokenId = $user->token()->id;

        // Check if the user has an existing 2FA token
        $existingToken = FactorAuthenticateToken::where('user_id', $user->id)->where('token_id', $tokenId)->first();
        if (!$existingToken) {
            $redirect = $this->handle2FARedirection($user, $request);
            return $this->return(409, '2FA token is not valid.', ['redirect' => $redirect]);
        }
        return $this->return(200, '2FA token is valid.');
    }


    private function handle2FARedirection(User $user, Request $request)
    {
        $tenant = Tenant::current();
        $redirect = TenantHelper::generateURL($tenant->name);

        if ($user->factor_authenticate) {
            if ($user->google2fa_secret) {
                $redirect .= "/2fa/validate";
            } else {
                $redirect .= "/2fa/generate";
            }
        }
        return $redirect;
    }

    private function handleFailedLogin(LoginUserRequest $request, $tenant): JsonResponse
    {
        $user = User::where("email", $request->email)->first();

        if ($user) {
            return $this->handleExistingUserFailedLogin($user, $request, $tenant);
        }

        return $this->handleNonExistentUserLogin($request);
    }

    private function handleExistingUserFailedLogin(User $user, LoginUserRequest $request, $tenant): JsonResponse
    {
        $loginAttempt = $this->createLoginAttempt($user, $request);
        AttemptMailJob::dispatchAfterResponse($user, $loginAttempt, $tenant->id);

        return $this->return(400, 'Invalid credentials');
    }

    private function createLoginAttempt(User $user, LoginUserRequest $request): LoginAttempt
    {
        return LoginAttempt::create([
            'user_id' => $user->id,
            'agent' => $request->userAgent(),
            'ip' => $request->ip(),
        ]);
    }

    private function handleNonExistentUserLogin(LoginUserRequest $request): JsonResponse
    {
        $trashedUser = User::where("email", $request->email)->withTrashed()->first();

        if ($trashedUser) {
            return $this->attemptAccountRecovery($request, $trashedUser);
        }

        return $this->return(400, 'Invalid credentials');
    }

    private function attemptAccountRecovery(LoginUserRequest $request, User $trashedUser): JsonResponse
    {
        User::where("email", $request->email)->withTrashed()->restore();

        if ($this->attemptLogin($request)) {
            return $this->handleSuccessfulRecovery($request);
        }

        $this->rollbackRecovery($trashedUser);
        return $this->return(400, 'Invalid credentials');
    }

    private function handleSuccessfulRecovery(LoginUserRequest $request): JsonResponse
    {
        $user = auth()->user();
        $response = $this->collectUserDetails($user);

        return $this->return(200, 'Account recovered successfully', [
            'user' => $response,
            'redirect' => TenantHelper::generateURL($request->subdomain)
        ]);
    }

    private function rollbackRecovery(User $trashedUser): void
    {
        User::where("email", $trashedUser->email)->update(['deleted_at' => $trashedUser->deleted_at]);
    }

    /**
     * The function collects user details and adds an access token to the user object.
     * 
     * @param User user The parameter `` is an instance of the `User` class.
     * 
     * @return User the updated User object with the added access_token property.
     */
    public function collectUserDetails(User $user, bool $generateToken = true): User
    {
        if ($generateToken) {
            $accessToken = $this->generateAccessToken($user);
        }

        $userData = $this->selectUserData($user);
        if ($generateToken) {
            $userData['access_token'] = $accessToken;
        }

        return $userData;
    }

    private function generateAccessToken(User $user): string
    {
        return $user->createToken('web-app')->accessToken;
    }

    private function selectUserData(User $user): User
    {
        return $user->where("id", $user->id)->select('name', 'email', 'username', 'created_at')->first();
    }
    /**
     * The function logs out a user by deleting their access tokens either for a specific request or
     * for all tokens associated with the user.
     * 
     * @param Request request The  parameter is an instance of the Request class, which
     * represents an HTTP request. It contains information about the request such as the request
     * method, headers, and input data. In this code, it is used to determine the type of logout action
     * to perform.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = auth()->guard('api')->user();
        try {
            if ($request->type == 1) {
                // Delete only the request token
                DB::table("oauth_access_tokens")->where("id", $user->token()['id'])->delete();
            } else {
                // Delete all user tokens
                $user->tokens->each(function ($token, $key) use ($user) {
                    if ($token->id !== $user->token()['id']) {
                        $token->delete();
                    }
                });
            }
            return $this->return(200, 'Logged out successfully');
        } catch (Exception $e) {
            return $this->return(400, 'Couldn\'t logout using this token', [], ['e' => $e->getMessage()]);
        }
    }

    /**
     * The function `verifyEmail` takes a token as input, verifies it, and updates the `email_verified_at`
     * field of the user if the token is valid.
     * 
     * @param string token The `token` parameter is a string that represents a verification token. This
     * token is used to verify the user's email address.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function verifyEmail(string $token): JsonResponse
    {
        if (isset($token)) {
            try {
                $verifyToken = User::verifyToken($token);
                if ($verifyToken) {
                    $verifyToken->update([
                        'email_verified_at' => Carbon::now()
                    ]);
                    return $this->return(200, "Email Verified Successfully");
                } else {
                    return $this->return(400, "Token is expired");
                }
            } catch (Exception $e) {
                return $this->return(400, "Invalid Token");
            }
        }
    }

    /**
     * The forgetPassword function generates a reset token for a user's email and sends a reset email.
     * 
     * @param ForgetPasswordRequest request The  parameter is an instance of the
     * ForgetPasswordRequest class. It is used to retrieve the email entered by the user who wants to
     * reset their password.
     * 
     * @return JsonResponse a JsonResponse with a status code of 200 and a message "Reset email has been
     * sent successfully".
     */
    public function forgetPassword(ForgetPasswordRequest $request): JsonResponse
    {
        $user = User::select(['id', 'name', 'email'])->where("email", $request->email)->first();
        $token = $user->createResetToken();
        // Send reset password link
        ForgetPasswordMailJob::dispatchAfterResponse($user, $token, $tenantId);
        return $this->return(200, "Reset email has been sent successfully");
    }

    /**
     * The function resets a user's password by fetching the user from the database using a token, updating
     * the password, and deleting the reset token from the database.
     * 
     * @param ResetPasswordRequest request The request parameter is an instance of the ResetPasswordRequest
     * class. It contains the data sent in the request, such as the token and the new password.
     * 
     * @return JsonResponse a JsonResponse.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        // Fetch the user by the token from the database
        $user = User::join("password_reset_tokens", "password_reset_tokens.user_id", "users.id")
            ->select(['users.id'])
            ->where("password_reset_tokens.token", $request->token)
            ->first();
        if ($user) {
            // Reset the user's password
            $user->updatePassword($request->password);
            // clear reset token from database
            DB::table('password_reset_tokens')->where("token", $request->token)->delete();
            return $this->return(200, "Password has been reset successfully");
        } else {
            return $this->return(400, "User not exists");
        }
    }

    /**
     * The function checks if the user is authenticated and returns a JSON response indicating the
     * authentication status.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function checkAuthentication(): JsonResponse
    {
        if (auth()->guard('api')->check()) {
            return $this->return(200, "Authenticated successfully");
        }
        return $this->return(400, "Session expired");
    }

    /**
     * The function "attempts" retrieves login attempts made by the authenticated user and returns them as
     * a JSON response.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function attempts(): JsonResponse
    {
        $attempts = LoginAttempt::select(['id', 'ip', 'agent', 'created_at'])->where('user_id', auth()->guard('api')->id())->orderBy('id', 'DESC')->paginate(25);
        return $this->return(200, 'Attempts fetched successfully', ['attempts' => $attempts]);
    }

    /**
     * The function sends a verification email to the authenticated user and returns a JSON response
     * indicating that the verification link has been sent.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function sendVerifyEmail(): JsonResponse
    {
        $user = auth()->guard('api')->user();
        // Create email token
        $token = EmailToken::createToken($user->id);
        // Fire Email Confirmation Queue
        RegistrationMailJob::dispatchAfterResponse($user, $token, $tenantId);
        return $this->return(200, 'Verification link has been sent');
    }


    /**
     * The function updates the password of the authenticated user in the database.
     * 
     * @param UpdatePasswordRequest updatePasswordRequest The  parameter is an
     * instance of the UpdatePasswordRequest class. It is used to validate and retrieve the new password
     * value from the request.
     * 
     * @return JsonResponse A JsonResponse object is being returned.
     */
    public function updatePassword(UpdatePasswordRequest $updatePasswordRequest): JsonResponse
    {
        $userId = auth()->guard('api')->id();

        User::where("id", $userId)->update([
            'password' => bcrypt($updatePasswordRequest->password),
            'last_password_at' => now()
        ]);

        return $this->return(200, "Password updated successfully");
    }


    /**
     * The getUserDetails function retrieves the user details, including the user object and returns them in a JSON response.
     * 
     * @return JsonResponse a JsonResponse with the following data:
     * - Status code: 200
     * - Message: "User details fetched successfully"
     * - Data: An object containing the user details
     */
    public function getUserDetails(): JsonResponse
    {
        $user = auth()->guard('api')->user();
        $response = new stdClass();

        $response->user = $this->prepareUserData($user);
        $response->user->role = $user->role()->name;

        $customer = $this->getCustomerDetails($user->customer_id);
        $response->customer = $customer;
        return $this->return(200, "User details fetched successfully", ['data' => $response]);
    }

    private function prepareUserData(User $user)
    {
        $data = [
            'customer_id' => $user->customer_id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->username,
            'country_id' => $user->country_id,
            'language_id' => $user->language_id,
            'theme_mode' => $user->theme_mode,
            'factor_authenticate' => $user->factor_authenticate,
            'last_password_at' => $user->last_password_at,
            'email_verified_at' => $user->email_verified_at,
        ];

        return (object) $data;
    }


    private function getCustomerDetails(int $customerId)
    {
        return Customer::select(['id', 'name as customer_name', 'username', 'category_id'])->where("id", $customerId)->first();
    }

    /**
     * The `deactivate` function revokes all tokens for the authenticated user and soft deletes the
     * user account in PHP.
     * 
     * @return JsonResponse A JsonResponse with a status code of 200 and a message "Account deactivated
     * successfully" is being returned.
     */
    public function deactivate(): JsonResponse
    {
        $user = auth()->guard('api')->user();
        // Revoke all tokens
        $user->tokens->each(function ($token, $key) {
            $token->delete();
        });
        // set user as soft deleted 
        $user->delete();
        return $this->return(200, "Account deactivated successfully");
    }

    /**
     * Generate 2FA QrCode After registration
     *
     * @return void
     */
    public function generate2FACode()
    {
        $user = auth()->guard('api')->user();

        $google2fa = app('pragmarx.google2fa');
        $googleSecretKey = $google2fa->generateSecretKey();

        $qrCode = $google2fa->getQRCodeInline(config('app.name'), $user['email'], $googleSecretKey);

        return $this->return(200, "QR Code Generated Successfully", ['qr_code' => $qrCode, 'secret_key' => $googleSecretKey]);
    }

    /**
     * Verify 2FA After registration
     *
     * @param Request $request
     * @return void
     */
    public function verify2FA(Request $request)
    {
        $user = auth()->guard('api')->user();
        $request->validate(['code' => 'required|string|max:6', 'secret_key' => 'required|string']);

        // Verify the 2FA code
        $google2fa = app('pragmarx.google2fa');
        $isValid = $google2fa->verifyKey($request->secret_key, $request->code);

        if ($isValid) {
            // Create a new 2FA token
            FactorAuthenticateToken::create(['user_id' => $user->id, 'token_id' => $user->token()->id]);
            $user->update(["google2fa_secret" => $request->secret_key]);
            return $this->return(200, "2FA Verified Successfully");
        }
        return $this->return(400, "Invalid OTP number");
    }

    /**
     * Validate 2fa after login
     *
     * @param Request $request
     * @return void
     */
    public function validate2FA(Request $request)
    {
        $user = auth()->guard('api')->user();
        $request->validate(['code' => 'required|string|max:6']);

        // Validate the 2FA code
        $google2fa = app('pragmarx.google2fa');
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->code);

        if ($isValid) {
            // Create a new 2FA token
            FactorAuthenticateToken::create(['user_id' => $user->id, 'token_id' => $user->token()->id]);
            return $this->return(200, "2FA Verified Successfully");
        }
        return $this->return(400, "Invalid OTP number");
    }

    /**
     * Update user details [settings page]
     *
     * @param Request $request
     * @return void
     */
    public function updateUserDetails(Request $request)
    {
        $user = auth()->guard('api')->user();

        // Update the user model
        $user->country_id = $request->country_id;
        $user->email = $request->email;
        $user->name = $request->name;
        $user->theme_mode = $request->theme_mode;
        $user->factor_authenticate = $request->factor_authenticate;

        if (!empty($request->password)) {
            if ($request->password == $request->password_confirmation) {
                $user->password = bcrypt($request->password);
            } else {
                return $this->return(400, "Password not match");
            }
        }
        $user->save();

        if ($user->role()->name == 'super_admin') {
            $client = $this->getCustomerDetails($user->customer_id);
            $client->category_id = $request->category_id;
            $client->name = $request->customer_name;
            $client->save();
        }

        return $this->return(200, "Profile updated successfully");
    }

    /**
     * Return activity logs
     *
     * @return JsonResponse
     */
    public function activityLogs(): JsonResponse
    {
        $activityLogs = $this->activityLogService->get();
        return $this->return(200, "Activity Log Fetched successfully", ['activity_logs' => $activityLogs]);
    }
}
