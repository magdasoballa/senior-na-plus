<?php
namespace App\Http\Controllers\Admin\Settings;


use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Settings\PopupRequest;
use App\Models\Popup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class PopupController extends Controller {

    public function index(Request $request)
    {
        $q = trim((string)$request->get('q',''));
        $popups = Popup::query()
            ->when($q !== '', function($b) use ($q){
                $like = "%{$q}%";
                $b->where('name','like',$like)
                    ->orWhere('link','like',$like);
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();


// mapujemy tylko potrzebne pola
        $popups->getCollection()->transform(fn(Popup $p) => [
            'id' => $p->id,
            'name' => $p->name,
            'link' => $p->link,
            'image_url' => $p->image_url,
            'is_visible' => $p->is_visible,
        ]);


        return Inertia::render('Admin/settings/popup/Index', [
            'popups' => $popups,
            'filters' => ['q' => $q],
        ]);
    }
    public function create()
    {
        return Inertia::render('Admin/settings/popup/Form', [
            'popup' => null,
        ]);
    }

    public function store(PopupRequest $request)
    {
        $data = $request->validated();
        $popup = new Popup();
        $popup->name = $data['name'];
        $popup->link = $data['link'] ?? null;
        $popup->is_visible = (bool)($data['is_visible'] ?? false);


        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('popups', 'public');
            $popup->image_path = $path;
        }
        $popup->save();


        return to_route('admin.settings.popups.index')->with('success','Utworzono');
    }

    public function show(Popup $popup)
    {
        return Inertia::render('Admin/settings/popup/Show', [
            'popup' => [
                'id' => $popup->id,
                'name' => $popup->name,
                'link' => $popup->link,
                'image_url' => $popup->image_url,
                'is_visible' => $popup->is_visible,
                'created_at' => $popup->created_at,
                'updated_at' => $popup->updated_at,
            ],
        ]);
    }

    public function edit(Popup $popup)
    {
        return Inertia::render('Admin/settings/popup/Form', [
            'popup' => [
                'id' => $popup->id,
                'name' => $popup->name,
                'link' => $popup->link,
                'image_url' => $popup->image_url,
                'is_visible' => $popup->is_visible,
            ],
        ]);
    }

    public function update(PopupRequest $request, Popup $popup)
    {
        $data = $request->validated();

        $popup->name = $data['name'];
        $popup->link = $data['link'] ?? null;
        $popup->is_visible = (bool)($data['is_visible'] ?? false);

        if (!empty($data['remove_image'])) {
            $popup->deleteImage();
        }
        if ($request->hasFile('image')) {
            $popup->deleteImage();
            $path = $request->file('image')->store('popups', 'public');
            $popup->image_path = $path;
        }

        $popup->save();

        // ➜ po edycji domyślnie idź na listę,
        // a jeśli kliknięto „Kontynuuj edycję” — wróć na edycję
        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.settings.popups.edit', $popup)->with('success', 'Zapisano')
            : to_route('admin.settings.popups.index')->with('success', 'Zapisano');
    }


    public function destroy(Popup $popup)
    {
        $popup->deleteImage();
        $popup->delete();
        return to_route('admin.settings.popups.index')->with('success','Usunięto');
    }

}
