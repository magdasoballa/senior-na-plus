<?php

namespace App\Http\Controllers\Admin\Offers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Offers\PerkRequest;
use App\Models\OfferPerk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PerkController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q',''));

        $rows = OfferPerk::query()
            ->when($q !== '', fn($b) => $b->where('name','like',"%{$q}%"))
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(OfferPerk $r) => [
            'id'         => $r->id,
            'name'       => $r->name,
            'is_visible' => (bool)$r->is_visible,
        ]);

        return Inertia::render('Admin/Offers/perks/Index', [
            'perks'   => $rows,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Offers/perks/Form', ['perk' => null]);
    }

    public function store(PerkRequest $request)
    {
        $data = $request->validated();
        $max  = (int) OfferPerk::max('position');

        OfferPerk::create([
            'name'       => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
            'position'   => $max + 1,
        ]);

        return redirect('/admin/offers/perks')->with('success','Utworzono');
    }

    public function show(OfferPerk $perk)
    {
        return Inertia::render('Admin/Offers/perks/Show', [
            'perk' => [
                'id'         => $perk->id,
                'name'       => $perk->name,
                'is_visible' => (bool)$perk->is_visible,
                'created_at' => $perk->created_at?->format('Y-m-d H:i'),
                'updated_at' => $perk->updated_at?->format('Y-m-d H:i'),
            ],
        ]);
    }

    public function edit(OfferPerk $perk)
    {
        return Inertia::render('Admin/Offers/perks/Form', [
            'perk' => [
                'id'         => $perk->id,
                'name'       => $perk->name,
                'is_visible' => (bool)$perk->is_visible,
            ],
        ]);
    }

    public function update(PerkRequest $request, OfferPerk $perk)
    {
        $data = $request->validated();

        $perk->fill([
            'name'       => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? redirect("/admin/offers/perks/{$perk->id}/edit")->with('success','Zapisano')
            : redirect('/admin/offers/perks')->with('success','Zapisano');
    }

    public function destroy(OfferPerk $perk)
    {
        $perk->delete();
        return back()->with('success','Usunięto');
    }

    // drag&drop sort
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                OfferPerk::whereKey($id)->update(['position' => $pos + 1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
