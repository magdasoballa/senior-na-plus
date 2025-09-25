<?php

use App\Http\Controllers\Admin\Dictionaries\CareTargetController;
use App\Http\Controllers\Admin\Dictionaries\ExperienceController;
use App\Http\Controllers\Admin\Dictionaries\GenderController;
use App\Http\Controllers\Admin\Dictionaries\MobilityController;
use App\Http\Controllers\Admin\Dictionaries\SkillController;
use App\Http\Controllers\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\Admin\Settings\BannerController;
use App\Http\Controllers\Admin\Settings\PopupController;
use App\Http\Controllers\Admin\Settings\PortalSettingsController;
use App\Http\Controllers\Admin\Settings\SocialLinkController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\Front\OfferController;
use App\Http\Controllers\QuickApplicationController;
use App\Models\Offer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $offers = Offer::latest()
        ->take(8)
        ->get([
            'id', 'title', 'city', 'country', 'start_date', 'duration', 'language', 'wage',
            'care_recipient_gender', 'mobility', 'lives_alone',
        ]);

    return Inertia::render('welcome', [
        'offers' => $offers,
    ]);
})->name('home');

/** Szczegóły oferty (route-model binding) */
Route::get('/offers/{offer}', function (Offer $offer) {
    return Inertia::render('Offers/Show', [
        'offer' => $offer,
    ]);
})->name('offers.show');

/** Kontakt / szybka aplikacja */
Route::post('/kontakt', [ContactMessageController::class, 'store'])->name('contact.store');
Route::post('/szybka-aplikacja', [QuickApplicationController::class, 'store'])->name('quick.apply.store');

/** Lista ofert (/offers) – kontroler z filtrami */
Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');


