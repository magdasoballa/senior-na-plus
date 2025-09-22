<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $q         = trim((string) $request->query('q', ''));
        $city      = trim((string) $request->query('city', ''));
        $country   = trim((string) $request->query('country', ''));
        $language  = trim((string) $request->query('language', ''));
        $startFrom = $request->query('start_from'); // YYYY-MM-DD
        $startTo   = $request->query('start_to');   // YYYY-MM-DD
        $duration  = trim((string) $request->query('duration', '')); // tekst
        $gender    = $request->query('gender');     // 'female' | 'male'
        $mobility  = $request->query('mobility');   // 'mobile' | 'limited' | 'immobile'
        // '0'/'1'/null – walidacja, żeby nie odsiać '0'
        $lives     = $request->query('lives_alone');
        $livesAlone = in_array($lives, ['0','1'], true) ? $lives : null;

        $withWage  = $request->boolean('with_wage');

        $query = Offer::query()
            ->select([
                'id','title','city','country','start_date','duration','language','wage',
                'care_recipient_gender','mobility','lives_alone',
            ])
            ->when($q !== '', function ($qr) use ($q) {
                $qr->where(function ($w) use ($q) {
                    $w->where('title','like',"%{$q}%")
                        ->orWhere('city','like',"%{$q}%");
                });
            })
            ->when($city !== '',     fn($qr) => $qr->where('city','like',"%{$city}%"))
            ->when($country !== '',  fn($qr) => $qr->where('country','like',"%{$country}%"))
            ->when($language !== '', fn($qr) => $qr->where('language','like',"%{$language}%"))
            ->when($startFrom,       fn($qr) => $qr->whereDate('start_date','>=',$startFrom))
            ->when($startTo,         fn($qr) => $qr->whereDate('start_date','<=',$startTo))
            ->when($duration !== '', fn($qr) => $qr->where('duration','like',"%{$duration}%"))
            ->when(in_array($gender, ['female','male'], true),
                fn($qr) => $qr->where('care_recipient_gender', $gender))
            ->when(in_array($mobility, ['mobile','limited','immobile'], true),
                fn($qr) => $qr->where('mobility', $mobility))
            ->when($livesAlone !== null,
                fn($qr) => $qr->where('lives_alone', (bool) $livesAlone))
            ->when($withWage,        fn($qr) => $qr->whereNotNull('wage')->where('wage','!=',''));

        $paginator = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Offers/Index', [
            'offers'  => $paginator,
            'filters' => [
                'q' => $q,
                'city' => $city,
                'country' => $country,
                'language' => $language,
                'start_from' => $startFrom,
                'start_to' => $startTo,
                'duration' => $duration,
                'gender' => in_array($gender, ['female','male'], true) ? $gender : '',
                'mobility' => in_array($mobility, ['mobile','limited','immobile'], true) ? $mobility : '',
                'lives_alone' => $livesAlone ?? '',
                'with_wage' => $withWage,
            ],
        ]);
    }

}
