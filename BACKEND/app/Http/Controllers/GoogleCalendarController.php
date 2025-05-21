<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use App\Models\User;

class GoogleCalendarController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new GoogleClient();
        $this->client->setAuthConfig(config('services.google'));
        $this->client->addScope(Calendar::CALENDAR);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->google_token) {
            return response()->json(['error' => 'User not authenticated with Google'], 401);
        }

        $this->client->setAccessToken($user->google_token);

        // Refresh token if expired
        if ($this->client->isAccessTokenExpired()) {
            if ($user->google_refresh_token) {
                $this->client->refreshToken($user->google_refresh_token);
                $newToken = $this->client->getAccessToken();
                $user->google_token = $newToken;
                $user->save();
            } else {
                return response()->json(['error' => 'Token expired'], 401);
            }
        }

        $service = new Calendar($this->client);

        $event = new Event([
            'summary' => $request->title,
            'description' => $request->description,
            'start' => [
                'dateTime' => $request->start_time,
                'timeZone' => $request->timezone ?? 'UTC',
            ],
            'end' => [
                'dateTime' => $request->end_time,
                'timeZone' => $request->timezone ?? 'UTC',
            ],
        ]);

        try {
            $createdEvent = $service->events->insert('primary', $event);
            return response()->json($createdEvent);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->google_token) {
            return response()->json(['error' => 'User not authenticated with Google'], 401);
        }

        $this->client->setAccessToken($user->google_token);

        // Refresh token if expired (same as in store method)
        // ...

        $service = new Calendar($this->client);

        try {
            $events = $service->events->listEvents('primary');
            return response()->json($events->getItems());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
