<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    /**
     * Wyświetl formularz aplikacyjny
     */
    public function create($offerId)
    {
        $offer = Offer::findOrFail($offerId);

        return Inertia::render('ApplicationPage', [
            'offer' => $offer
        ]);
    }

    /**
     * Zapisz aplikację
     */
    public function store(Request $request)
    {
        // Walidacja danych
        $validated = $request->validate([
            // Podstawowe informacje
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'language_level' => 'required|string|max:50',

            // Dodatkowe informacje
            'additional_language' => 'nullable|string|max:100',
            'learned_profession' => 'nullable|string|max:255',
            'current_profession' => 'nullable|string|max:255',

            // Doświadczenie zawodowe
            'experience' => 'required|string|in:brak,od 1 roku,od 1 do 3 lat,powyżej 3 lat',
            'first_aid_course' => 'boolean',
            'medical_caregiver_course' => 'boolean',
            'care_experience' => 'boolean',
            'housekeeping_experience' => 'boolean',
            'cooking_experience' => 'boolean',
            'driving_license' => 'boolean',
            'smoker' => 'boolean',

            // Oczekiwania finansowe
            'salary_expectations' => 'nullable|string|max:50',

            // Referencje (plik)
            'references' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',

            // Zgody
            'consent1' => 'required|accepted',
            'consent2' => 'required|accepted',
            'consent3' => 'required|accepted',

            // ID oferty
            'offer_id' => 'required|exists:offers,id',
            'offer_title' => 'required|string|max:255',
        ]);

        // Przygotuj dane do zapisania
        $applicationData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'language_level' => $validated['language_level'],
            'additional_language' => $validated['additional_language'],
            'learned_profession' => $validated['learned_profession'],
            'current_profession' => $validated['current_profession'],
            'experience' => $validated['experience'],
            'first_aid_course' => $validated['first_aid_course'] ?? false,
            'medical_caregiver_course' => $validated['medical_caregiver_course'] ?? false,
            'care_experience' => $validated['care_experience'] ?? false,
            'housekeeping_experience' => $validated['housekeeping_experience'] ?? false,
            'cooking_experience' => $validated['cooking_experience'] ?? false,
            'driving_license' => $validated['driving_license'] ?? false,
            'smoker' => $validated['smoker'] ?? false,
            'salary_expectations' => $validated['salary_expectations'],
            'offer_id' => $validated['offer_id'],
            'offer_title' => $validated['offer_title'],
            'consent1' => $validated['consent1'],
            'consent2' => $validated['consent2'],
            'consent3' => $validated['consent3'],
        ];

        // Obsługa pliku referencji
        if ($request->hasFile('references')) {
            $file = $request->file('references');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('references', $fileName, 'public');
            $applicationData['references_path'] = $path;
        }

        // Zapisz aplikację
        $application = Application::create($applicationData);

        // Tutaj możesz dodać wysyłkę emaila powiadamiającego
        // $this->sendNotificationEmail($application);

        return redirect()->back()->with('success', 'Aplikacja została pomyślnie wysłana! Dziękujemy.');
    }

    /**
     * Wyświetl listę aplikacji (dla admina)
     */
    public function index()
    {
        $applications = Application::with('offer')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ApplicationPage', [
            'applications' => $applications
        ]);
    }

    /**
     * Wyświetl pojedynczą aplikację (dla admina)
     */
    public function show($id)
    {
        $application = Application::with('offer')->findOrFail($id);

        return Inertia::render('Offers/Show', [
            'application' => $application
        ]);
    }

    /**
     * Pobierz plik referencji
     */
    public function downloadReferences($id)
    {
        $application = Application::findOrFail($id);

        if (!$application->references_path) {
            abort(404, 'Plik nie istnieje');
        }

        return Storage::disk('public')->download($application->references_path);
    }

    /**
     * Zmień status aplikacji (dla admina)
     */
    public function updateStatus(Request $request, $id)
    {
        $application = Application::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,accepted,rejected'
        ]);

        $application->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status aplikacji zaktualizowany.');
    }

    /**
     * Usuń aplikację (dla admina)
     */
    public function destroy($id)
    {
        $application = Application::findOrFail($id);

        // Usuń plik referencji jeśli istnieje
        if ($application->references_path && Storage::disk('public')->exists($application->references_path)) {
            Storage::disk('public')->delete($application->references_path);
        }

        $application->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Aplikacja została usunięta.');
    }

    /**
     * Wyślij email powiadamiający (opcjonalne)
     */
    private function sendNotificationEmail(Application $application)
    {
        // Przykładowa implementacja wysyłki emaila
        // \Mail::to('rekrutacja@seniornaplus.pl')->send(new NewApplicationMail($application));
        // \Mail::to($application->email)->send(new ApplicationConfirmationMail($application));
    }
}
