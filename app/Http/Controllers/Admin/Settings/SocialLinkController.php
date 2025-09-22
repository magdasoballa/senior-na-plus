<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\StoreSocialLinkRequest;
use App\Http\Requests\Admin\Settings\UpdateSocialLinkRequest;
use App\Models\SocialLink;
use Illuminate\Http\Request;
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
                'visible_pl' => true, 'visible_de' => true,
            ],
            'mode' => 'create',
        ]);
    }

    public function store(StoreSocialLinkRequest $request)
    {
        $maxPos = (int) SocialLink::max('position');
        SocialLink::create(array_merge($request->validated(), ['position' => $maxPos + 1]));
        return redirect()->route('admin.settings.social-links.index')->with('success','Utworzono link.');
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

    public function edit(SocialLink $social_link)
    {
        return Inertia::render('Admin/settings/social-links/Edit', [
            'record' => [
                'id' => $social_link->id,
                'name' => $social_link->name,
                'url' => $social_link->url,
                'icon' => $social_link->icon,
                'visible_pl' => $social_link->visible_pl,
                'visible_de' => $social_link->visible_de,
            ],
            'mode' => 'edit',
        ]);
    }

    public function update(UpdateSocialLinkRequest $request, SocialLink $social_link)
    {
        $social_link->update($request->validated());
        return back()->with('success','Zapisano zmiany.');
    }

    public function destroy(SocialLink $social_link)
    {
        $social_link->delete();
        return back()->with('success','Usunięto link.');
    }
}
