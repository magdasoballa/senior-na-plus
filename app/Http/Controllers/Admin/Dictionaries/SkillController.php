<?php

namespace App\Http\Controllers\Admin\Dictionaries;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\SkillRequest;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));

        $skills = Skill::query()
            ->when($q !== '', function ($b) use ($q) {
                $like = "%{$q}%";
                $b->where('name_pl','like',$like)
                    ->orWhere('name_de','like',$like);
            })
            ->orderBy('position')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString();

        // zwracamy tylko to co potrzebne
        $skills->getCollection()->transform(fn(Skill $s) => [
            'id'            => $s->id,
            'name'          => $s->name_pl, // index pokazuje polską nazwę
            'is_visible_pl' => $s->is_visible_pl,
            'is_visible_de' => $s->is_visible_de,
        ]);

        return Inertia::render('Admin/dictionaries/skills/Index', [
            'skills'  => $skills,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/dictionaries/skills/Form', ['skill' => null]);
    }

    public function store(SkillRequest $request)
    {
        $data = $request->validated();

        // pozycja na koniec
        $max = (int) Skill::max('position');
        $data['position'] = $max + 1;

        Skill::create([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
            'position'      => $data['position'],
        ]);

        return to_route('admin.dict.skills.index')->with('success','Utworzono umiejętność');
    }

    public function show(Skill $skill)
    {
        return Inertia::render('Admin/dictionaries/skills/Show', [
            'skill' => [
                'id'            => $skill->id,
                'name_pl'       => $skill->name_pl,
                'name_de'       => $skill->name_de,
                'is_visible_pl' => $skill->is_visible_pl,
                'is_visible_de' => $skill->is_visible_de,
                'created_at'    => $skill->created_at,
                'updated_at'    => $skill->updated_at,
            ],
        ]);
    }

    public function edit(Skill $skill)
    {
        return Inertia::render('Admin/dictionaries/skills/Form', [
            'skill' => [
                'id'            => $skill->id,
                'name_pl'       => $skill->name_pl,
                'name_de'       => $skill->name_de,
                'is_visible_pl' => $skill->is_visible_pl,
                'is_visible_de' => $skill->is_visible_de,
            ],
        ]);
    }

    public function update(SkillRequest $request, Skill $skill)
    {
        $data = $request->validated();

        $skill->fill([
            'name_pl'       => $data['name_pl'],
            'name_de'       => $data['name_de'] ?? null,
            'is_visible_pl' => (bool)($data['is_visible_pl'] ?? false),
            'is_visible_de' => (bool)($data['is_visible_de'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.skills.edit', $skill)->with('success','Zapisano')
            : to_route('admin.dict.skills.index')->with('success','Zapisano');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();
        return to_route('admin.dict.skills.index')->with('success','Usunięto');
    }

    // Drag&drop reorder (opcjonalne)
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []); // [3,1,2,...]
        if (!is_array($ids) || empty($ids)) {
            return response()->json(['ok' => true]);
        }

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                Skill::where('id', $id)->update(['position' => $pos + 1]);
            }
        });

        return response()->json(['ok' => true]);
    }
}
