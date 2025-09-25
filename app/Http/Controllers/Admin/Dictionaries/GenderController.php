<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\GenderRequest;
use App\Models\Gender;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class GenderController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));

        $rows = Gender::query()
            ->when($q !== '', function ($b) use ($q) {
                $like = "%{$q}%";
                $b->where('name_pl','like',$like)
                    ->orWhere('name_de','like',$like);
            })
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(Gender $r) => [
            'id'            => $r->id,
            'name'          => $r->name_pl,
            'is_visible_pl' => $r->is_visible_pl,
            'is_visible_de' => $r->is_visible_de,
        ]);

        return Inertia::render('Admin/dictionaries/genders/Index', [
            'genders' => $rows,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/genders/Form', ['row' => null]);
    }

    public function store(GenderRequest $request)
    {
        $data = $request->validated();
        $max = (int) Gender::max('position');

        Gender::create([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
            'position'      => $max + 1,
        ]);

        return to_route('admin.dict.genders.index')->with('success','Utworzono');
    }

    public function show(Gender $gender)
    {
        return Inertia::render('Admin/dictionaries/genders/Show', [
            'row' => [
                'id'            => $gender->id,
                'name_pl'       => $gender->name_pl,
                'name_de'       => $gender->name_de,
                'is_visible_pl' => $gender->is_visible_pl,
                'is_visible_de' => $gender->is_visible_de,
                'created_at'    => $gender->created_at,
                'updated_at'    => $gender->updated_at,
            ],
        ]);
    }

    public function edit(Gender $gender)
    {
        return Inertia::render('Admin/dictionaries/genders/Form', [
            'row' => [
                'id'            => $gender->id,
                'name_pl'       => $gender->name_pl,
                'name_de'       => $gender->name_de,
                'is_visible_pl' => $gender->is_visible_pl,
                'is_visible_de' => $gender->is_visible_de,
            ],
        ]);
    }

    public function update(GenderRequest $request, Gender $gender)
    {
        $data = $request->validated();

        $gender->fill([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.genders.edit', $gender)->with('success','Zapisano')
            : to_route('admin.dict.genders.index')->with('success','Zapisano');
    }

    public function destroy(Gender $gender)
    {
        $gender->delete();
        return to_route('admin.dict.genders.index')->with('success','Usunięto');
    }

    // drag&drop (opcjonalnie)
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                Gender::where('id',$id)->update(['position'=>$pos+1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
