<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\StoreSocialLinkRequest;
use App\Http\Requests\Admin\Settings\UpdateSocialLinkRequest;
use App\Models\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SocialLinkController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        $links = SocialLink::query()
            ->when($q !== '', fn($qr) =>
            $qr->where('name','like',"%{$q}%")->orWhere('url','like',"%{$q}%")
            )
            ->ordered()
            ->paginate(15)->withQueryString()
            ->through(fn(SocialLink $l) => [
                'id' => $l->id,
                'name' => $l->name,
                'icon' => $l->icon,
                'icon_file_url' => $l->icon_file ? Storage::url($l->icon_file) : null,

                'url' => $l->url,
                'visible_pl' => $l->visible_pl,
                'visible_de' => $l->visible_de,
            ]);

        return Inertia::render('Admin/settings/social-links/Index', [
            'records' => $links,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/settings/social-links/Edit', [
            'record' => [
                'id' => null, 'name' => '', 'url' => '', 'icon' => '',
                'icon_file_url' => null,

                'visible_pl' => true, 'visible_de' => true,
            ],
            'mode' => 'create',
        ]);
    }

    public function store(StoreSocialLinkRequest $request) {
        $data = $request->validated();

        if ($request->hasFile('icon_file')) {
            $path = $request->file('icon_file')->store('social-icons', 'public');
            $data['icon_file'] = $path;
            $data['icon'] = null;
        }

        $maxPos = (int) SocialLink::max('position');
        $link = SocialLink::create(array_merge($data, ['position' => $maxPos + 1]));

        // ⬇️ KLUCZOWE: zostań na edycji, gdy stay=true
        return $request->boolean('stay')
            ? to_route('admin.settings.social-links.edit', $link)->with('success','Utworzono link.')
            : to_route('admin.settings.social-links.index')->with('success','Utworzono link.');
    }



    public function show(SocialLink $social_link)
    {
        return Inertia::render('Admin/settings/social-links/Show', [
            'record' => [
                'id' => $social_link->id,
                'name' => $social_link->name,
                'url' => $social_link->url,
                'icon' => $social_link->icon,
                'visible_pl' => $social_link->visible_pl,
                'visible_de' => $social_link->visible_de,
            ],
        ]);
    }

    public function edit(SocialLink $social_link) {
        return Inertia::render('Admin/settings/social-links/Edit', [
            'record' => [
                'id' => $social_link->id,
                'name' => $social_link->name,
                'url' => $social_link->url,
                'icon' => $social_link->icon,
                'icon_file_url' => $social_link->icon_file ? Storage::url($social_link->icon_file) : null,
                'visible_pl' => $social_link->visible_pl,
                'visible_de' => $social_link->visible_de,
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(UpdateSocialLinkRequest $request, SocialLink $social_link) {
        $data = $request->validated();

        if ($request->boolean('remove_icon_file') && $social_link->icon_file) {
            Storage::disk('public')->delete($social_link->icon_file);
            $data['icon_file'] = null;
        }

        if ($request->hasFile('icon_file')) {
            if ($social_link->icon_file) {
                Storage::disk('public')->delete($social_link->icon_file);
            }
            $data['icon_file'] = $request->file('icon_file')->store('social-icons', 'public');
            $data['icon'] = null;
        }

        $social_link->update($data);

        // ⬇️ KLUCZOWE: zostań na edycji, gdy stay=true
        return $request->boolean('stay')
            ? to_route('admin.settings.social-links.edit', $social_link)->with('success', 'Zapisano zmiany.')
            : to_route('admin.settings.social-links.index')->with('success', 'Zapisano zmiany.');
    }



    public function destroy(SocialLink $social_link)
    {
        $social_link->delete();
        return back()->with('success','Usunięto link.');
    }
}
