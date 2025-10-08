<?php

use App\Http\Controllers\Admin\Consents\FormController;
use App\Http\Controllers\Admin\Dictionaries\CareTargetController;
use App\Http\Controllers\Admin\Dictionaries\DutyController;
use App\Http\Controllers\Admin\Dictionaries\ExperienceController;
use App\Http\Controllers\Admin\Dictionaries\GenderController;
use App\Http\Controllers\Admin\Dictionaries\MobilityController;
use App\Http\Controllers\Admin\Dictionaries\RecruitmentRequirementController;
use App\Http\Controllers\Admin\Dictionaries\SkillController;
use App\Http\Controllers\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\Admin\Offers\OfferDutyController;
use App\Http\Controllers\Admin\Offers\PerkController;
use App\Http\Controllers\Admin\Offers\RequirementController;
use App\Http\Controllers\Admin\Offers\RequirementController as OfferRequirementController;
use App\Http\Controllers\Admin\Offers\PerkController as OfferPerkController;
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
use App\Http\Controllers\Admin\Consents\ContactController as ConsentsContactController;
use App\Http\Controllers\Admin\Messages\Pl\FrontContactController as PlFrontContactController;
use App\Http\Controllers\Admin\Messages\Pl\SiteContactController  as PlSiteContactController;
use App\Http\Controllers\Admin\Messages\Pl\FormController        as PlFormController;

