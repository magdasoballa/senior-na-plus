<?php

namespace App\Http\Controllers\Admin\Offers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Offers\RequirementRequest;
use App\Models\OfferRequirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RequirementController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q',''));

        $rows = OfferRequirement::query()
            ->when($q !== '', fn($b) => $b->where('name','like',"%{$q}%"))
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(OfferRequirement $r) => [
            'id'         => $r->id,
            'name'       => $r->name,
            'is_visible' => (bool) $r->is_visible,
        ]);

        return Inertia::render('Admin/offers/requirements/Index', [
            'requirements' => $rows,
            'filters'      => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/offers/requirements/Form', ['req' => null]);
    }

    public function store(RequirementRequest $request)
    {
        $data = $request->validated();
        $max  = (int) OfferRequirement::max('position');

        OfferRequirement::create([
            'name'       => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
            'position'   => $max + 1,
        ]);

        return to_route('admin.offers.requirements.index')->with('success','Utworzono');
    }

    public function show(OfferRequirement $requirement)
    {
        return Inertia::render('Admin/offers/requirements/Show', [
            'req' => [
                'id'         => $requirement->id,
                'name'       => $requirement->name,
                'is_visible' => (bool) $requirement->is_visible,
                'created_at' => $requirement->created_at?->format('Y-m-d H:i'),
                'updated_at' => $requirement->updated_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(OfferRequirement $requirement)
    {
        return Inertia::render('Admin/offers/requirements/Form', [
            'req' => [
                'id'         => $requirement->id,
                'name'       => $requirement->name,
                'is_visible' => (bool) $requirement->is_visible,
            ],
        ]);
    }

    public function update(RequirementRequest $request, OfferRequirement $requirement)
    {
        $data = $request->validated();

        $requirement->fill([
            'name'       => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.offers.requirements.edit', $requirement)->with('success','Zapisano')
            : to_route('admin.offers.requirements.index')->with('success','Zapisano');
    }

    public function destroy(OfferRequirement $requirement)
    {
        $requirement->delete();
        return back()->with('success','Usunięto');
    }

    // opcjonalnie: drag&drop
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                OfferRequirement::whereKey($id)->update(['position' => $pos + 1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
