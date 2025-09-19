<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File as FileRule;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /** Public: formularz aplikacyjny dla oferty */
    public function create(Offer $offer)
    {
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
        // Walidacja — max w KB (5 MB = 5120 KB)
        $validated = $request->validate([
            // podstawowe
            'name'  => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'required|string|max:20',
            'language_level' => 'required|string|max:50',

            // dodatkowe
            'additional_language' => 'nullable|string|max:100',
            'learned_profession'  => 'nullable|string|max:255',
            'current_profession'  => 'nullable|string|max:255',

            // doświadczenie
            'experience' => 'required|string|in:brak,od 1 roku,od 1 do 3 lat,powyżej 3 lat',

            // plik — dopuszczalne typy i 5 MB limit
            'references' => [
                'nullable',
                FileRule::types(['pdf','doc','docx','jpg','jpeg','png'])
                    ->max(5 * 1024), // 5 MB w KB
            ],

            // kwota (jeśli wysyłasz liczbowo)
            'salary_expectations' => 'nullable|numeric|min:0|max:1000000',

            // zgody
            'consent1' => 'required|accepted',
            'consent2' => 'required|accepted',
            'consent3' => 'required|accepted',

            // oferta
            'offer_id' => 'required|exists:offers,id',
        ], [
            // krótkie komunikaty (opcjonalnie)
            'references.max'   => 'Plik z referencjami jest za duży (max 5 MB).',
            'references.types' => 'Nieobsługiwany format. Dozwolone: PDF, DOC, DOCX, JPG, JPEG, PNG.',
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
            'salary_expectations'     => $request->input('salary_expectations'),
            'offer_id'   => $offer->id,
            'offer_title'=> $offer->title,  // z bazy
            'consent1'   => $request->boolean('consent1'),
            'consent2'   => $request->boolean('consent2'),
            'consent3'   => $request->boolean('consent3'),
            'status'     => 'new',
        ]);

        // Upload (jeśli jest plik) — dodatkowe, defensywne sprawdzenie
        if ($request->hasFile('references')) {
            $file = $request->file('references');

            // Sprawdź błąd uploadu po stronie PHP (np. ini_size)
            if (!$file->isValid()) {
                // Zaloguj szczegóły i zwróć błąd walidacji dla spójności z Inertia
                Log::warning('Upload invalid', [
                    'error' => $file->getError(),
                    'error_message' => $file->getErrorMessage(),
                ]);
                return back()
                    ->withErrors(['references' => 'Nie udało się wgrać pliku. Spróbuj ponownie lub wybierz mniejszy plik.'])
                    ->withInput();
            }

            // (opcjonalnie) sprawdzenie rozmiaru w runtime — jeśli chcesz podwójny bezpiecznik
            if ($file->getSize() > 5 * 1024 * 1024) {
                return back()
                    ->withErrors(['references' => 'Plik jest za duży (max 5 MB).'])
                    ->withInput();
            }

            // Zapis do storage/public/references z bezpieczną, haszowaną nazwą
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
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /** Admin: szczegóły */
    public function show(\App\Models\Application $application)
    {
        $application->load(['offer' => function ($q) {
            $q->select('id','title','city','country','start_date','duration','language','wage');
        }]);

        return \Inertia\Inertia::render('Admin/Applications/Show', [
            'application' => [
                'id' => $application->id,
                'name' => $application->name,
                'email' => $application->email,
                'phone' => $application->phone,
                'language_level' => $application->language_level,
                'additional_language' => $application->additional_language,
                'learned_profession' => $application->learned_profession,
                'current_profession' => $application->current_profession,
                'experience' => $application->experience,
                'first_aid_course' => $application->first_aid_course,
                'medical_caregiver_course' => $application->medical_caregiver_course,
                'care_experience' => $application->care_experience,
                'housekeeping_experience' => $application->housekeeping_experience,
                'cooking_experience' => $application->cooking_experience,
                'driving_license' => $application->driving_license,
                'smoker' => $application->smoker,
                'salary_expectations' => $application->salary_expectations,
                'references_path' => $application->references_path,
                'consent1' => $application->consent1,
                'consent2' => $application->consent2,
                'consent3' => $application->consent3,
                'offer_id' => $application->offer_id,
                'offer_title' => $application->offer_title,
                'status' => $application->status,
                'created_at' => $application->created_at,
                'updated_at' => $application->updated_at,
                'offer' => $application->offer
                    ? $application->offer->only(['id', 'title', 'city', 'country', 'start_date', 'duration', 'language', 'wage'])
                    : null,
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
