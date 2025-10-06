<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfferController extends Controller
{
    /**
     * Lista ofert (filtry + liczniki relacji na liście).
     */
    public function index(Request $request)
    {
        $search   = (string) $request->get('search', '');
        $sort     = $this->allowedSort($request->get('sort', 'created_at'));
        $dir      = $this->allowedDir($request->get('dir', 'desc'));
        $perPage  = $this->allowedPerPage((int) $request->get('per_page', 20));

        $offers = Offer::query()
            ->select(['id', 'title', 'city', 'country', 'language', 'wage', 'created_at'])
            ->withCount([
                'duties as duties_count',
                'requirements as requirements_count',
                'perks as perks_count',
            ])
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%")
                        ->orWhere('language', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/offers/Index', [
            'offers'  => $offers,
            'filters' => [
                'search'   => $search,
                'sort'     => $sort,
                'dir'      => $dir,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Formularz tworzenia.
     */
    public function create()
    {
        return Inertia::render('Admin/offers/Form', [
            'offer' => null,
        ]);
    }

    /**
     * Zapis nowej oferty.
     * Dopasuj reguły walidacji do swojego modelu.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'city'        => ['nullable', 'string', 'max:255'],
            'country'     => ['nullable', 'string', 'max:255'],
            'language'    => ['nullable', 'string', 'max:255'],
            'wage'        => ['nullable'], // liczba/tekst – zależnie jak trzymasz
            'start_date'  => ['nullable', 'date'],
            'region'      => ['nullable', 'string', 'max:255'],
            'new_city'    => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_visible'  => ['sometimes', 'boolean'],
        ]);

        $data['is_visible'] = $request->boolean('is_visible');

        $offer = Offer::create($data);

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.offers.edit', $offer)
            : to_route('admin.offers.index');
    }

    /**
     * PODGLĄD pojedynczej oferty (admin).
     */
    public function show(Offer $offer)
    {
        // Załaduj słowniki; jeśli masz pivoty z "checked", dołóż ->withPivot('checked')
        $offer->load([
            'duties:id,name',
            'requirements:id,name',
            'perks:id,name',
        ]);

        // Jeżeli potrzebujesz jawnej struktury pod frontend:
        $payload = [
            'id'          => $offer->id,
            'title'       => $offer->title,
            'start_date'  => $offer->start_date,
            'country'     => $offer->country,
            'region'      => $offer->region,
            'city'        => $offer->city,
            'new_city'    => $offer->new_city,
            'language'    => $offer->language,
            'wage'        => $offer->wage,
            'description' => $offer->description,
            'is_visible'  => (bool) $offer->is_visible,
            'duties'       => $offer->duties->map(fn ($i) => [
                'id' => $i->id, 'name' => $i->name, 'checked' => true,
            ])->values(),
            'requirements' => $offer->requirements->map(fn ($i) => [
                'id' => $i->id, 'name' => $i->name, 'checked' => true,
            ])->values(),
            'perks'        => $offer->perks->map(fn ($i) => [
                'id' => $i->id, 'name' => $i->name, 'checked' => true,
            ])->values(),
        ];

        return Inertia::render('Admin/offers/Show', [
            'offer' => $payload,
        ]);
    }

    /**
     * Formularz edycji.
     */
    public function edit(Offer $offer)
    {
        return Inertia::render('Admin/offers/Form', [
            'offer' => $offer,
        ]);
    }

    /**
     * Aktualizacja.
     */
    public function update(Request $request, Offer $offer)
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'city'        => ['nullable', 'string', 'max:255'],
            'country'     => ['nullable', 'string', 'max:255'],
            'language'    => ['nullable', 'string', 'max:255'],
            'wage'        => ['nullable'],
            'start_date'  => ['nullable', 'date'],
            'region'      => ['nullable', 'string', 'max:255'],
            'new_city'    => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_visible'  => ['sometimes', 'boolean'],
        ]);

        $data['is_visible'] = $request->boolean('is_visible');

        $offer->update($data);

        return $request->input('redirectTo') === 'continue'
            ? back()
            : to_route('admin.offers.index');
    }

    /**
     * Usunięcie.
     */
    public function destroy(Offer $offer)
    {
        $offer->delete();
        return back();
    }

    /* -------------------- helpers -------------------- */

    private function allowedSort(?string $sort): string
    {
        $allowed = ['created_at', 'title', 'city', 'country', 'language'];
        return in_array($sort, $allowed, true) ? $sort : 'created_at';
    }

    private function allowedDir(?string $dir): string
    {
        return in_array($dir, ['asc', 'desc'], true) ? $dir : 'desc';
    }

    private function allowedPerPage(int $n): int
    {
        $allowed = [10, 20, 50, 100];
        return in_array($n, $allowed, true) ? $n : 20;
    }
}
