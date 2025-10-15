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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Gender;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $search  = trim((string) $request->query('search', ''));
        $perPage = (int) $request->query('per_page', 20);
        $perPage = in_array($perPage, [10, 20, 50, 100], true) ? $perPage : 20;

        $allowedSorts = ['created_at', 'title', 'city', 'country', 'language'];
        $sort = $request->query('sort', 'created_at');
        $sort = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';

        $dir = strtolower((string) $request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $offers = Offer::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('title', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%")
                        ->orWhere('language', 'like', "%{$search}%");
                });
            })
            ->withCount(['duties','requirements','perks','skills','recruitmentRequirements'])
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
                    'duties_count'                  => $o->duties_count,
                    'requirements_count'            => $o->requirements_count,
                    'perks_count'                   => $o->perks_count,
                    'skills_count'                  => $o->skills_count,
                    'recruitment_requirements_count'=> $o->recruitment_requirements_count,
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
                // skills: alias etykiety dla spójności na froncie
                'skills'       => Skill::select('id','name_pl','is_visible_pl','name_de','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                // mobilities: zgodnie z Twoją tabelą
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
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            // many-to-many
            'duties'         => 'array',
            'duties.*'       => 'integer|exists:duties,id',
            'requirements'   => 'array',
            'requirements.*' => 'integer|exists:offer_requirements,id',
            'perks'          => 'array',
            'perks.*'        => 'integer|exists:offer_perks,id',
            'skills'         => 'array',
            'skills.*'       => 'integer|exists:skills,id',
            'recruitment_requirements'   => 'array',
            'recruitment_requirements.*' => 'integer|exists:recruitment_requirements,id',

            // single + inputy
            'experience_id' => 'nullable|integer|exists:experiences,id',
            'experiences'   => 'nullable|string|max:255',
            'care_target'   => 'nullable|string|max:255',

            // meta oferty
            'country'     => 'nullable|string|max:100',
            'city'        => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'start_date'  => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'language'    => 'nullable|string|max:50',
            'wage'        => 'nullable|string|max:50',
            'bonus'       => 'nullable|string|max:50',

            'hero_image'  => 'nullable|file|image|max:4096',
            'care_recipient_gender' => 'nullable|in:female,male',
            // uwaga: to dalej enum string; słownik mobilities jest tylko do etykiet
            'mobility'              => 'nullable|in:mobile,limited,immobile',
            'lives_alone'           => 'nullable|boolean',
        ]);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
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
            'lives_alone'           => $validated['lives_alone'] ?? null,

            'experience_id' => $validated['experience_id'] ?? null,
            'experience' => Experience::select('id','name_pl as name','is_visible_pl','is_visible_de')
                ->where('is_visible_pl', true)
                ->orderBy('position')
                ->get(),            'care_target'   => $validated['care_target']   ?? null,
        ];

        if ($file = $request->file('hero_image')) {
            $payload['hero_image'] = $file->store('offers', 'public');
        }

        $offer = Offer::create($payload);

        // pivoty
        $offer->duties()->sync($validated['duties'] ?? []);
        $offer->requirements()->sync($validated['requirements'] ?? []);
        $offer->perks()->sync($validated['perks'] ?? []);
        $offer->skills()->sync($validated['skills'] ?? []);
        $offer->recruitmentRequirements()->sync($validated['recruitment_requirements'] ?? []);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Oferta została dodana.');
    }

    public function edit(Offer $offer)
    {
        $offer->load([
            'duties:id',
            'requirements:id',
            'perks:id',
            'skills:id',
            'recruitmentRequirements:id',
            'experience:id,name',
        ]);

        return Inertia::render('Admin/Offers/Edit', [
            'offer' => array_merge($offer->only([
                'id','title','city','country','language','wage','start_date','region','new_city',
                'description','is_visible','care_recipient_gender','mobility','lives_alone',
                'experience_id','experiences','care_target',
            ]), [
                'duties'                   => $offer->duties()->pluck('duties.id')->values(),
                'requirements'             => $offer->requirements()->pluck('offer_requirements.id')->values(),
                'perks'                    => $offer->perks()->pluck('offer_perks.id')->values(),
                'skills'                   => $offer->skills()->pluck('skills.id')->values(),
                'recruitment_requirements' => $offer->recruitmentRequirements()->pluck('recruitment_requirements.id')->values(),
            ]),
            'dict' => [
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
                    ->where('is_visible_pl', true)   // jeśli chcesz tylko PL widoczne
                    ->orderBy('position')
                    ->get(),
                'care_targets' => CareTarget::select('id','name_pl','name_de','is_visible_pl','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                'genders' => Gender::select('id','name_pl ','is_visible_pl','is_visible_de')
                    ->where('is_visible_pl', true)
                    ->orderBy('position')
                    ->get(),
                ],
        ]);
    }

    public function update(Request $request, Offer $offer)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            'duties'         => 'array',
            'duties.*'       => 'integer|exists:duties,id',
            'requirements'   => 'array',
            'requirements.*' => 'integer|exists:offer_requirements,id',
            'perks'          => 'array',
            'perks.*'        => 'integer|exists:offer_perks,id',
            'skills'         => 'array',
            'skills.*'       => 'integer|exists:skills,id',
            'recruitment_requirements'   => 'array',
            'recruitment_requirements.*' => 'integer|exists:recruitment_requirements,id',

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
            'care_recipient_gender' => 'nullable|in:female,male',
            'mobility'              => 'nullable|in:mobile,limited,immobile',
            'lives_alone'           => 'nullable|boolean',
        ]);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],
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
            'lives_alone'           => $validated['lives_alone'] ?? null,

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

        $offer->duties()->sync($validated['duties'] ?? []);
        $offer->requirements()->sync($validated['requirements'] ?? []);
        $offer->perks()->sync($validated['perks'] ?? []);
        $offer->skills()->sync($validated['skills'] ?? []);
        $offer->recruitmentRequirements()->sync($validated['recruitment_requirements'] ?? []);

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
        $offer->load([
            'duties:id,name',
            'requirements:id,name',
            'perks:id,name',
            'skills:id,name_pl',
            'recruitmentRequirements:id,name',
            'experience:id,name',
        ]);

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
            'experience'  => optional($offer->experience)->name,
            'experiences' => $offer->experiences,
            'care_target' => $offer->care_target,

            'duties'                   => $this->normalizeRelation($offer->duties),
            'requirements'             => $this->normalizeRelation($offer->requirements),
            'perks'                    => $this->normalizeRelation($offer->perks),
            'skills'                   => collect($offer->skills)->map(fn($s)=>['id'=>$s->id,'name'=>$s->name_pl,'checked'=>true])->all(),
            'recruitment_requirements' => $this->normalizeRelation($offer->recruitmentRequirements),
        ];

        return Inertia::render('Admin/Offers/Show', ['offer' => $payload]);
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
