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
        |--------------------------------------------------------------------------
        */
        $socials = Cache::remember("portal.social_links.$locale", 300, function () use ($locale) {

            if (!Schema::hasTable('social_links')) {
                return ['facebook' => null, 'instagram' => null, 'linkedin' => null];
            }

            $rows = DB::table('social_links')
                ->when(Schema::hasColumn('social_links', 'position'), fn($q) => $q->orderBy('position'))
                ->get();

            $normUrl = function (?string $u): ?string {
                $u = trim((string) $u);
                if ($u === '') {
                    return null;
                }
                if (!preg_match('#^https?://#i', $u)) {
                    $u = 'https://' . ltrim($u, '/');
                }
                return $u;
            };

            $resolvePlatform = function ($row, string $url): ?string {
                $platform = strtolower(trim((string) ($row->name ?? '')));

                if ($platform === '') {
                    $platform = strtolower(trim((string) ($row->icon ?? '')));
                }

                if ($platform === '') {
                    $host = strtolower((string) parse_url($url, PHP_URL_HOST));
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
                return $result;
            };

            $visibleCol = $locale === 'de' ? 'visible_de' : 'visible_pl';

            $pickVisible = ['facebook' => null, 'instagram' => null, 'linkedin' => null];
            $pickAny     = ['facebook' => null, 'instagram' => null, 'linkedin' => null];

            foreach ($rows as $r) {
                $url = $normUrl($r->url ?? null);
                if (!$url) continue;

                $platform = $resolvePlatform($r, $url);

                // ZMIANA TUTAJ - sprawdzaj czy platforma jest poprawna
                if ($platform === null || !in_array($platform, ['facebook', 'instagram', 'linkedin'])) {
                    continue;
                }

                if ($pickAny[$platform] === null) {
                    $pickAny[$platform] = $url;
                }

                $isVisible = true;
                if (Schema::hasColumn('social_links', 'visible_pl') && Schema::hasColumn('social_links', 'visible_de')) {
                    $isVisible = (bool) ($r->{$visibleCol} ?? false);
                }

                if ($isVisible && $pickVisible[$platform] === null) {
                    $pickVisible[$platform] = $url;
                }
            }

            $finalResult = [
                'facebook' => $pickVisible['facebook'] ,
                'instagram' => $pickVisible['instagram'] ,
                'linkedin' => $pickVisible['linkedin'] ,
            ];

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

        /*
        |--------------------------------------------------------------------------
        | NEW: activePopup -> props.activePopup (tylko na publicu, nie w /admin)
        |--------------------------------------------------------------------------
        */
        $activePopup = Cache::remember('active_popup.current', 60, function () use ($request) {
            // nie pokazujemy na ścieżkach admina
            if (str_starts_with($request->path(), 'admin')) {
                return null;
            }
            if (!Schema::hasTable('popups')) {
                return null;
            }

            // bierzemy tylko to, co faktycznie masz w tabeli
            $q = DB::table('popups')->where('is_visible', 1);

            // (opcjonalnie) okno czasowe jeśli kiedyś dodasz kolumny:
            if (Schema::hasColumn('popups', 'starts_at')) {
                $q->where(function ($qq) {
                    $qq->whereNull('starts_at')->orWhere('starts_at', '<=', now());
                });
            }
            if (Schema::hasColumn('popups', 'ends_at')) {
                $q->where(function ($qq) {
                    $qq->whereNull('ends_at')->orWhere('ends_at', '>=', now());
                });
            }

            // wybierz realne kolumny z Twojej tabeli
            $row = $q->orderByDesc('id')->first(['id','name','link','image_path']);
            if (!$row) return null;

            // zbuduj URL do obrazka:
            $imageUrl = null;
            if (!empty($row->image_path)) {
                $path = (string) $row->image_path;

                // jeżeli w bazie jest już pełny URL – użyj go
                if (preg_match('#^https?://#i', $path)) {
                    $imageUrl = $path;
                } else {
                    // zakładam upload na dysku "public" -> storage/app/public/
                    // i symlink public/storage -> storage/app/public (php artisan storage:link)
                    try {
                        $imageUrl = Storage::disk('public')->url($path);
                    } catch (\Throwable $e) {
                        // awaryjnie: spróbuj przez asset() jeśli plik jest w public/
                        $imageUrl = url(trim($path, '/'));
                    }
                }
            }

            return [
                'id'        => (int) $row->id,
                'name'      => (string) ($row->name ?? ''),
                'link'      => $row->link ? (string) $row->link : null,
                'image_url' => $imageUrl, // front oczekuje image_url
            ];
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

            'msg_badges' => Cache::remember('admin.msg_badges_v2', 5, fn () => $this->messageBadgesSafe()),

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

            // PRZEKAZUJEMY DO FRONTU:
            'activePopup' => $activePopup,

            // przydatne globalnie
            'menuPages' => $menuPages,
            'locale'    => $locale,
        ];
    }

    protected function messageBadgesSafe(): array
    {
        try {
            // --- Kontakty Strona (PL) ---
            if (\Illuminate\Support\Facades\Schema::hasTable('contact_messages')) {
                $plSite = (int) \Illuminate\Support\Facades\DB::table('contact_messages')->count();
            } else {
                $q = \Illuminate\Support\Facades\DB::table('site_contacts');
                if (\Illuminate\Support\Facades\Schema::hasColumn('site_contacts', 'locale')) {
                    $q->where('locale', 'pl');
                }
                if (\Illuminate\Support\Facades\Schema::hasColumn('site_contacts', 'is_read')) {
                    // $q->where('is_read', 0);
                }
                $plSite = (int) $q->count();
            }

            // --- Formularze (PL) -> applications (jak w liście) ---
            $plFormsQ = \Illuminate\Support\Facades\DB::table('applications');
            if (\Illuminate\Support\Facades\Schema::hasColumn('applications', 'status')) {
                $plFormsQ->where('status', 'new');
            }
            $plForms = (int) $plFormsQ->count();

            return [
                '/admin/messages/pl/site-contacts' => $plSite,
                '/admin/messages/pl/forms'         => $plForms,
            ];
        } catch (\Throwable $e) {
            return [];
        }
    }
}
