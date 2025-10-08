<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Middleware;
use Illuminate\Foundation\Inspiring;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            'name'  => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author'  => trim($author),
            ],

            'auth' => [
                'user' => $request->user(),
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            // 👇 to czyta AdminLayout
            'msg_badges' => Cache::remember('admin.msg_badges', 5, function () {
                return $this->messageBadgesSafe();
            }),
        ];
    }

    /** Zwraca liczby nieprzeczytanych pod kluczami dokładnie takimi jak href w menu */
    protected function messageBadgesSafe(): array
    {
        try {
            // PL
            $plFront = (int) DB::table('front_contacts')
                ->where('is_read', 0)
                ->count();

            $plSiteQ = DB::table('site_contacts')->where('is_read', 0);
            if (Schema::hasColumn('site_contacts', 'locale')) {
                $plSiteQ->where('locale', 'pl');
            }
            $plSite = (int) $plSiteQ->count();

            $plFormsQ = DB::table('site_forms')->where('is_read', 0);
            if (Schema::hasColumn('site_forms', 'locale')) {
                $plFormsQ->where('locale', 'pl');
            }
            $plForms = (int) $plFormsQ->count();

            // DE – preferuj osobne tabele, a jeśli ich nie ma, filtruj po locale
            $deSite = Schema::hasTable('de_site_contacts')
                ? (int) DB::table('de_site_contacts')->where('is_read', 0)->count()
                : (Schema::hasColumn('site_contacts', 'locale')
                    ? (int) DB::table('site_contacts')->where('locale', 'de')->where('is_read', 0)->count()
                    : 0);

            $deForms = Schema::hasTable('de_forms')
                ? (int) DB::table('de_forms')->where('is_read', 0)->count()
                : (Schema::hasColumn('site_forms', 'locale')
                    ? (int) DB::table('site_forms')->where('locale', 'de')->where('is_read', 0)->count()
                    : 0);

            return [
                // PL
                '/admin/messages/pl/front-contacts' => $plFront,
                '/admin/messages/pl/site-contacts'  => $plSite,
                '/admin/messages/pl/forms'          => $plForms,
                // DE
                '/admin/messages/de/site-contacts'  => $deSite,
                '/admin/messages/de/forms'          => $deForms,
            ];
        } catch (\Throwable $e) {
            \Log::error('msg_badges error: ' . $e->getMessage());
            return []; // nie blokuj UI gdy są migracje w trakcie
        }
    }
}