Route::get('/aplikacja/{offer}', [ApplicationController::class, 'create'])->name('application.create');
Route::post('/aplikuj', [ApplicationController::class, 'store'])->name('application.store');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = Auth::user();
    $isAdmin = (bool)($user->is_admin ?? false);

    return Inertia::render('dashboard', [
        'isAdmin' => $isAdmin,
        'stats' => $isAdmin ? [
            'offers' => \App\Models\Offer::count(),
            'applications' => \App\Models\Application::count(),
        ] : null,
    ]);
})->name('dashboard');


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/


Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // ===== Oferty (główny zasób) =====
        Route::resource('offers', AdminOfferController::class)->except(['show']);

        // ===== Oferty – słowniki do ofert =====
        Route::prefix('offers')->name('offers.')->group(function () {
            Route::resource('duties', OfferDutyController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('requirements', OfferRequirementController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('perks', OfferPerkController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        // ===== Aplikacje =====
        Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');
        Route::get('applications/{application}', [ApplicationController::class, 'showApplication'])->name('applications.show');
        Route::put('applications/{application}/status', [ApplicationController::class, 'updateStatusApplication'])->name('applications.status');
        Route::get('applications/{application}/download-references', [ApplicationController::class, 'downloadReferences'])->name('applications.download');
        Route::delete('applications/{application}', [ApplicationController::class, 'destroyApplication'])->name('applications.destroy');

        // ===== Szybkie aplikacje =====
        Route::get('quick-applications/{quickApplication}', [ApplicationController::class, 'showQuickApplication'])->name('quick-applications.show');
        Route::put('quick-applications/{quickApplication}/status', [ApplicationController::class, 'updateStatusQuickApplication'])->name('quick-applications.status');
        Route::delete('quick-applications/{quickApplication}', [ApplicationController::class, 'destroyQuickApplication'])->name('quick-applications.destroy');

        // ===== Ustawienia =====
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::resource('pages', \App\Http\Controllers\Admin\Settings\PageController::class)
                ->only(['index', 'edit', 'update', 'show']);

            Route::resource('social-links', SocialLinkController::class)
                ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
                ->parameters(['social-links' => 'social_link']);
            Route::get('/banners', [BannerController::class, 'index'])->name('banners.index');
            Route::get('/banners/create', [BannerController::class, 'create'])->name('banners.create');
            Route::post('/banners', [BannerController::class, 'store'])->name('banners.store');
            Route::get('/banners/{banner}/edit', [BannerController::class, 'edit'])->name('banners.edit');
            Route::put('/banners/{banner}', [BannerController::class, 'update'])->name('banners.update');
            Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banners.destroy');
            Route::get('/banners/{banner}', [BannerController::class, 'show'])->name('banners.show');

            Route::patch('/banners/{banner}/toggle', [BannerController::class, 'toggle'])->name('banners.toggle');
            Route::post('/banners/reorder', [BannerController::class, 'reorder'])->name('banners.reorder');
            Route::get('portal', [PortalSettingsController::class, 'edit'])->name('portal.edit');
            Route::prefix('portal')->name('portal.')->group(function () {
                Route::get('/', [PortalSettingsController::class, 'index'])->name('index');   // /admin/settings/portal
                Route::get('/{setting}', [PortalSettingsController::class, 'show'])->name('show');
                Route::get('/{setting}/edit', [PortalSettingsController::class, 'edit'])->name('edit');
                Route::put('/{setting}', [PortalSettingsController::class, 'update'])->name('update');
            });
            Route::get('popups', [PopupController::class, 'index'])->name('popups.index');
            Route::get('popups/create', [PopupController::class, 'create'])->name('popups.create');
            Route::post('popups', [PopupController::class, 'store'])->name('popups.store');
            Route::get('popups/{popup}', [PopupController::class, 'show'])->name('popups.show');
            Route::get('popups/{popup}/edit', [PopupController::class, 'edit'])->name('popups.edit');
            Route::put('popups/{popup}', [PopupController::class, 'update'])->name('popups.update');
            Route::delete('popups/{popup}', [PopupController::class, 'destroy'])->name('popups.destroy');
        });


        // ===== Słowniki =====
        Route::prefix('dictionaries')->name('dict.')->group(function () {
            Route::get('skills', [SkillController::class, 'index'])->name('skills.index');
            Route::get('skills/create', [SkillController::class, 'create'])->name('skills.create');
            Route::post('skills', [SkillController::class, 'store'])->name('skills.store');
            Route::get('skills/{skill}', [SkillController::class, 'show'])->name('skills.show');
            Route::get('skills/{skill}/edit', [SkillController::class, 'edit'])->name('skills.edit');
            Route::match(['put', 'patch'],
                'skills/{skill}', [SkillController::class, 'update'])->name('skills.update');
            Route::delete('skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');

            // dodatkowo (opcjonalny drag&drop)
            Route::post('skills/reorder', [SkillController::class, 'reorder'])->name('skills.reorder');
            Route::get('care-targets', [CareTargetController::class, 'index'])->name('care-targets.index');
            Route::get('care-targets/create', [CareTargetController::class, 'create'])->name('care-targets.create');
            Route::post('care-targets', [CareTargetController::class, 'store'])->name('care-targets.store');
            Route::get('care-targets/{care_target}', [CareTargetController::class, 'show'])->name('care-targets.show');
            Route::get('care-targets/{care_target}/edit', [CareTargetController::class, 'edit'])->name('care-targets.edit');
            Route::match(['put', 'patch'], 'care-targets/{care_target}', [CareTargetController::class, 'update'])->name('care-targets.update');
            Route::delete('care-targets/{care_target}', [CareTargetController::class, 'destroy'])->name('care-targets.destroy');
            Route::post('care-targets/reorder', [CareTargetController::class, 'reorder'])->name('care-targets.reorder');
            Route::get   ('mobility',                  [MobilityController::class, 'index'])->name('mobility.index');
            Route::get   ('mobility/create',           [MobilityController::class, 'create'])->name('mobility.create');
            Route::post  ('mobility',                  [MobilityController::class, 'store'])->name('mobility.store');
            Route::get   ('mobility/{mobility}',       [MobilityController::class, 'show'])->name('mobility.show');
            Route::get   ('mobility/{mobility}/edit',  [MobilityController::class, 'edit'])->name('mobility.edit');
            Route::match(['put','patch'], 'mobility/{mobility}', [MobilityController::class, 'update'])->name('mobility.update');
            Route::delete('mobility/{mobility}',       [MobilityController::class, 'destroy'])->name('mobility.destroy');
            Route::post  ('mobility/reorder',          [MobilityController::class, 'reorder'])->name('mobility.reorder');
            Route::get   ('genders',                 [GenderController::class,'index'])->name('genders.index');
            Route::get   ('genders/create',          [GenderController::class,'create'])->name('genders.create');
            Route::post  ('genders',                 [GenderController::class,'store'])->name('genders.store');
            Route::get   ('genders/{gender}',        [GenderController::class,'show'])->name('genders.show');
            Route::get   ('genders/{gender}/edit',   [GenderController::class,'edit'])->name('genders.edit');
            Route::match(['put','patch'],'genders/{gender}', [GenderController::class,'update'])->name('genders.update');
            Route::delete('genders/{gender}',        [GenderController::class,'destroy'])->name('genders.destroy');
            Route::post  ('genders/reorder',         [GenderController::class,'reorder'])->name('genders.reorder');
            Route::get   ('experience',                 [ExperienceController::class,'index'])->name('experience.index');
            Route::get   ('experience/create',          [ExperienceController::class,'create'])->name('experience.create');
            Route::post  ('experience',                 [ExperienceController::class,'store'])->name('experience.store');
            Route::get   ('experience/{experience}',    [ExperienceController::class,'show'])->name('experience.show');
            Route::get   ('experience/{experience}/edit',[ExperienceController::class,'edit'])->name('experience.edit');
            Route::match(['put','patch'],'experience/{experience}', [ExperienceController::class,'update'])->name('experience.update');
            Route::delete('experience/{experience}',    [ExperienceController::class,'destroy'])->name('experience.destroy');
            Route::post  ('experience/reorder',         [ExperienceController::class,'reorder'])->name('experience.reorder');            Route::resource('recruitment-reqs', RecruitmentRequirementController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('duties', DutyController::class)->only(['index', 'store', 'update', 'destroy']);
        });

        // ===== Zgody =====
        Route::prefix('consents')->name('consents.')->group(function () {
            Route::resource('forms', ConsentsFormController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::resource('contacts', ConsentsContactController::class)->only(['index', 'destroy']);
        });

        // ===== Wiadomości =====
        Route::prefix('messages')->name('msg.')->group(function () {
            // PL
            Route::prefix('pl')->name('pl.')->group(function () {
                Route::resource('front-contacts', PlFrontContactController::class)->only(['index', 'show', 'destroy']);
                Route::resource('site-contacts', PlSiteContactController::class)->only(['index', 'show', 'destroy']);
                Route::resource('forms', PlFormController::class)->only(['index', 'show', 'destroy']);
            });
            // DE
            Route::prefix('de')->name('de.')->group(function () {
                Route::resource('site-contacts', DeSiteContactController::class)->only(['index', 'show', 'destroy']);
                Route::resource('forms', DeFormController::class)->only(['index', 'show', 'destroy']);
            });
        });

        // ===== Partnerzy / Użytkownicy =====
        Route::resource('partners', PartnerController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::resource('users', UserController::class)->only(['index', 'show']);
    });

/*
|--------------------------------------------------------------------------
| Auth scaffolding
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
