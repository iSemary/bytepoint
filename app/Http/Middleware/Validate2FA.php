<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Modules\Auth\Entities\FactorAuthenticateToken;
use Symfony\Component\HttpFoundation\Response;

class Validate2FA
{
    public function handle(Request $request, Closure $next): Response
    {
        // Get the authenticated user
        $user = auth()->guard('api')->user();

        $tokenId = $user->token()->id;
        // Check if the user has an existing 2FA token
        $existingToken = FactorAuthenticateToken::where('user_id', $user->id)->where("token_id", $tokenId)->first();

        if (!$existingToken) {
            return response()->json(['error' => '2FA token is not valid.'], 409);
        } else {
            return $next($request);
        }
    }
}
