<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\MobilityRequest;
use App\Models\Mobility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MobilityController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));

        $rows = Mobility::query()
            ->when($q !== '', function ($b) use ($q) {
                $like = "%{$q}%";
                $b->where('name_pl','like',$like)
                    ->orWhere('name_de','like',$like);
            })
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(Mobility $r) => [
            'id'            => $r->id,
            'name'          => $r->name_pl,
            'is_visible_pl' => $r->is_visible_pl,
            'is_visible_de' => $r->is_visible_de,
        ]);

        return Inertia::render('Admin/dictionaries/mobility/Index', [
            'mobilities' => $rows,
            'filters'    => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/mobility/Form', ['row' => null]);
    }

    public function store(MobilityRequest $request)
    {
        $data = $request->validated();
        $max  = (int) Mobility::max('position');

        $mobility = Mobility::create([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
            'position'      => $max + 1,
        ]);

        $stay = $request->input('redirectTo') === 'continue'
            || $request->boolean('stay')
            || $request->boolean('continue');

        // dla create: „Utwórz i Dodaj Kolejną” – wróć na pusty formularz
        return $stay
            ? to_route('admin.dict.mobility.create')->with('success','Utworzono')
            : to_route('admin.dict.mobility.index')->with('success','Utworzono');
    }



    public function show(Mobility $mobility)
    {
        return Inertia::render('Admin/dictionaries/mobility/Show', [
            'row' => [
                'id'            => $mobility->id,
                'name_pl'       => $mobility->name_pl,
                'name_de'       => $mobility->name_de,
                'is_visible_pl' => $mobility->is_visible_pl,
                'is_visible_de' => $mobility->is_visible_de,
                'created_at'    => $mobility->created_at,
                'updated_at'    => $mobility->updated_at,
            ],
        ]);
    }

    public function edit(Mobility $mobility)
    {
        return Inertia::render('Admin/dictionaries/mobility/Form', [
            'row' => [
                'id'            => $mobility->id,
                'name_pl'       => $mobility->name_pl,
                'name_de'       => $mobility->name_de,
                'is_visible_pl' => $mobility->is_visible_pl,
                'is_visible_de' => $mobility->is_visible_de,
            ],
        ]);
    }

    public function update(MobilityRequest $request, Mobility $mobility)
    {
        $data = $request->validated();

        $mobility->fill([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
        ])->save();

        $stay = $request->input('redirectTo') === 'continue'
            || $request->boolean('stay')
            || $request->boolean('continue');

        // dla edit: zostań na edycji TEGO rekordu
        return $stay
            ? to_route('admin.dict.mobility.edit', $mobility)->with('success','Zapisano')
            : to_route('admin.dict.mobility.index')->with('success','Zapisano');
    }

    public function destroy(Mobility $mobility)
    {
        $mobility->delete();
        return to_route('admin.dict.mobility.index')->with('success','Usunięto');
    }

    // Drag&drop (opcjonalnie)
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                Mobility::where('id',$id)->update(['position'=>$pos+1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
