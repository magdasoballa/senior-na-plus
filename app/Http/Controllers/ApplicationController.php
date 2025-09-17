<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /** Public: formularz aplikacyjny dla oferty */
    public function create(Offer $offer)
    {
        // Do frontu zwykle wystarczy id + title
        return Inertia::render('ApplicationPage', [
            'offer' => [
                'id' => $offer->id,
                'title' => $offer->title,
            ],
        ]);
    }

    /** Public: zapis pełnej aplikacji */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // podstawowe
            'name'  => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'language_level' => 'required|string|max:50',

            // dodatkowe
            'additional_language' => 'nullable|string|max:100',
            'learned_profession'  => 'nullable|string|max:255',
            'current_profession'  => 'nullable|string|max:255',

            // doświadczenie
            'experience' => 'required|string|in:brak,od 1 roku,od 1 do 3 lat,powyżej 3 lat',

            // plik
            'references' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',

            // zgody
            'consent1' => 'required|accepted',
            'consent2' => 'required|accepted',
            'consent3' => 'required|accepted',

            // oferta
            'offer_id' => 'required|exists:offers,id',
            // UWAGA: nie przyjmujemy offer_title z frontu
        ]);

        $offer = Offer::findOrFail($validated['offer_id']);

        $application = new Application();
        $application->fill([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'language_level'      => $validated['language_level'],
            'additional_language' => $validated['additional_language'] ?? null,
            'learned_profession'  => $validated['learned_profession'] ?? null,
            'current_profession'  => $validated['current_profession'] ?? null,
            'experience'          => $validated['experience'],
            'first_aid_course'        => $request->boolean('first_aid_course'),
            'medical_caregiver_course'=> $request->boolean('medical_caregiver_course'),
            'care_experience'         => $request->boolean('care_experience'),
            'housekeeping_experience' => $request->boolean('housekeeping_experience'),
            'cooking_experience'      => $request->boolean('cooking_experience'),
            'driving_license'         => $request->boolean('driving_license'),
            'smoker'                  => $request->boolean('smoker'),
            'salary_expectations' => $request->input('salary_expectations'),
            'offer_id'   => $offer->id,
            'offer_title'=> $offer->title,  // ← z bazy, nie z requestu
            'consent1'   => $request->boolean('consent1'),
            'consent2'   => $request->boolean('consent2'),
            'consent3'   => $request->boolean('consent3'),
            'status'     => 'new',
        ]);

        if ($file = $request->file('references')) {
            // np. references/abc123.pdf
            $path = $file->store('references', 'public');
            $application->references_path = $path;
        }

        $application->save();

        return back()->with('success', 'Aplikacja została pomyślnie wysłana! Dziękujemy.');
    }

    /** Admin: lista */
    public function index()
    {
        $applications = Application::with('offer')
            ->latest()
            ->paginate(20) // lepiej niż get()
            ->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /** Admin: szczegóły */
    public function show(\App\Models\Application $application)
    {
        // Załaduj relację i wybierz konkretne kolumny (tu: to, co chcesz pokazać)
        $application->load(['offer' => function ($q) {
            $q->select('id','title','city','country','start_date','duration','language','wage');
            // ->withoutGlobalScopes(); // odkomentuj, jeśli masz jakieś global scopes na Offer
        }]);

        // Wyślij jawny kształt propsów
        return \Inertia\Inertia::render('Admin/Applications/Show', [
            'application' => [
                'id'    => $application->id,
                'name'  => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'offer' => $application->offer
                    ? $application->offer->only(['id','title','city','country','start_date','duration','language','wage'])
                    : null,
                'offer_title' => $application->offer_title, // fallback
            ],
        ]);
    }

    /** Admin: pobranie referencji */
    public function downloadReferences(Application $application)
    {
        abort_if(!$application->references_path, 404, 'Plik nie istnieje');

        return Storage::disk('public')->download($application->references_path);
    }

    /** Admin: zmiana statusu */
    public function updateStatus(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,accepted,rejected'
        ]);

        $application->update(['status' => $validated['status']]);

        return back()->with('success', 'Status aplikacji zaktualizowany.');
    }

    /** Admin: usunięcie */
    public function destroy(Application $application)
    {
        if ($application->references_path && Storage::disk('public')->exists($application->references_path)) {
            Storage::disk('public')->delete($application->references_path);
        }

        $application->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Aplikacja została usunięta.');
    }
}
