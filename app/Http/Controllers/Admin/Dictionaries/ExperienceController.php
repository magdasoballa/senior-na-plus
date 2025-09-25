<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\ExperienceRequest;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));

        $rows = Experience::query()
            ->when($q !== '', function ($b) use ($q) {
                $like = "%{$q}%";
                $b->where('name_pl','like',$like)
                    ->orWhere('name_de','like',$like);
            })
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(Experience $r) => [
            'id'            => $r->id,
            'name'          => $r->name_pl,
            'is_visible_pl' => $r->is_visible_pl,
            'is_visible_de' => $r->is_visible_de,
        ]);

        return Inertia::render('Admin/dictionaries/experience/Index', [
            'experiences' => $rows,
            'filters'     => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/experience/Form', ['row' => null]);
    }

    public function store(ExperienceRequest $request)
    {
        $data = $request->validated();
        $max = (int) Experience::max('position');

        Experience::create([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
            'position'      => $max + 1,
        ]);

        return to_route('admin.dict.experience.index')->with('success','Utworzono');
    }

    public function show(Experience $experience)
    {
        return Inertia::render('Admin/dictionaries/experience/Show', [
            'row' => [
                'id'            => $experience->id,
                'name_pl'       => $experience->name_pl,
                'name_de'       => $experience->name_de,
                'is_visible_pl' => $experience->is_visible_pl,
                'is_visible_de' => $experience->is_visible_de,
                'created_at'    => $experience->created_at,
                'updated_at'    => $experience->updated_at,
            ],
        ]);
    }

    public function edit(Experience $experience)
    {
        return Inertia::render('Admin/dictionaries/experience/Form', [
            'row' => [
                'id'            => $experience->id,
                'name_pl'       => $experience->name_pl,
                'name_de'       => $experience->name_de,
                'is_visible_pl' => $experience->is_visible_pl,
                'is_visible_de' => $experience->is_visible_de,
            ],
        ]);
    }

    public function update(ExperienceRequest $request, Experience $experience)
    {
        $data = $request->validated();

        $experience->fill([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.experience.edit', $experience)->with('success','Zapisano')
            : to_route('admin.dict.experience.index')->with('success','Zapisano');
    }

    public function destroy(Experience $experience)
    {
        $experience->delete();
        return to_route('admin.dict.experience.index')->with('success','Usunięto');
    }

    // drag&drop
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok'=>true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                Experience::where('id',$id)->update(['position'=>$pos+1]);
            }
        });

        return response()->json(['ok'=>true]);
    }
}
