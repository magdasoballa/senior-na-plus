<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // osobne zakresy dla kart (domyślnie 30 dni)
        $dSitePL  = max(1, (int) $request->input('days_site_pl', 30));
        $dAppsPL  = max(1, (int) $request->input('days_apps_pl', 30));
        $dOffers  = max(1, (int) $request->input('days_offers', 30));

        $sinceSitePL = now()->subDays($dSitePL);
        $sinceAppsPL = now()->subDays($dAppsPL);
        $sinceOffers = now()->subDays($dOffers);

        $countSince = function (string $table, $since): int {
            if (!Schema::hasTable($table)) return 0;
            $q = DB::table($table);
            if (Schema::hasColumn($table, 'created_at')) {
                $q->where('created_at', '>=', $since);
            }
            return (int) $q->count();
        };

        // Kontakty „Strona” PL — Twoja baza ma contact_messages
        $plSiteContacts = Schema::hasTable('contact_messages')
            ? $countSince('contact_messages', $sinceSitePL)
            : 0;

        // Formularze ofert pracy PL — applications
        $plJobForms = $countSince('applications', $sinceAppsPL);

        // Oferty pracy
        $offers = $countSince('offers', $sinceOffers);

        return Inertia::render('dashboard', [
            // aktualne zakresy (żeby selecty znały stan)
            'periods' => [
                'days_site_pl' => $dSitePL,
                'days_apps_pl' => $dAppsPL,
                'days_offers'  => $dOffers,
            ],
            'stats' => [
                'pl_site_contacts' => $plSiteContacts,
                'pl_job_forms'     => $plJobForms,
                'offers'           => $offers,
            ],
        ]);
    }
}
