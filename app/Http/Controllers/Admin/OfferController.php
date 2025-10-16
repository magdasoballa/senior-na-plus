<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Duty;
use App\Models\OfferRequirement;
use App\Models\OfferPerk;
use App\Models\Skill;
use App\Models\RecruitmentRequirement;
use App\Models\Experience;
use App\Models\CareTarget;
use App\Models\Mobility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Gender;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $search  = trim((string) $request->query('search', ''));
        $perPage = in_array((int)$request->query('per_page', 20), [10,20,50,100], true) ? (int)$request->query('per_page', 20) : 20;
        $allowedSorts = ['created_at','title','city','country','language'];
        $sort = in_array($request->query('sort', 'created_at'), $allowedSorts, true) ? $request->query('sort', 'created_at') : 'created_at';
        $dir  = strtolower((string)$request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $offers = Offer::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title','like',"%{$search}%")
                        ->orWhere('city','like',"%{$search}%")
                        ->orWhere('country','like',"%{$search}%")
                        ->orWhere('language','like',"%{$search}%");
                });
            })
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Offers/Index', [
            'offers' => $offers->through(function ($o) {
                return [
                    'id'       => $o->id,
                    'title'    => $o->title,
                    'city'     => $o->city,
                    'country'  => $o->country,
                    'language' => $o->language,
                    'wage'     => $o->wage,
                    'created_at' => $o->created_at,

                    // Liczby elementów w array
                    'duties_count'       => !empty($o->duties) ? count($o->duties) : 0,
                    'requirements_count' => !empty($o->requirements) ? count($o->requirements) : 0,
                    'perks_count'        => !empty($o->benefits) ? count($o->benefits) : 0,

                    'skills_count' => 0,
                    'recruitment_requirements_count' => 0,
                ];
            }),
            'filters' => [
                'search'   => $search,
                'sort'     => $sort,
                'dir'      => $dir,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Offers/Create', [
            'dict' => [
                'duties'       => Duty::orderBy('position')->get(['id','name']),
                'requirements' => OfferRequirement::orderBy('position')->get(['id','name']),
                'perks'        => OfferPerk::orderBy('position')->get(['id','name']),
                'skills'       => Skill::select('id','name_pl','is_visible_pl','name_de','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                'mobilities'   => Mobility::select('id','name_pl','name_de','is_visible_pl','is_visible_de')
                    ->orderBy('position')
                    ->get(),
                'recruitment_requirements' => RecruitmentRequirement::orderBy('position')->get(['id','title as name']),
                'experience' => Experience::select('id','name_pl','is_visible_pl','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                'care_targets' => CareTarget::select('id','name_pl','name_de','is_visible_pl','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                'genders' => Gender::select('id','name_pl','is_visible_pl','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('=== OFFER STORE (ARRAY VERSION) ===');
        \Log::info('Raw request data:', $request->all());

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            // Array z nazwami (stringami)
            'duties'         => 'array',
            'duties.*'       => 'string|max:255',
            'requirements'   => 'array',
            'requirements.*' => 'string|max:255',
            'perks'          => 'array',
            'perks.*'        => 'string|max:255',

            'experience_id' => 'nullable|integer|exists:experiences,id',
            'experiences'   => 'nullable|string|max:255',
            'care_target'   => 'nullable|string|max:255',

            'country'     => 'nullable|string|max:100',
            'city'        => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'start_date'  => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'language'    => 'nullable|string|max:50',
            'wage'        => 'nullable|string|max:50',
            'bonus'       => 'nullable|string|max:50',

            'hero_image'  => 'nullable|file|image|max:4096',
            'care_recipient_gender' => 'nullable|string|max:50',
            'mobility'              => 'nullable|string|max:50',
            'lives_alone'           => 'nullable|boolean',
        ]);

        \Log::info('Validated data:', $validated);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
            // Zapisujemy jako array
            'duties'       => $validated['duties'] ?? [],
            'requirements' => $validated['requirements'] ?? [],
            'benefits'     => $validated['perks'] ?? [], // Uwaga: benefits zamiast perks
            'country'     => $validated['country']     ?? null,
            'city'        => $validated['city']        ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'start_date'  => $validated['start_date']  ?? null,
            'duration'    => $validated['duration']    ?? null,
            'language'    => $validated['language']    ?? null,
            'wage'        => $validated['wage']        ?? null,
            'bonus'       => $validated['bonus']       ?? null,

            'care_recipient_gender' => $validated['care_recipient_gender'] ?? null,
            'mobility'              => $validated['mobility'] ?? null,
            'lives_alone'           => $validated['lives_alone'] ?? false,

            'experience_id' => $validated['experience_id'] ?? null,
            'experiences'   => $validated['experiences']   ?? null,
            'care_target'   => $validated['care_target']   ?? null,
        ];

        if ($file = $request->file('hero_image')) {
            $payload['hero_image'] = $file->store('offers', 'public');
        }

        \Log::info('Creating offer with payload:', $payload);
        $offer = Offer::create($payload);
        \Log::info('Offer created with ID:', ['id' => $offer->id]);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Oferta została dodana.');
    }

    public function edit(Offer $offer)
    {
        return Inertia::render('Admin/Offers/Edit', [
            'offer' => array_merge($offer->only([
                'id','title','city','country','language','wage','start_date','region','new_city',
                'description','is_visible','care_recipient_gender','mobility','lives_alone',
                'experience_id','experiences','care_target','postal_code','duration','bonus','hero_image',
                'duties','requirements','benefits' // Dodajemy array fields
            ]), [
                'perks' => $offer->benefits, // Map benefits to perks for frontend
                'skills' => [],
                'recruitment_requirements' => [],
            ]),
            'dict' => $this->getDictionaryData(),
        ]);
    }

    public function update(Request $request, Offer $offer)
    {
        \Log::info('=== OFFER UPDATE (ARRAY VERSION) ===');

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            'duties'         => 'array',
            'duties.*'       => 'string|max:255',
            'requirements'   => 'array',
            'requirements.*' => 'string|max:255',
            'perks'          => 'array',
            'perks.*'        => 'string|max:255',

            'experience_id' => 'nullable|integer|exists:experiences,id',
            'experiences'   => 'nullable|string|max:255',
            'care_target'   => 'nullable|string|max:255',

            'country'     => 'nullable|string|max:100',
            'city'        => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'start_date'  => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'language'    => 'nullable|string|max:50',
            'wage'        => 'nullable|string|max:50',
            'bonus'       => 'nullable|string|max:50',

            'hero_image'  => 'nullable|file|image|max:4096',
            'care_recipient_gender' => 'nullable|string|max:50',
            'mobility'              => 'nullable|string|max:50',
            'lives_alone'           => 'nullable|boolean',
        ]);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'duties'       => $validated['duties'] ?? [],
            'requirements' => $validated['requirements'] ?? [],
            'benefits'     => $validated['perks'] ?? [],
            'country'     => $validated['country']     ?? null,
            'city'        => $validated['city']        ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'start_date'  => $validated['start_date']  ?? null,
            'duration'    => $validated['duration']    ?? null,
            'language'    => $validated['language']    ?? null,
            'wage'        => $validated['wage']        ?? null,
            'bonus'       => $validated['bonus']       ?? null,

            'care_recipient_gender' => $validated['care_recipient_gender'] ?? null,
            'mobility'              => $validated['mobility'] ?? null,
            'lives_alone'           => $validated['lives_alone'] ?? false,

            'experience_id' => $validated['experience_id'] ?? null,
            'experiences'   => $validated['experiences']   ?? null,
            'care_target'   => $validated['care_target']   ?? null,
        ];

        if ($file = $request->file('hero_image')) {
            if ($offer->hero_image && Storage::disk('public')->exists($offer->hero_image)) {
                Storage::disk('public')->delete($offer->hero_image);
            }
            $payload['hero_image'] = $file->store('offers', 'public');
        }

        $offer->update($payload);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Oferta zaktualizowana.');
    }

    public function destroy(Offer $offer)
    {
        if ($offer->hero_image && Storage::disk('public')->exists($offer->hero_image)) {
            Storage::disk('public')->delete($offer->hero_image);
        }
        $offer->delete();

        return back()->with('success', 'Oferta usunięta.');
    }

    public function show(Offer $offer)
    {
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
            'is_visible'  => (bool)$offer->is_visible,
            'care_recipient_gender' => $offer->care_recipient_gender,
            'mobility'    => $offer->mobility,
            'lives_alone' => (bool) $offer->lives_alone,
            'experience'  => optional($offer->experience)->name_pl,
            'experiences' => $offer->experiences,
            'care_target' => $offer->care_target,

            'duties'       => $this->normalizeArray($offer->duties),
            'requirements' => $this->normalizeArray($offer->requirements),
            'perks'        => $this->normalizeArray($offer->benefits),
            'skills'       => [],
            'recruitment_requirements' => [],
        ];

        return Inertia::render('Admin/Offers/Show', ['offer' => $payload]);
    }

    private function getDictionaryData()
    {
        return [
            'duties'       => Duty::orderBy('position')->get(['id','name']),
            'requirements' => OfferRequirement::orderBy('position')->get(['id','name']),
            'perks'        => OfferPerk::orderBy('position')->get(['id','name']),
            'skills'       => Skill::select('id','name_pl','is_visible_pl','name_de','is_visible_de')
                ->where('is_visible_pl', true)
                ->orderBy('position')->get(),
            'mobilities'   => Mobility::select('id','name_pl','name_de','is_visible_pl','is_visible_de')
                ->orderBy('position')->get(),
            'recruitment_requirements' => RecruitmentRequirement::orderBy('position')->get(['id','title as name']),
            'experience' => Experience::select('id','name_pl','is_visible_pl','is_visible_de')
                ->where('is_visible_pl', true)
                ->orderBy('position')
                ->get(),
            'care_targets' => CareTarget::select('id','name_pl','name_de','is_visible_pl','is_visible_de')
                ->where('is_visible_pl', true)
                ->orderBy('position')
                ->get(),
            'genders' => Gender::select('id','name_pl','is_visible_pl','is_visible_de')
                ->where('is_visible_pl', true)
                ->orderBy('position')
                ->get(),
        ];
    }

    private function normalizeArray($items): array
    {
        if (empty($items)) {
            return [];
        }

        return collect($items)->map(function ($item, $key) {
            return [
                'id' => $key,
                'name' => $item,
                'checked' => true,
            ];
        })->values()->all();
    }

    private function normalizeRelation($items): array
    {
        return collect($items)->map(function ($i, $key) {
            if (is_string($i)) {
                return ['id' => is_int($key) ? $key : null, 'name' => $i, 'checked' => true];
            }
            if (is_int($i)) {
                return ['id' => $i, 'name' => (string)$i, 'checked' => true];
            }
            if (is_array($i)) {
                return [
                    'id'      => $i['id']   ?? null,
                    'name'    => $i['name'] ?? (string)($i['pivot']['name'] ?? ''),
                    'checked' => isset($i['checked'])
                        ? (bool)$i['checked']
                        : (bool)($i['pivot']['checked'] ?? true),
                ];
            }
            if ($i instanceof Model) {
                return [
                    'id'      => $i->getAttribute('id'),
                    'name'    => $i->getAttribute('name'),
                    'checked' => (bool)optional($i->getRelation('pivot'))->checked ?? true,
                ];
            }
            return ['id' => null, 'name' => (string)$i, 'checked' => true];
        })->values()->all();
    }
}
