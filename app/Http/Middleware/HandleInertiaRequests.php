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

        $user = $request->user();

        return [
            ...parent::share($request),

            'name'  => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author'  => trim($author),
            ],

            // 👇 udostępniamy zarówno całego usera (jeśli potrzebny),
            // jak i prostą flagę isAdmin do szybkiego użycia na froncie
            'auth' => [
                'user'    => $user ? $user->only(['id', 'name', 'email', 'is_admin']) : null,
                'isAdmin' => (bool) optional($user)->is_admin,
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            'msg_badges' => Cache::remember('admin.msg_badges', 5, function () {
                return $this->messageBadgesSafe();
            }),
        ];
    }

    protected function messageBadgesSafe(): array
    {
        try {
            // PL
            $plFront = (int) DB::table('front_contacts')->where('is_read', 0)->count();

            $plSiteQ = DB::table('site_contacts')->where('is_read', 0);
            if (Schema::hasColumn('site_contacts', 'locale')) $plSiteQ->where('locale', 'pl');
            $plSite = (int) $plSiteQ->count();

            $plFormsQ = DB::table('site_forms')->where('is_read', 0);
            if (Schema::hasColumn('site_forms', 'locale')) $plFormsQ->where('locale', 'pl');
            $plForms = (int) $plFormsQ->count();

            // DE
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
                '/admin/messages/pl/front-contacts' => $plFront,
                '/admin/messages/pl/site-contacts'  => $plSite,
                '/admin/messages/pl/forms'          => $plForms,
                '/admin/messages/de/site-contacts'  => $deSite,
                '/admin/messages/de/forms'          => $deForms,
            ];
        } catch (\Throwable $e) {
            \Log::error('msg_badges error: ' . $e->getMessage());
            return [];
        }
    }
}
