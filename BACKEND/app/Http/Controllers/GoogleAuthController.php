<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Google\Client as GoogleClient;
use App\Models\User;

class GoogleAuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'credential' => 'required|string',
            'client_id' => 'required|string',
        ]);

        $client = new GoogleClient(['client_id' => $request->client_id]);
        $payload = $client->verifyIdToken($request->credential);

        if (!$payload) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        // Find or create user
        $user = User::firstOrCreate(
            ['email' => $payload['email']],
            [
                'name' => $payload['name'],
                'google_id' => $payload['sub'],
                'email_verified_at' => now(),
            ]
        );

        // Create token
        $token = $user->createToken('google-token')->plainTextToken;
return response()->json([
    'token' => $token,
    'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
      ],
]);

    }
    public function handleCallback(Request $request)
{
    $client = new GoogleClient();
    $client->setAuthConfig(config('services.google'));
    $client->addScope(Calendar::CALENDAR);
    $client->setRedirectUri(config('services.google.redirect'));

    if ($request->has('code')) {
        $token = $client->fetchAccessTokenWithAuthCode($request->code);

        if (isset($token['error'])) {
            return redirect('/')->with('error', $token['error']);
        }

        $user = auth()->user();
        $user->google_token = $token['access_token'];
        $user->google_refresh_token = $token['refresh_token'] ?? null;
        $user->save();

        return redirect('/')->with('success', 'Google Calendar access granted!');
    }

    return redirect($client->createAuthUrl());
}
}