use App\Http\Controllers\Admin\Messages\De\SiteContactController  as DeSiteContactController;
use App\Http\Controllers\Admin\Messages\De\FormController        as DeFormController;

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
        Route::get('offers/{offer}', [AdminOfferController::class, 'show'])
            ->whereNumber('offer')
            ->name('offers.show');
        // ===== Oferty – słowniki do ofert (pełny CRUD jak w "Słownikach") =====
        Route::prefix('offers')->name('offers.')->group(function () {
            Route::resource('duties', OfferDutyController::class);
            Route::resource('requirements', OfferRequirementController::class);
            Route::resource('perks', OfferPerkController::class);
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
            Route::match(['put', 'patch'], 'skills/{skill}', [SkillController::class, 'update'])->name('skills.update');
            Route::delete('skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');
            Route::post('skills/reorder', [SkillController::class, 'reorder'])->name('skills.reorder');

            Route::get('care-targets', [CareTargetController::class, 'index'])->name('care-targets.index');
            Route::get('care-targets/create', [CareTargetController::class, 'create'])->name('care-targets.create');
            Route::post('care-targets', [CareTargetController::class, 'store'])->name('care-targets.store');
            Route::get('care-targets/{care_target}', [CareTargetController::class, 'show'])->name('care-targets.show');
            Route::get('care-targets/{care_target}/edit', [CareTargetController::class, 'edit'])->name('care-targets.edit');
            Route::match(['put', 'patch'], 'care-targets/{care_target}', [CareTargetController::class, 'update'])->name('care-targets.update');
            Route::delete('care-targets/{care_target}', [CareTargetController::class, 'destroy'])->name('care-targets.destroy');
            Route::post('care-targets/reorder', [CareTargetController::class, 'reorder'])->name('care-targets.reorder');

            Route::get('mobility', [MobilityController::class, 'index'])->name('mobility.index');
            Route::get('mobility/create', [MobilityController::class, 'create'])->name('mobility.create');
            Route::post('mobility', [MobilityController::class, 'store'])->name('mobility.store');
            Route::get('mobility/{mobility}', [MobilityController::class, 'show'])->name('mobility.show');
            Route::get('mobility/{mobility}/edit', [MobilityController::class, 'edit'])->name('mobility.edit');
            Route::match(['put','patch'], 'mobility/{mobility}', [MobilityController::class, 'update'])->name('mobility.update');
            Route::delete('mobility/{mobility}', [MobilityController::class, 'destroy'])->name('mobility.destroy');
            Route::post('mobility/reorder', [MobilityController::class, 'reorder'])->name('mobility.reorder');

            Route::get('genders', [GenderController::class,'index'])->name('genders.index');
            Route::get('genders/create', [GenderController::class,'create'])->name('genders.create');
            Route::post('genders', [GenderController::class,'store'])->name('genders.store');
            Route::get('genders/{gender}', [GenderController::class,'show'])->name('genders.show');
            Route::get('genders/{gender}/edit', [GenderController::class,'edit'])->name('genders.edit');
            Route::match(['put','patch'], 'genders/{gender}', [GenderController::class,'update'])->name('genders.update');
            Route::delete('genders/{gender}', [GenderController::class,'destroy'])->name('genders.destroy');
            Route::post('genders/reorder', [GenderController::class,'reorder'])->name('genders.reorder');

            Route::get('experience', [ExperienceController::class,'index'])->name('experience.index');
            Route::get('experience/create', [ExperienceController::class,'create'])->name('experience.create');
            Route::post('experience', [ExperienceController::class,'store'])->name('experience.store');
            Route::get('experience/{experience}', [ExperienceController::class,'show'])->name('experience.show');
            Route::get('experience/{experience}/edit', [ExperienceController::class,'edit'])->name('experience.edit');
            Route::match(['put','patch'], 'experience/{experience}', [ExperienceController::class,'update'])->name('experience.update');
            Route::delete('experience/{experience}', [ExperienceController::class,'destroy'])->name('experience.destroy');
            Route::post('experience/reorder', [ExperienceController::class,'reorder'])->name('experience.reorder');

            Route::get('recruitment-reqs', [RecruitmentRequirementController::class,'index'])->name('recruitment-reqs.index');
            Route::get('recruitment-reqs/create', [RecruitmentRequirementController::class,'create'])->name('recruitment-reqs.create');
            Route::post('recruitment-reqs', [RecruitmentRequirementController::class,'store'])->name('recruitment-reqs.store');
            // uwaga na nazwę parametru w URL (recruitment_req), żeby pasowała do metod kontrolera
            Route::get('recruitment-reqs/{recruitment_req}', [RecruitmentRequirementController::class,'show'])->name('recruitment-reqs.show');
            Route::get('recruitment-reqs/{recruitment_req}/edit', [RecruitmentRequirementController::class,'edit'])->name('recruitment-reqs.edit');
            Route::match(['put','patch'],'recruitment-reqs/{recruitment_req}', [RecruitmentRequirementController::class,'update'])->name('recruitment-reqs.update');
            Route::delete('recruitment-reqs/{recruitment_req}', [RecruitmentRequirementController::class,'destroy'])->name('recruitment-reqs.destroy');
            Route::post('recruitment-reqs/reorder', [RecruitmentRequirementController::class,'reorder'])->name('recruitment-reqs.reorder');

            Route::get('duties', [DutyController::class, 'index'])->name('duties.index');
            Route::get('duties/create', [DutyController::class, 'create'])->name('duties.create');
            Route::post('duties', [DutyController::class, 'store'])->name('duties.store');
            Route::get('duties/{duty}', [DutyController::class, 'show'])->name('duties.show');
            Route::get('duties/{duty}/edit', [DutyController::class, 'edit'])->name('duties.edit');
            Route::match(['put','patch'], 'duties/{duty}', [DutyController::class, 'update'])->name('duties.update');
            Route::delete('duties/{duty}', [DutyController::class, 'destroy'])->name('duties.destroy');
            Route::post('duties/reorder', [DutyController::class, 'reorder'])->name('duties.reorder');
        });

        Route::prefix('offers')->name('offers.')->group(function () {
            Route::get   ('duties',              [OfferDutyController::class, 'index'  ])->name('duties.index');
            Route::get   ('duties/create',       [OfferDutyController::class, 'create' ])->name('duties.create');
            Route::post  ('duties',              [OfferDutyController::class, 'store'  ])->name('duties.store');
            Route::get   ('duties/{duty}',       [OfferDutyController::class, 'show'   ])->name('duties.show');
            Route::get   ('duties/{duty}/edit',  [OfferDutyController::class, 'edit'   ])->name('duties.edit');
            Route::match (['put','patch'], 'duties/{duty}', [OfferDutyController::class, 'update'])->name('duties.update');
            Route::delete('duties/{duty}',       [OfferDutyController::class, 'destroy'])->name('duties.destroy');

            Route::get   ('requirements',              [RequirementController::class, 'index'  ])->name('requirements.index');
            Route::get   ('requirements/create',       [RequirementController::class, 'create' ])->name('requirements.create');
            Route::post  ('requirements',              [RequirementController::class, 'store'  ])->name('requirements.store');
            Route::get   ('requirements/{requirement}',       [RequirementController::class, 'show'   ])->name('requirements.show');
            Route::get   ('requirements/{requirement}/edit',  [RequirementController::class, 'edit'   ])->name('requirements.edit');
            Route::match (['put','patch'], 'requirements/{requirement}', [RequirementController::class, 'update'])->name('requirements.update');
            Route::delete('requirements/{requirement}',       [RequirementController::class, 'destroy'])->name('requirements.destroy');


            Route::get   ('perks',              [PerkController::class, 'index'  ])->name('perks.index');
            Route::get   ('perks/create',       [PerkController::class, 'create' ])->name('perks.create');
            Route::post  ('perks',              [PerkController::class, 'store'  ])->name('perks.store');
            Route::get   ('perks/{perk}',       [PerkController::class, 'show'   ])->name('perks.show');
            Route::get   ('perks/{perk}/edit',  [PerkController::class, 'edit'   ])->name('perks.edit');
            Route::match (['put','patch'], 'perks/{perk}', [PerkController::class, 'update'])->name('perks.update');
            Route::delete('perks/{perk}',       [PerkController::class, 'destroy'])->name('perks.destroy');

            // opcjonalnie: drag&drop sortowanie
            Route::post  ('duties/reorder',      [OfferDutyController::class, 'reorder'])->name('duties.reorder');
        });

        // ===== Zgody =====
