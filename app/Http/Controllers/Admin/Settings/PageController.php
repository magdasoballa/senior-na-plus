<?php
// app/Http/Controllers/Admin/Settings/PageController.php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\UpdatePageRequest;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();

        $pages = Page::query()
            ->when($q, fn($qr) =>
            $qr->where('name','like',"%{$q}%")
                ->orWhere('slug','like',"%{$q}%")
            )
            ->orderBy('position')->orderBy('id')
            ->paginate(15)->withQueryString()
            ->through(fn(Page $p) => [
                'id'         => $p->id,
                'name'       => $p->name,
                'slug'       => $p->slug,
                'image_pl'   => $p->image_pl_url,
                'image_de'   => $p->image_de_url,
                'visible_pl' => (bool) $p->visible_pl,
                'visible_de' => (bool) $p->visible_de,
            ]);

        return Inertia::render('Admin/settings/pages/Index', [
            'pages' => [
                'data' => $pages->items(),
                'meta' => [
                    'current_page' => $pages->currentPage(),
                    'last_page'    => $pages->lastPage(),
                    'per_page'     => $pages->perPage(),
                    'total'        => $pages->total(),
                    'links'        => $pages->linkCollection()->toArray(),
                ],
            ],
            'filters' => ['q' => $q],
        ]);
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/settings/pages/Edit', [
            'page' => [
                'id'         => $page->id,
                'name'       => $page->name,
                'slug'       => $page->slug,

                // miniatury
                'image_pl'   => $page->image_pl_url,
                'image_de'   => $page->image_de_url,

                // widoczności
                'visible_pl' => (bool) $page->visible_pl,
                'visible_de' => (bool) $page->visible_de,

                // META (PL/DE)
                'meta_title_pl'       => $page->meta_title_pl,
                'meta_title_de'       => $page->meta_title_de,
                'meta_description_pl' => $page->meta_description_pl,
                'meta_description_de' => $page->meta_description_de,
                'meta_keywords_pl'    => $page->meta_keywords_pl,
                'meta_keywords_de'    => $page->meta_keywords_de,
                'meta_copyright_pl'   => $page->meta_copyright_pl,
                'meta_copyright_de'   => $page->meta_copyright_de,
            ],
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page)
    {
        $data = $request->validated();

        // Uploady (jeśli przyszły pliki)
        if ($request->hasFile('image_pl')) {
            if ($page->image_pl) \Storage::disk('public')->delete($page->image_pl);
            $data['image_pl'] = $request->file('image_pl')->store('pages', 'public');
        }
        if ($request->hasFile('image_de')) {
            if ($page->image_de) \Storage::disk('public')->delete($page->image_de);
            $data['image_de'] = $request->file('image_de')->store('pages', 'public');
        }

        // Budujemy updates tylko z kluczy, które przyszły
        $updates = [];

        foreach ([
                     'name','slug',
                     'image_pl','image_de',
                     'meta_title_pl','meta_title_de',
                     'meta_description_pl','meta_description_de',
                     'meta_keywords_pl','meta_keywords_de',
                     'meta_copyright_pl','meta_copyright_de',
                 ] as $key) {
            if (array_key_exists($key, $data)) {
                $updates[$key] = $data[$key];
            }
        }

        // Widoczności – ustawiamy TYLKO jeśli przysłał front (FormData z 1/0)
        if ($request->has('visible_pl')) {
            $updates['visible_pl'] = $request->boolean('visible_pl');
        }
        if ($request->has('visible_de')) {
            $updates['visible_de'] = $request->boolean('visible_de');
        }

        // Zapis bez pułapek mass-assignment
        $before = $page->replicate(); // do logowania
        $saved = $page->forceFill($updates)->save();

        // LOG: zobaczysz w storage/logs/laravel.log co poszło do DB
        Log::info('Page update', [
            'id'      => $page->id,
            'request' => $request->all(),
            'updates' => $updates,
            'saved'   => $saved,
            'changes' => $page->getChanges(), // co się faktycznie zmieniło
        ]);

        return $request->boolean('stay')
            ? back()->with('success', 'Zapisano zmiany.')
            : redirect()->route('admin.settings.pages.show', $page)->with('success', 'Zapisano zmiany.');
    }




    public function show(Page $page)
    {
        return Inertia::render('Admin/settings/pages/Show', [
            'page' => [
                'id'         => $page->id,
                'name'       => $page->name,
                'slug'       => $page->slug,
                'image_pl'   => $page->image_pl_url,
                'image_de'   => $page->image_de_url,
                'visible_pl' => (bool) $page->visible_pl,
                'visible_de' => (bool) $page->visible_de,

                'meta_title_pl'       => $page->meta_title_pl,
                'meta_title_de'       => $page->meta_title_de,
                'meta_description_pl' => $page->meta_description_pl,
                'meta_description_de' => $page->meta_description_de,
                'meta_keywords_pl'    => $page->meta_keywords_pl,
                'meta_keywords_de'    => $page->meta_keywords_de,
                'meta_copyright_pl'   => $page->meta_copyright_pl,
                'meta_copyright_de'   => $page->meta_copyright_de,
            ],
        ]);
    }
}
