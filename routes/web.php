<?php

use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\QuickApplicationController;
use App\Models\Offer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $offers = Offer::latest()
        ->take(8)
        ->get(['id','title','city','country','start_date','duration','language','wage']); // snake_case

    return Inertia::render('welcome', [
        'offers' => $offers,
    ]);
})->name('home');

/**
 * Szczegóły oferty – bez żadnego mapowania
 * (route-model binding: {offer} -> App\Models\Offer)
 */
Route::get('/offers/{offer}', function (Offer $offer) {
    return Inertia::render('Offers/Show', [
        'offer' => $offer, // przekazujemy dokładnie to, co w bazie (snake_case)
    ]);
})->name('offers.show');

/** Kontakt / szybka aplikacja */
Route::post('/kontakt', [ContactMessageController::class, 'store'])->name('contact.store');
Route::post('/szybka-aplikacja', [QuickApplicationController::class, 'store'])->name('quick.apply.store');

/** Aplikacje */
Route::get('/aplikacja/{offer}', [ApplicationController::class, 'create'])->name('application.create');
Route::post('/aplikuj', [ApplicationController::class, 'store'])->name('application.store');

/** Panel admina (wymaga aliasu middleware 'admin' dodanego w bootstrap/app.php) */
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // aplikacje
        Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{id}', [ApplicationController::class, 'show'])->name('applications.show');
        Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status');
        Route::delete('/applications/{id}', [ApplicationController::class, 'destroy'])->name('applications.destroy');
        Route::get('/applications/{id}/download-references', [ApplicationController::class, 'downloadReferences'])->name('applications.download');

        // oferty
        Route::resource('offers', OfferController::class)->except(['show']);
    });

/** Dashboard po zalogowaniu/zweryfikowaniu */
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
