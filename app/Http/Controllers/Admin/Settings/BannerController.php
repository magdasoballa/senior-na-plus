<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\BannerStoreRequest;
use App\Http\Requests\Admin\Settings\BannerUpdateRequest;
use App\Models\Banner;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    /** Strefa czasu używana do odczytu z formularza i prezentacji w edycji */
    private string $tz = 'Europe/Warsaw';

    public function index(Request $request)
    {
        $q = trim((string) $request->get('q'));

        $banners = Banner::query()
            ->when($q, fn ($qq) => $qq->where('name', 'like', "%{$q}%"))
            ->orderBy('position')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/settings/banners/Index', [
            'banners' => $banners,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/settings/banners/Form', [
            'banner' => [
                'id'        => null,
                'name'      => '',
                'image_url' => null,
                'visible'   => true,
                'starts_at' => '',
                'ends_at'   => '',
                'link'      => '',
                'scope'     => 'both',
            ],
            'isCreate' => true,
        ]);
    }

    public function store(BannerStoreRequest $request)
    {
        $data = $request->validated();
        $data['visible']  = (bool) ($data['visible'] ?? false);
        $data['position'] = (int) (Banner::max('position') + 1);

        // Daty: z datetime-local (Warsaw) -> UTC do bazy
        foreach (['starts_at', 'ends_at'] as $k) {
            $data[$k] = !empty($data[$k])
                ? Carbon::parse($data[$k], $this->tz)->timezone('UTC')
                : null;
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner = Banner::create($data);

        // ⬇️ zostań na edycji, gdy stay=true
        return $request->boolean('stay')
            ? to_route('admin.settings.banners.edit', $banner)->with('success', 'Baner utworzony.')
            : to_route('admin.settings.banners.index')->with('success', 'Baner utworzony.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/settings/banners/Form', [
            'banner' => [
                'id'        => $banner->id,
                'name'      => $banner->name,
                'visible'   => $banner->visible,
                'image_url' => $banner->image_url, // accessor w modelu
                'link'      => $banner->link,
                'scope'     => $banner->scope,
                // Format dla <input type="datetime-local">
                'starts_at' => $banner->starts_at
                    ? $banner->starts_at->timezone($this->tz)->format('Y-m-d\TH:i')
                    : '',
                'ends_at'   => $banner->ends_at
                    ? $banner->ends_at->timezone($this->tz)->format('Y-m-d\TH:i')
                    : '',
            ],
            'isCreate' => false,
        ]);
    }

    public function update(BannerUpdateRequest $request, Banner $banner)
    {
        $data = $request->validated();
        $data['visible'] = (bool) ($data['visible'] ?? false);

        foreach (['starts_at', 'ends_at'] as $k) {
            $data[$k] = !empty($data[$k])
                ? Carbon::parse($data[$k], $this->tz)->timezone('UTC')
                : null;
        }

        if ($request->hasFile('image')) {
            if ($banner->image) {
                Storage::disk('public')->delete($banner->image);
            }
            $data['image'] = $request->file('image')->store('banners', 'public');
        } else {
            unset($data['image']); // nie nadpisuj na null, gdy nic nie przyszło
        }

        $banner->update($data);

        // ⬇️ zostań na edycji, gdy stay=true
        return $request->boolean('stay')
            ? to_route('admin.settings.banners.edit', $banner)->with('success', 'Baner zaktualizowany.')
            : to_route('admin.settings.banners.index')->with('success', 'Baner zaktualizowany.');
    }

    public function destroy(Banner $banner)
    {
        if ($banner->image) {
            Storage::disk('public')->delete($banner->image);
        }
        $banner->delete();

        return to_route('admin.settings.banners.index')->with('success', 'Baner usunięty.');
    }

    /** Toggle widoczności */
    public function toggle(Banner $banner)
    {
        $banner->update(['visible' => !$banner->visible]);
        return back();
    }

    /** Reorder: przyjmuje tablicę id w docelowej kolejności */
    public function reorder(Request $request)
    {
        $ids = (array) $request->input('ids', []);
        foreach ($ids as $i => $id) {
            Banner::whereKey($id)->update(['position' => $i + 1]);
        }
        return back();
    }

    public function show(Banner $banner)
    {
        $tz = $this->tz;

        return Inertia::render('Admin/settings/banners/Show', [
            'banner' => [
                'id'         => $banner->id,
                'name'       => $banner->name,
                'visible'    => $banner->visible,
                'position'   => $banner->position,
                'image_url'  => $banner->image_url,
                'link'       => $banner->link,
                'scope'      => $banner->scope,
                'starts_at'  => $banner->starts_at ? $banner->starts_at->timezone($tz)->format('Y-m-d H:i') : null,
                'ends_at'    => $banner->ends_at   ? $banner->ends_at->timezone($tz)->format('Y-m-d H:i') : null,
                'created_at' => $banner->created_at? $banner->created_at->timezone($tz)->format('Y-m-d H:i') : null,
                'updated_at' => $banner->updated_at? $banner->updated_at->timezone($tz)->format('Y-m-d H:i') : null,
            ],
        ]);
    }
}
