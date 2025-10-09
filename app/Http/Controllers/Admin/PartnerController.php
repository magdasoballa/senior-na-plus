<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PartnerRequest;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PartnerController extends Controller
{
public function index(Request $request)
{
$q        = (string) $request->string('q');
$visible  = $request->input('is_visible'); // '1'|'0'|null
$perPage  = (int) $request->input('per_page', 25);
if (!in_array($perPage, [10,25,50,100], true)) $perPage = 25;

$rows = Partner::query()
->search($q)
->when($visible !== null && $visible !== '', fn($qq) =>
$qq->where('is_visible', $visible === '1' || $visible === 1 || $visible === true)
)
->orderBy('position')->orderByDesc('id')
->paginate($perPage)->withQueryString();

// zamieniamy modele na tablice + image_url
$rows->getCollection()->transform(function(Partner $p) {
return [
'id'         => $p->id,
'link'       => $p->link,
'image_url'  => $p->image_url,
'is_visible' => $p->is_visible,
'created_at' => $p->created_at?->toIso8601String(),
];
});

return Inertia::render('Admin/partners/Index', [
'partners' => $rows,
'filters'  => [
'q'        => $q,
'is_visible' => $visible,
'per_page' => $perPage,
],
]);
}

public function show(Partner $partner)
{
return Inertia::render('Admin/partners/Show', [
'partner' => [
'id'         => $partner->id,
'link'       => $partner->link,
'image_url'  => $partner->image_url,
'image_path' => $partner->image_path,
'is_visible' => $partner->is_visible,
'created_at' => $partner->created_at?->toIso8601String(),
],
]);
}

public function create()
{
return Inertia::render('Admin/partners/Form', [
'partner' => null,
'mode'    => 'create',
]);
}

public function store(PartnerRequest $request)
{
$data = $request->validated();
$partner = new Partner();
$partner->fill([
'link'       => $data['link'],
'is_visible' => (bool) ($data['is_visible'] ?? true),
]);

// upload
if ($request->hasFile('image')) {
$partner->image_path = $request->file('image')->store('partners', 'public');
}

// pozycja na koniec
$partner->position = (int) (Partner::max('position') + 1);
$partner->save();

return to_route('admin.partners.index')->with('success', 'Utworzono partnera.');
}

public function edit(Partner $partner)
{
return Inertia::render('Admin/partners/Form', [
'partner' => [
'id'         => $partner->id,
'link'       => $partner->link,
'image_url'  => $partner->image_url,
'is_visible' => $partner->is_visible,
],
'mode'    => 'edit',
]);
}

public function update(PartnerRequest $request, Partner $partner)
{
$data = $request->validated();

$partner->link       = $data['link'];
$partner->is_visible = (bool) ($data['is_visible'] ?? false);

// nowy upload (opcjonalny)
if ($request->hasFile('image')) {
if ($partner->image_path) Storage::disk('public')->delete($partner->image_path);
$partner->image_path = $request->file('image')->store('partners', 'public');
}

$partner->save();

return $request->boolean('stay')
? back()->with('success', 'Zaktualizowano.')
: to_route('admin.partners.index')->with('success', 'Zaktualizowano.');
}

public function destroy(Partner $partner)
{
if ($partner->image_path) Storage::disk('public')->delete($partner->image_path);
$partner->delete();
return back()->with('success', 'Usunięto.');
}

public function toggleVisible(Partner $partner)
{
$partner->update(['is_visible' => ! $partner->is_visible]);
return back(303);
}
}
