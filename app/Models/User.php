<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;
use Laravel\Passport\Token;
use Modules\Auth\Entities\EmailToken;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes, LogsActivity;

    protected $connection = 'tenant';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['customer_id', 'name', 'email', 'username', 'country_id', 'language_id', 'theme_mode', 'factor_authenticate', 'google2fa_secret', 'password'];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = ['password', 'remember_token'];

    protected $guard_name = 'api';


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = ['email_verified_at' => 'datetime', 'password' => 'hashed'];


    public function role()
    {
        return $this->roles()->latest()->first();
    }

    /**
     * The function `verifyToken` checks if a given token exists in the `EmailToken` table, updates its
     * status to 1, and returns the corresponding user from the `User` table.
     * 
     * @param string token The "token" parameter is a string that represents a unique identifier for a user's
     * email verification token.
     * 
     * @return User an instance of the User model where the id matches the user_id of the EmailToken.
     */
    public static function verifyToken(string $token)
    {
        $userToken = EmailToken::where("token", $token)->where("status", 0)->first();
        if ($userToken) {
            $userToken->update(["status" => 1]);
            return User::where("id", $userToken->user_id);
        } else {
            return false;
        }
    }

    /**
     * The function creates a password reset token for a user if one does not already exist.
     * 
     * @return string password reset token.
     */
    public function createResetToken(): string
    {
        $token = DB::table('password_reset_tokens')->where("user_id", $this->id)->value('token');
        if (!$token) {
            $token = EmailToken::generateToken();
            DB::table('password_reset_tokens')->insert(['user_id' => $this->id, 'token' => $token]);
        }
        return $token;
    }

    /**
     * The function updates the password of the current user with a new password.
     * 
     * @param string newPassword The  parameter is a string that represents the new password
     * that the user wants to set.
     */
    public function updatePassword(string $newPassword): void
    {
        $this->update(['password' => bcrypt($newPassword)]);
    }

    /**
     * The function sets the email attribute and updates the email_verified_at attribute based on whether
     * the email value has changed.
     * 
     * @param value The value parameter represents the new value that is being assigned to the email
     * attribute.
     */
    public function setEmailAttribute($value)
    {
        $this->attributes['email'] = $value;
        $this->attributes['email_verified_at'] = $this->email == $value ? $this->email_verified_at : null;
    }

    /**
     * The function `manualCheckToken` checks the validity of an access token by decoding its header,
     * retrieving the token ID, and then searching for the token in a database. If the token is found, it
     * returns the associated user; otherwise, it returns false.
     * 
     * @param accessToken The `accessToken` parameter is a string that represents a token used for
     * authentication or authorization purposes.
     * 
     * @return either the user associated with the token if the token is found in the database, or false if
     * the token is not found or if the 'jti' field is not present in the token header.
     */
    public static function manualCheckToken($accessToken)
    {
        $tokenParts = explode('.', $accessToken);
        $tokenHeader = $tokenParts[1];
        $tokenHeaderJson = base64_decode($tokenHeader);
        $tokenHeaderArray = json_decode($tokenHeaderJson, true);
        $tokenId = isset($tokenHeaderArray['jti']) ? $tokenHeaderArray['jti'] : null;
        if (!$tokenId) {
            return false;
        }
        $token = Token::find($tokenId);
        if ($token) {
            return $token->user;
        }
        return false;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty();
    }
}
