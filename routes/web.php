<?php

use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\QuickApplicationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::get('/offers/{id}', function (string $id) {
    // TODO: pobierz z bazy, a na start stub:
    $offer = [
        'id' => $id,
        'title' => 'DO OPIEKI SENIOR 61 LAT - OFERTA NA 2 TYG',
        'description' =>
            'Do opieki jest senior ... komunikacja jest z nim dobrze zachowana. Senior jest osobą towarzyską i pogodną.',
        'duties' => [
            'Prowadzenia domu',
            'Przygotowanie posiłków',
            'Pomoc w codziennych czynnościach',
            'Robienie zakupów',
            'Sprzątanie',
            'Pomoc w higienie',
        ],
        'requirements' => [
            'Doświadczenie w opiece',
            'Komunikatywny niemiecki',
            'Cierpliwość i empatia',
        ],
        'benefits' => [
            'Stabilne i legalne zatrudnienie',
            'Wysokie wynagrodzenie',
            'Ubezpieczenie',
            'Bezpłatne zakwaterowanie i wyżywienie',
            'Pokrycie kosztów podróży',
        ],
    ];

    return Inertia::render('Offers/Show', ['offer' => $offer]);
})->name('offers.show');


Route::post('/kontakt', [ContactMessageController::class, 'store'])
    ->name('contact.store');

Route::post('/szybka-aplikacja', [QuickApplicationController::class, 'store'])
    ->name('quick.apply.store');

// Aplikacje
Route::get('/aplikacja/{offer}', [ApplicationController::class, 'create'])->name('application.create');
Route::post('/aplikuj', [ApplicationController::class, 'store'])->name('application.store');

// Trasy dla admina (zabezpiecz middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/applications', [ApplicationController::class, 'index'])->name('admin.applications.index');
    Route::get('/applications/{id}', [ApplicationController::class, 'show'])->name('admin.applications.show');
    Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus'])->name('admin.applications.status');
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy'])->name('admin.applications.destroy');
    Route::get('/applications/{id}/download-references', [ApplicationController::class, 'downloadReferences'])->name('admin.applications.download');
});

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('offers', OfferController::class)->except(['show']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
