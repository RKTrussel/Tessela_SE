<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/products', [ProductController::class, 'addItem']);
Route::get('/products', [ProductController::class, 'indexItem']);
Route::get('/products/{id}', [ProductController::class, 'getItem']);
Route::put('/products/{product}', [ProductController::class, 'updateItem']);
Route::delete('/products/{product}', [ProductController::class, 'destroyItem']);

Route::get('/cart', [CartController::class, 'show']);
Route::post('/cart/add', [CartController::class, 'addItem']);
Route::post('/cart/remove/{itemId}', [CartController::class, 'removeItem']);
Route::post('/cart/clear', [CartController::class, 'clear']);


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
