<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PartnerController extends Controller
{
public function store(Request $request)
{
$data = $request->validate([
'name'        => ['required','string','max:255'],
'website'     => ['nullable','url','max:255'],
'category'    => ['required','string','max:255'],
'description' => ['nullable','string','max:2000'],
'logo'        => ['nullable','image','mimes:png,jpg,jpeg,webp','max:2048'],
]);

$logoPath = null;
if ($request->hasFile('logo')) {
$logoPath = $request->file('logo')->store('partners', 'public');
}

$partner = Partner::create([
'name'        => $data['name'],
'website'     => $data['website'] ?? null,
'category'    => $data['category'],
'description' => $data['description'] ?? null,
'logo_path'   => $logoPath,
]);

// Zwróćmy partnera w propsach Inertia, aby front mógł go dołożyć bez przeładowania
return back()->with([
'__createdPartner' => [
'id'          => $partner->id,
'name'        => $partner->name,
'website'     => $partner->website,
'category'    => $partner->category,
'description' => $partner->description,
'logo'        => $partner->logo_url, // front oczekuje "logo" = URL
],
'flash' => ['success' => 'Partner został dodany.'],
]);
}
}
