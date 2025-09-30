<?php

namespace App\Http\Controllers\Admin\Offers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Dictionaries\DutyRequest;
use App\Models\Duty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OfferDutyController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string)$request->get('q', ''));

        $rows = Duty::query()
            ->when($q !== '', fn($b) => $b->where('name', 'like', "%{$q}%"))
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString();

        $rows->getCollection()->transform(fn(Duty $d) => [
            'id' => $d->id,
            'name' => $d->name,
            'is_visible' => $d->is_visible,
        ]);

        return Inertia::render('Admin/Offers/duties/Index', [
            'duties' => $rows,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Offers/duties/Form', ['duty' => null]);
    }

    public function store(DutyRequest $request)
    {
        $data = $request->validated();
        $max = (int)Duty::max('position');

        Duty::create([
            'name' => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
            'position' => $max + 1,
        ]);

        return to_route('admin.dict.duties.index')->with('success', 'Utworzono');
    }

    public function show(Duty $duty)
    {
        return Inertia::render('Admin/Offers/duties/Show', [
            'duty' => [
                'id' => $duty->id,
                'name' => $duty->name,
                'is_visible' => $duty->is_visible,
                'created_at' => $duty->created_at,
                'updated_at' => $duty->updated_at,
            ],
        ]);
    }

    public function edit(Duty $duty)
    {
        return Inertia::render('Admin/Offers/duties/Form', [
            'duty' => [
                'id' => $duty->id,
                'name' => $duty->name,
                'is_visible' => $duty->is_visible,
            ],
        ]);
    }

    public function update(DutyRequest $request, Duty $duty)
    {
        $data = $request->validated();

        $duty->fill([
            'name' => $data['name'],
            'is_visible' => (bool)($data['is_visible'] ?? false),
        ])->save();

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.dict.duties.edit', $duty)->with('success', 'Zapisano')
            : to_route('admin.dict.duties.index')->with('success', 'Zapisano');
    }

    public function destroy(Duty $duty)
    {
        $duty->delete();
        return to_route('admin.dict.duties.index')->with('success', 'Usunięto');
    }

// drag&drop sortowanie (opcjonalne)
    public function reorder(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) return response()->json(['ok' => true]);

        DB::transaction(function () use ($ids) {
            foreach ($ids as $pos => $id) {
                Duty::where('id', $id)->update(['position' => $pos + 1]);
            }
        });

        return response()->json(['ok' => true]);
    }
}
