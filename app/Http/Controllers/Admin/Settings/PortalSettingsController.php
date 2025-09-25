<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\PortalSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalSettingsController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $settings = PortalSettings::query()
            ->when($q !== '', function ($builder) use ($q) {
                $like = "%{$q}%";
                $builder->where(function ($w) use ($like) {
                    $w->where('phone_pl', 'like', $like)
                        ->orWhere('phone_de', 'like', $like)
                        ->orWhere('address_pl', 'like', $like)
                        ->orWhere('address_de', 'like', $like)
                        ->orWhere('email_pl', 'like', $like)
                        ->orWhere('email_de', 'like', $like)
                        // fallback — jeśli masz jeszcze stare kolumny bazowe
                        ->orWhere('phone', 'like', $like)
                        ->orWhere('address', 'like', $like)
                        ->orWhere('email', 'like', $like);
                });
            })
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/settings/portal/Index', [
            'settings' => $settings,
            'filters'  => ['q' => $q],
        ]);
    }

    public function show(PortalSettings $setting)
    {
        return Inertia::render('Admin/settings/portal/Show', [
            'setting' => [
                'id'          => $setting->id,
                // lokalizowane
                'phone_pl'    => $setting->phone_pl,
                'phone_de'    => $setting->phone_de,
                'address_pl'  => $setting->address_pl,
                'address_de'  => $setting->address_de,
                'email_pl'    => $setting->email_pl,
                'email_de'    => $setting->email_de,
                // bazowe (opcjonalnie – jako fallback/debug w widoku)
                'phone'       => $setting->phone,
                'address'     => $setting->address,
                'email'       => $setting->email,
                'created_at'  => $setting->created_at,
                'updated_at'  => $setting->updated_at,
            ],
        ]);
    }

    public function edit(PortalSettings $setting)
    {
        return Inertia::render('Admin/settings/portal/Form', [
            'setting' => [
                'id'          => $setting->id,
                'phone_pl'    => $setting->phone_pl,
                'phone_de'    => $setting->phone_de,
                'address_pl'  => $setting->address_pl,
                'address_de'  => $setting->address_de,
                'email_pl'    => $setting->email_pl,
                'email_de'    => $setting->email_de,
            ],
        ]);
    }

    public function update(Request $request, PortalSettings $setting)
    {
        $data = $request->validate([
            'phone_pl'   => ['nullable', 'string'],
            'phone_de'   => ['nullable', 'string'],
            'address_pl' => ['nullable', 'string'],
            'address_de' => ['nullable', 'string'],
            'email_pl'   => ['nullable', 'email'],
            'email_de'   => ['nullable', 'email'],
        ]);

        // miękka normalizacja: twarde spacje -> zwykłe, zbij wielokrotne, trim
        $data = collect($data)
            ->map(function ($v, $k) {
                if ($v === null) return null;
                $v = str_replace("\xC2\xA0", ' ', $v);    // NBSP -> spacja
                $v = preg_replace('/\s+/u', ' ', $v);     // wielokrotne -> pojedyncza
                $v = trim($v);
                return $v === '' ? null : $v;             // puste jako NULL
            })
            ->toArray();

        $setting->update($data);

        return back()->with('success', 'Zapisano');
    }
}
