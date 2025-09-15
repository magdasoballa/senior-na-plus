<?php

use App\Http\Controllers\ContactMessageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
// routes/web.php
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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
