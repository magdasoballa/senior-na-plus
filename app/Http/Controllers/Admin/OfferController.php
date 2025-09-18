<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OfferController extends Controller
{
    public function index()
    {
        // najprościej: bez paginacji; możesz dodać ->paginate(20)
        $offers = Offer::latest()->get();

        return Inertia::render('Admin/Offers/Index', [
            'offers' => $offers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Offers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            // przyjmujemy jako textarea (każda linia = 1 element)
            'duties_text'       => 'nullable|string',
            'requirements_text' => 'nullable|string',
            'benefits_text'     => 'nullable|string',

            'country'     => 'nullable|string|max:100',
            'city'        => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'start_date'  => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'language'    => 'nullable|string|max:50',
            'wage'        => 'nullable|string|max:50',
            'bonus'       => 'nullable|string|max:50',

            'hero_image'  => 'nullable|file|image|max:4096', // jpg/png/webp itp.
            'care_recipient_gender' => 'nullable|in:female,male',
            'mobility'              => 'nullable|in:mobile,limited,immobile',
            'lives_alone'           => 'nullable|boolean', // albo 'nullable|in:yes,no'

        ]);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],

            'duties'       => self::linesToArray($request->input('duties_text', '')),
            'requirements' => self::linesToArray($request->input('requirements_text', '')),
            'benefits'     => self::linesToArray($request->input('benefits_text', '')),

            'country'     => $validated['country']     ?? null,
            'city'        => $validated['city']        ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'start_date'  => $validated['start_date']  ?? null,
            'duration'    => $validated['duration']    ?? null,
            'language'    => $validated['language']    ?? null,
            'wage'        => $validated['wage']        ?? null,
            'bonus'       => $validated['bonus']       ?? null,
            'care_recipient_gender' => $validated['care_recipient_gender'] ?? null,
            'mobility'              => $validated['mobility'] ?? null,
            'lives_alone'           => $validated['lives_alone'] ?? null,

        ];

        if ($file = $request->file('hero_image')) {
            $payload['hero_image'] = $file->store('offers', 'public'); // storage/app/public/offers/...
        }

        Offer::create($payload);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Oferta została dodana.');
    }

    public function edit(Offer $offer)
    {
        // zamieniamy tablice -> tekst (po jednej linii), żeby ładnie wstawić do textarea
        return Inertia::render('Admin/Offers/Edit', [
            'offer' => [
                ...$offer->toArray(),
                'duties_text'       => implode("\n", $offer->duties ?? []),
                'requirements_text' => implode("\n", $offer->requirements ?? []),
                'benefits_text'     => implode("\n", $offer->benefits ?? []),
            ],
        ]);
    }

    public function update(Request $request, Offer $offer)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',

            'duties_text'       => 'nullable|string',
            'requirements_text' => 'nullable|string',
            'benefits_text'     => 'nullable|string',

            'country'     => 'nullable|string|max:100',
            'city'        => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'start_date'  => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'language'    => 'nullable|string|max:50',
            'wage'        => 'nullable|string|max:50',
            'bonus'       => 'nullable|string|max:50',

            'hero_image'  => 'nullable|file|image|max:4096',
            'care_recipient_gender' => 'nullable|in:female,male',
            'mobility'              => 'nullable|in:mobile,limited,immobile',
            'lives_alone'           => 'nullable|boolean', // albo 'nullable|in:yes,no'

        ]);

        $payload = [
            'title'       => $validated['title'],
            'description' => $validated['description'],

            'duties'       => self::linesToArray($request->input('duties_text', '')),
            'requirements' => self::linesToArray($request->input('requirements_text', '')),
            'benefits'     => self::linesToArray($request->input('benefits_text', '')),

            'country'     => $validated['country']     ?? null,
            'city'        => $validated['city']        ?? null,
            'postal_code' => $validated['postal_code'] ?? null,
            'start_date'  => $validated['start_date']  ?? null,
            'duration'    => $validated['duration']    ?? null,
            'language'    => $validated['language']    ?? null,
            'wage'        => $validated['wage']        ?? null,
            'bonus'       => $validated['bonus']       ?? null,
            'care_recipient_gender' => $validated['care_recipient_gender'] ?? null,
            'mobility'              => $validated['mobility'] ?? null,
            'lives_alone'           => $validated['lives_alone'] ?? null,

        ];

        if ($file = $request->file('hero_image')) {
            // usuń poprzedni plik (jeśli był)
            if ($offer->hero_image && Storage::disk('public')->exists($offer->hero_image)) {
                Storage::disk('public')->delete($offer->hero_image);
            }
            $payload['hero_image'] = $file->store('offers', 'public');
        }

        $offer->update($payload);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Oferta zaktualizowana.');
    }

    public function destroy(Offer $offer)
    {
        if ($offer->hero_image && Storage::disk('public')->exists($offer->hero_image)) {
            Storage::disk('public')->delete($offer->hero_image);
        }
        $offer->delete();

        return back()->with('success', 'Oferta usunięta.');
    }

    /** Każda linia => 1 element tablicy, bez pustych pozycji */
    private static function linesToArray(string $text): array
    {
        $lines = preg_split("/\r\n|\n|\r/", $text);
        return array_values(array_filter(array_map('trim', $lines), fn($v) => $v !== ''));
    }
}
