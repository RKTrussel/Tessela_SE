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
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ReviewController;

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

// Public routes
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign:campaign_id}', [CampaignController::class, 'show']);


Route::post('/products', [AdminController::class, 'addItem']);
Route::put('/products/{product}', [AdminController::class, 'updateItem']);
Route::delete('/products/{product}', [AdminController::class, 'destroyItem']);

Route::get('/products', [ProductController::class, 'getDetails']);
Route::get('/products/{product_id}/related', [ProductController::class, 'related']);

Route::get('/search', [UserController::class, 'searchItem']);

Route::get('/products/newest', [UserController::class, 'newestArrivals']);
Route::get('/products/{id}', [UserController::class, 'viewItemDetails']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/campaigns/{campaign:campaign_id}/donations', [DonationController::class, 'index']);
Route::post('/campaigns/{campaign:campaign_id}/donations', [DonationController::class, 'store']);

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

  Route::post('/campaigns', [CampaignController::class, 'store']);
  Route::patch('/campaigns/{campaign}/status', [CampaignController::class, 'updateStatus']);
  Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
  Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);

  Route::apiResource('blogs', BlogController::class);

  Route::get('/admin/blogs', [BlogController::class, 'adminIndex']);
  
  Route::get('/blogs/{blog}/comments', [CommentController::class, 'index']);  

  Route::post('/blogs/{blog}/comments', [CommentController::class, 'store']);
  Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

  Route::post('/blogs/{blog}/like', [LikeController::class, 'toggle']);

  Route::get('/products/{product_id}/reviews', [ReviewController::class, 'index']);
  Route::post('/products/{product_id}/reviews', [ReviewController::class, 'store']);
});

// solo middleware
Route::middleware('token.auth')->get('/me', [AuthController::class, 'me']);

Route::post('/donations/{donation}/simulate', function(\App\Models\Donation $donation, Request $r){
  abort_unless(app()->environment(['local','testing']), 403);
  $status = $r->validate(['status'=>'required|in:paid,failed,refunded'])['status'];
  $donation->update([
    'payment_status'=>$status,
    'payment_ref' => $donation->payment_ref ?? 'SIM-'.strtoupper(str()->random(10)),
  ]);
  return $donation;
});