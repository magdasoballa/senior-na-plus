<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
public function index(Request $request)
{
$q = $request->string('q')->toString();

$pages = Page::query()
->when($q, fn($qr) =>
$qr->where('name', 'like', "%{$q}%")
->orWhere('id', $q)
)
->orderBy('id')
->paginate(15)
->withQueryString()
->through(fn(Page $p) => [
'id'         => $p->id,
'name'       => $p->name,
'image_pl'   => $p->image_pl_url,
'image_de'   => $p->image_de_url,
'visible_pl' => (bool) $p->visible_pl,
'visible_de' => (bool) $p->visible_de,
]);

return Inertia::render('Admin/settings/pages/Index', [
'pages'   => ['data' => $pages->items(), 'meta' => [
'current_page' => $pages->currentPage(),
'last_page'    => $pages->lastPage(),
'per_page'     => $pages->perPage(),
'total'        => $pages->total(),
'links'        => $pages->linkCollection()->toArray(),
]],
'filters' => ['q' => $q],
]);
}

public function create()  { return Inertia::render('admin/settings/pages/Create'); }
public function edit(Page $page) { return Inertia::render('admin/settings/pages/Edit', ['page' => $page]); }
public function store(Request $r) { /* validate + create */ }
public function update(Request $r, Page $page) { /* validate + update */ }
public function destroy(Page $page) { $page->delete(); return back(); }
}
