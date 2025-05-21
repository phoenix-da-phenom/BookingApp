<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\GoogleCalendarController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleCallback']);
Route::post('/auth/google', [GoogleAuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/calendar/events', [GoogleCalendarController::class, 'store']);
    Route::get('/calendar/events', [GoogleCalendarController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
