<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\OrderController;

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


Route::post('/products', [AdminController::class, 'addItem']);
Route::put('/products/{product}', [AdminController::class, 'updateItem']);
Route::delete('/products/{product}', [AdminController::class, 'destroyItem']);

Route::get('/products', [ProductController::class, 'getDetails']);

Route::get('/search', [UserController::class, 'searchItem']);

Route::get('/products/newest', [UserController::class, 'newestArrivals']);
Route::get('/products/{id}', [UserController::class, 'viewItemDetails']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('token.auth')->group(function () {
    Route::post('/cart/add', [UserController::class, 'addToCart']);
    Route::get('/cart', [CartController::class, 'show']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/cart/clear', [CartController::class, 'clear']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
   

    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::put('/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    Route::patch('/admin/orders/{order}/status', [OrderController::class, 'updateStatus']);
});

// solo middleware
Route::middleware('token.auth')->get('/me', [AuthController::class, 'me']);