//        Route::prefix('consents')->name('consents.')->group(function () {
//            Route::resource('forms', ConsentsFormController::class)->only(['index', 'store', 'update', 'destroy']);
//            Route::resource('contacts', ConsentsContactController::class)->only(['index', 'destroy']);

        Route::prefix('consents/forms')->name('consents.forms.')->group(function () {
            Route::get('/', [FormController::class, 'index'])->name('index');
            Route::get('/create', [FormController::class, 'create'])->name('create');
            Route::post('/', [FormController::class, 'store'])->name('store');

            Route::get('{form}', [FormController::class, 'show'])->whereNumber('form')->name('show');
            Route::get('{form}/edit', [FormController::class, 'edit'])->whereNumber('form')->name('edit');
            Route::put('{form}', [FormController::class, 'update'])->whereNumber('form')->name('update');
            Route::delete('{form}', [FormController::class, 'destroy'])->whereNumber('form')->name('destroy');
            Route::patch('{form}/toggle/{locale}', [FormController::class, 'toggle'])
                ->whereNumber('form')->whereIn('locale', ['pl','de'])->name('toggle');
        });

        Route::prefix('consents/contacts')->name('consents.contacts.')->group(function () {
            Route::get   ('/',                 [ConsentsContactController::class,'index'])->name('index');
            Route::get   ('/create',           [ConsentsContactController::class,'create'])->name('create');
            Route::post  ('/',                 [ConsentsContactController::class,'store'])->name('store');
            Route::get   ('{contact}',         [ConsentsContactController::class,'show'])->whereNumber('contact')->name('show');
            Route::get   ('{contact}/edit',    [ConsentsContactController::class,'edit'])->whereNumber('contact')->name('edit');
            Route::put   ('{contact}',         [ConsentsContactController::class,'update'])->whereNumber('contact')->name('update');
            Route::delete('{contact}',         [ConsentsContactController::class,'destroy'])->whereNumber('contact')->name('destroy');
            Route::patch ('{contact}/toggle/{locale}', [ConsentsContactController::class,'toggle'])
                ->whereNumber('contact')->whereIn('locale',['pl','de'])->name('toggle');
        });
//        });

        // ===== Wiadomości =====
        Route::prefix('messages')->name('msg.')->group(function () {

            // === PL ===
            Route::prefix('pl')->name('pl.')->group(function () {
                // Front contacts (PL)
                Route::resource('front-contacts', \App\Http\Controllers\Admin\Messages\Pl\FrontContactController::class)
                    ->only(['index','show','edit','update','destroy'])
                    ->parameters(['front-contacts' => 'contact']);

                Route::patch('front-contacts/{contact}/toggle-read',
                    [\App\Http\Controllers\Admin\Messages\Pl\FrontContactController::class, 'toggleRead'])
                    ->name('front-contacts.toggle-read');

                // Site contacts (PL)
                Route::resource('site-contacts', \App\Http\Controllers\Admin\Messages\Pl\SiteContactController::class)
                    ->only(['index','show','edit','update','destroy'])
                    ->parameters(['site-contacts' => 'contact']);

                Route::patch('site-contacts/{contact}/toggle-read',
                    [\App\Http\Controllers\Admin\Messages\Pl\SiteContactController::class, 'toggleRead'])
                    ->name('site-contacts.toggle-read');

                // Formularze (PL)
                Route::resource('forms', \App\Http\Controllers\Admin\Messages\Pl\FormController::class)
                    ->only(['index','show','edit','update','destroy'])
                    ->parameters(['forms' => 'form']);

                Route::patch('forms/{form}/toggle-read',
                    [\App\Http\Controllers\Admin\Messages\Pl\FormController::class, 'toggleRead'])
                    ->name('forms.toggle-read');
            });

            // === DE ===
            Route::prefix('de')->name('de.')->group(function () {
                // Site contacts (DE)
                Route::resource('site-contacts', \App\Http\Controllers\Admin\Messages\De\SiteContactController::class)
                    ->only(['index','show','edit','update','destroy'])
                    ->parameters(['site-contacts' => 'contact']);

                Route::patch('site-contacts/{contact}/toggle-read',
                    [\App\Http\Controllers\Admin\Messages\De\SiteContactController::class, 'toggleRead'])
                    ->name('site-contacts.toggle-read');

                // Formularze (DE) — pełny CRUD widoczny na screenach
                Route::resource('forms', \App\Http\Controllers\Admin\Messages\De\FormController::class)
                    ->only(['index','show','edit','update','destroy'])
                    ->parameters(['forms' => 'form']); // {form} -> FormSubmission

                Route::patch('forms/{form}/toggle-read',
                    [\App\Http\Controllers\Admin\Messages\De\FormController::class, 'toggleRead'])
                    ->name('forms.toggle-read');
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
