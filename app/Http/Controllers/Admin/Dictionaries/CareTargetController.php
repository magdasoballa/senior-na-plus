<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\CareTargetRequest;
use App\Models\CareTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CareTargetController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));

        $rows = CareTarget::query()
            ->when($q !== '', function ($b) use ($q) {
                $like = "%{$q}%";
                $b->where('name_pl','like',$like)
                    ->orWhere('name_de','like',$like);
            })
            ->orderBy('position')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString();

        $rows->getCollection()->transform(fn(CareTarget $r) => [
            'id'            => $r->id,
            'name'          => $r->name_pl,
            'is_visible_pl' => $r->is_visible_pl,
            'is_visible_de' => $r->is_visible_de,
        ]);

        return Inertia::render('Admin/dictionaries/care-targets/Index', [
            'careTargets' => $rows,
            'filters'     => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/care-targets/Form', ['row' => null]);
    }

    public function store(CareTargetRequest $request)
    {
        $data = $request->validated();

        $max = (int) CareTarget::max('position');

        CareTarget::create([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
            'position'      => $max + 1,
        ]);

        return to_route('admin.dict.care-targets.index')->with('success','Utworzono');
    }

    public function show(CareTarget $care_target)
    {
        return Inertia::render('Admin/dictionaries/care-targets/Show', [
            'row' => [
                'id'            => $care_target->id,
                'name_pl'       => $care_target->name_pl,
                'name_de'       => $care_target->name_de,
                'is_visible_pl' => $care_target->is_visible_pl,
                'is_visible_de' => $care_target->is_visible_de,
                'created_at'    => $care_target->created_at,
                'updated_at'    => $care_target->updated_at,
            ],
        ]);
    }

    public function edit(CareTarget $care_target)
    {
        return Inertia::render('Admin/dictionaries/care-targets/Form', [
            'row' => [
                'id'            => $care_target->id,
                'name_pl'       => $care_target->name_pl,
                'name_de'       => $care_target->name_de,
                'is_visible_pl' => $care_target->is_visible_pl,
                'is_visible_de' => $care_target->is_visible_de,
            ],
        ]);
    }

    public function update(CareTargetRequest $request, CareTarget $care_target)
    {
        $data = $request->validated();

        $care_target->fill([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.care-targets.edit', $care_target)->with('success','Zapisano')
            : to_route('admin.dict.care-targets.index')->with('success','Zapisano');
    }

    public function destroy(CareTarget $care_target)
    {
        $care_target->delete();
        return to_route('admin.dict.care-targets.index')->with('success','Usunięto');
    }

    // opcjonalnie: drag&drop
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                CareTarget::where('id',$id)->update(['position'=>$pos+1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
