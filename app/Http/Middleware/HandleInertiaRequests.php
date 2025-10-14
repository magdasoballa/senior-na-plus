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

        $user   = $request->user();
        $locale = app()->getLocale(); // 'pl' | 'de'
        $visibleCol = $locale === 'de' ? 'visible_de' : 'visible_pl';

        /*
        |--------------------------------------------------------------------------
        | portal_settings -> props.portal (PL/DE z fallbackiem)
        |--------------------------------------------------------------------------
        */
        $portalFromDb = Cache::remember("portal_settings.current.$locale", 300, function () use ($locale, $visibleCol) {
            if (!Schema::hasTable('portal_settings')) {
                return null;
            }

            // Bierzemy cały rekord, żeby uniknąć błędów 1054 przy brakujących kolumnach
            $rowObj = DB::table('portal_settings')->first();
            if (!$rowObj) return null;

            $row = (array) $rowObj;

            // helper do wyboru pola zależnie od locale z fallbackiem do ogólnego
            $pick = function (string $base, string $pl, string $de) use ($row, $locale): ?string {
                $v = $locale === 'de'
                    ? ($row[$de] ?? null)
                    : ($row[$pl] ?? null);
                return ($v ?: ($row[$base] ?? null)) ?: null;
            };

            // address -> addressLines (dziel po \n, przecinku lub |)
            $address = $pick('address', 'address_pl', 'address_de');
            $addressLines = $address
                ? array_values(array_filter(array_map('trim', preg_split('/\r\n|\n|,|\|/', $address))))
                : [];

            // Linki do Polityki/Regulaminu — znajdź w pages i sprawdź widoczność
            [$privacyUrl, $termsUrl] = [null, null];
            if (Schema::hasTable('pages')) {
                $privacyCandidates = ['/privacy-policy','/polityka-prywatnosci'];
                $termsCandidates   = ['/terms-of-use','/regulamin'];

                $privacyUrl = DB::table('pages')
                    ->whereIn('slug', $privacyCandidates)
                    ->when(Schema::hasColumn('pages', $visibleCol), fn($q) => $q->where($visibleCol, 1))
                    ->orderByRaw("FIELD(slug, '".implode("','", $privacyCandidates)."')")
                    ->value('slug');

                $termsUrl = DB::table('pages')
                    ->whereIn('slug', $termsCandidates)
                    ->when(Schema::hasColumn('pages', $visibleCol), fn($q) => $q->where($visibleCol, 1))
                    ->orderByRaw("FIELD(slug, '".implode("','", $termsCandidates)."')")
                    ->value('slug');
            }

            return [
                'brand'             => $row['brand'] ?? null, // jeśli masz kolumnę brand
                'addressLines'      => $addressLines,
                'phone'             => $pick('phone', 'phone_pl', 'phone_de'),
                'email'             => $pick('email', 'email_pl', 'email_de'),
                'privacyPolicyUrl'  => $privacyUrl ?: null,
                'termsOfServiceUrl' => $termsUrl   ?: null,
            ];
        });

        /*
        |--------------------------------------------------------------------------
        | social_links -> props.portal.socials (facebook/instagram/linkedin)
        |  Używa kolumn: name, url, icon, visible_pl, visible_de, position (jeśli są)
        |--------------------------------------------------------------------------
        */
        // === SOCIAL LINKS z bazy -> props.portal.socials ===
        $socials = Cache::remember("portal.social_links.$locale", 300, function () use ($locale) {
            \Log::info('=== SOCIAL LINKS PROCESSING START ===');

            if (!Schema::hasTable('social_links')) {
                \Log::warning('Social links table does not exist');
                return ['facebook' => null, 'instagram' => null, 'linkedin' => null];
            }

            $rows = DB::table('social_links')
                ->when(Schema::hasColumn('social_links', 'position'), fn($q) => $q->orderBy('position'))
                ->get();

            \Log::info('Raw social links data from database:', [
                'row_count' => $rows->count(),
                'rows' => $rows->toArray()
            ]);

            $normUrl = function (?string $u): ?string {
                $u = trim((string) $u);
                if ($u === '') {
                    \Log::debug('URL is empty');
                    return null;
                }
                if (!preg_match('#^https?://#i', $u)) {
                    $u = 'https://' . ltrim($u, '/');
                    \Log::debug('URL normalized to: ' . $u);
                }
                return $u;
            };

            $resolvePlatform = function ($row, string $url): ?string {
                $platform = strtolower(trim((string) ($row->name ?? '')));
                \Log::debug('Platform from name: "' . $platform . '"');

                if ($platform === '') {
                    $platform = strtolower(trim((string) ($row->icon ?? '')));
                    \Log::debug('Platform from icon: "' . $platform . '"');
                }

                if ($platform === '') {
                    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
                    \Log::debug('Platform from host: "' . $host . '"');
                    if (str_contains($host, 'facebook.com'))      $platform = 'facebook';
                    elseif (str_contains($host, 'instagram.com')) $platform = 'instagram';
                    elseif (str_contains($host, 'linkedin.com'))  $platform = 'linkedin';
                }

                $aliases = [
                    'fb' => 'facebook', 'facebok' => 'facebook', 'facebook' => 'facebook',
                    'ig' => 'instagram', 'insta' => 'instagram', 'instagram' => 'instagram',
                    'ln' => 'linkedin', 'linked-in' => 'linkedin', 'linkedin' => 'linkedin',
                ];
                $result = $aliases[$platform] ?? ($platform ?: null);
                \Log::debug('Final platform: "' . $result . '"');
                return $result;
            };

            $visibleCol = $locale === 'de' ? 'visible_de' : 'visible_pl';
            \Log::info('Using visibility column: ' . $visibleCol);

            $pickVisible = ['facebook' => null, 'instagram' => null, 'linkedin' => null];
            $pickAny     = ['facebook' => null, 'instagram' => null, 'linkedin' => null];

            foreach ($rows as $r) {
                $url = $normUrl($r->url ?? null);
                if (!$url) continue;

                $platform = $resolvePlatform($r, $url);

                // ZMIANA TUTAJ - sprawdzaj czy platforma jest poprawna
                if ($platform === null || !in_array($platform, ['facebook', 'instagram', 'linkedin'])) {
                    \Log::warning('Platform not allowed: ' . ($platform ?? 'NULL'));
                    continue;
                }

                if ($pickAny[$platform] === null) {
                    $pickAny[$platform] = $url;
                    \Log::debug('Added to pickAny: ' . $platform . ' -> ' . $url);
                }

                $isVisible = true;
                if (Schema::hasColumn('social_links', 'visible_pl') && Schema::hasColumn('social_links', 'visible_de')) {
                    $isVisible = (bool) ($r->{$visibleCol} ?? false);
                    \Log::debug('Visibility for ' . $platform . ': ' . ($isVisible ? 'VISIBLE' : 'HIDDEN'));
                }

                if ($isVisible && $pickVisible[$platform] === null) {
                    $pickVisible[$platform] = $url;
                    \Log::info('ADDED TO VISIBLE: ' . $platform . ' -> ' . $url);
                }
            }

            $finalResult = [
                'facebook' => $pickVisible['facebook'] ,
                'instagram' => $pickVisible['instagram'] ,
                'linkedin' => $pickVisible['linkedin'] ,
            ];

            \Log::info('=== SOCIAL LINKS FINAL RESULT ===', [
                'pickVisible' => $pickVisible,
                'pickAny' => $pickAny,
                'final_socials' => $finalResult
            ]);

            return $finalResult;
        });

        // (opcjonalnie) menu przefiltrowane po widoczności – przydatne w layoucie
        $menuPages = Cache::remember("menu.pages.$locale", 300, function () use ($visibleCol) {
            if (!Schema::hasTable('pages')) return [];
            return DB::table('pages')
                ->when(Schema::hasColumn('pages', $visibleCol), fn($q) => $q->where($visibleCol, 1))
                ->orderBy('position')
                ->orderBy('id')
                ->get(['id','name','slug'])
                ->map(fn($r) => ['id' => $r->id, 'name' => $r->name, 'slug' => $r->slug])
                ->all();
        });

        return [
            ...parent::share($request),

            'name'  => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author'  => trim($author),
            ],

            'auth' => [
                'user'    => $user ? $user->only(['id','name','email','is_admin']) : null,
                'isAdmin' => (bool) optional($user)->is_admin,
            ],

            'sidebarOpen' => ! $request->hasCookie('sidebar_state')
                || $request->cookie('sidebar_state') === 'true',

            'msg_badges' => Cache::remember('admin.msg_badges', 5, fn () => $this->messageBadgesSafe()),

            // --> dane do frontu (Footer itp.)
            'portal' => [
                ...( $portalFromDb ?? [
                    'brand' => 'Senior na plus',
                    'addressLines' => ['ul. Chorzowska 44c','44-100 Gliwice'],
                    'phone' => '32 440 15 54',
                    'email' => 'kontakt@seniornaplus.pl',
                    'privacyPolicyUrl'  => null,
                    'termsOfServiceUrl' => null,
                ]),
                'socials' => $socials, // { facebook|null, instagram|null, linkedin|null }
            ],

            // przydatne globalnie
            'menuPages' => $menuPages,
            'locale'    => $locale,
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
