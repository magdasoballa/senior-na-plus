<?php

use App\Http\Controllers\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\QuickApplicationController;
use App\Models\Offer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    $offers = Offer::latest()
        ->take(8)
        ->get([
            'id','title','city','country','start_date','duration','language','wage',
            'care_recipient_gender','mobility','lives_alone',
        ]);

    return Inertia::render('welcome', [
        'offers' => $offers,
    ]);
})->name('home');

/** Szczegóły oferty (route-model binding) */
Route::get('/offers/{offer}', function (Offer $offer) {
    return Inertia::render('Offers/Show', [
        'offer' => $offer, // przekazujemy rekord z bazy 1:1
    ]);
})->name('offers.show');

/** Kontakt / szybka aplikacja */
Route::post('/kontakt', [ContactMessageController::class, 'store'])->name('contact.store');
Route::post('/szybka-aplikacja', [QuickApplicationController::class, 'store'])->name('quick.apply.store');

/** Lista ofert (/offers) */
Route::get('/offers', function () {
    // najnowsze z paginacją — FRONT potrzebuje zwykłej tablicy ->items()
    $paginator = Offer::latest()
        ->select([
            'id','title','city','country','start_date','duration','language','wage',
            'care_recipient_gender','mobility','lives_alone',
        ])
        ->paginate(12);

    return Inertia::render('Offers/Index', [
        'offers' => $paginator->items(),
        'pagination' => [
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'per_page'     => $paginator->perPage(),
            'total'        => $paginator->total(),
            'prev_page_url'=> $paginator->previousPageUrl(),
            'next_page_url'=> $paginator->nextPageUrl(),
        ],
    ]);
})->name('offers.index');

Route::get('/aplikacja/{offer}', [ApplicationController::class, 'create'])->name('application.create');
Route::post('/aplikuj', [ApplicationController::class, 'store'])->name('application.store');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = Auth::user();
    $isAdmin = (bool) ($user->is_admin ?? false);

    return Inertia::render('dashboard', [
        'isAdmin' => $isAdmin,
        'stats' => $isAdmin ? [
            'offers'       => \App\Models\Offer::count(),
            'applications' => \App\Models\Application::count(),
        ] : null,
    ]);
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Admin (wymaga aliasu middleware 'admin' w bootstrap/app.php)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('offers', AdminOfferController::class)->except(['show']);

        Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');
        Route::get('applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');
        Route::put('applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.status');
        Route::get('applications/{application}/download-references', [ApplicationController::class, 'downloadReferences'])->name('applications.download');
        Route::delete('applications/{application}', [ApplicationController::class, 'destroy'])->name('applications.destroy');
    });

/*
|--------------------------------------------------------------------------
| Auth scaffolding
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
