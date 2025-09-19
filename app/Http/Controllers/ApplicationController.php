<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\QuickApplication;
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
            'name'  => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'required|string|max:20',
            'language_level' => 'required|string|max:50',
            'additional_language' => 'nullable|string|max:100',
            'learned_profession'  => 'nullable|string|max:255',
            'current_profession'  => 'nullable|string|max:255',
            'experience' => 'required|string|in:brak,od 1 roku,od 1 do 3 lat,powyżej 3 lat',
            'references' => [
                'nullable',
                FileRule::types(['pdf','doc','docx','jpg','jpeg','png'])
                    ->max(5 * 1024),
            ],
            'salary_expectations' => 'nullable|numeric|min:0|max:1000000',
            'consent1' => 'required|accepted',
            'consent2' => 'required|accepted',
            'consent3' => 'required|accepted',
            'offer_id' => 'required|exists:offers,id',
        ], [
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
            'offer_title'=> $offer->title,
            'consent1'   => $request->boolean('consent1'),
            'consent2'   => $request->boolean('consent2'),
            'consent3'   => $request->boolean('consent3'),
            'status'     => 'new',
        ]);

        if ($request->hasFile('references')) {
            $file = $request->file('references');
            if (!$file->isValid()) {
                Log::warning('Upload invalid', [
                    'error' => $file->getError(),
                    'error_message' => $file->getErrorMessage(),
                ]);
                return back()
                    ->withErrors(['references' => 'Nie udało się wgrać pliku. Spróbuj ponownie lub wybierz mniejszy plik.'])
                    ->withInput();
            }
            if ($file->getSize() > 5 * 1024 * 1024) {
                return back()
                    ->withErrors(['references' => 'Plik jest za duży (max 5 MB).'])
                    ->withInput();
            }
            $path = $file->store('references', 'public');
            $application->references_path = $path;
        }

        $application->save();

        return back()->with('success', 'Aplikacja została pomyślnie wysłana! Dziękujemy.');
    }

    /** Admin: lista */
    public function index()
    {
        // Zwykłe aplikacje z tabeli applications
        $applications = Application::with(['offer' => function ($q) {
            $q->select('id', 'title');
        }])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        // Szybkie aplikacje z tabeli quick_applications
        $quickApplications = QuickApplication::with(['offer' => function ($q) {
            $q->select('id', 'title');
        }])
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications->through(function ($app) {
                return [
                    'id' => $app->id,
                    'name' => $app->name,
                    'email' => $app->email,
                    'phone' => $app->phone,
                    'offer_id' => $app->offer_id,
                    'offer_title' => $app->offer_title,
                    'offer' => $app->offer ? $app->offer->only(['id', 'title']) : null,
                    'status' => $app->status,
                    'created_at' => $app->created_at,
                    'type' => 'application', // Oznaczenie typu dla frontendu
                ];
            }),
            'quick_applications' => $quickApplications->through(function ($quickApp) {
                return [
                    'id' => $quickApp->id,
                    'name' => $quickApp->name,
                    'email' => $quickApp->email,
                    'phone' => $quickApp->phone,
                    'offer_id' => $quickApp->offer_id,
                    'offer_title' => $quickApp->offer_title,
                    'offer' => $quickApp->offer ? $quickApp->offer->only(['id', 'title']) : null,
                    'status' => 'new', // Domyślny status, jeśli nie istnieje w tabeli
                    'created_at' => $quickApp->created_at ?? now(), // Domyślna wartość, jeśli nie istnieje
                    'url' => $quickApp->url,
                    'ip' => $quickApp->ip,
                    'user_agent' => $quickApp->user_agent,
                    'consent1' => $quickApp->consent1,
                    'consent2' => $quickApp->consent2,
                    'consent3' => $quickApp->consent3,
                    'type' => 'quick_application', // Oznaczenie typu dla frontendu
                ];
            }),
        ]);
    }

    /** Admin: szczegóły zwykłej aplikacji */
    public function showApplication(Application $application)
    {
        $application->load(['offer' => function ($q) {
            $q->select('id', 'title', 'city', 'country', 'start_date', 'duration', 'language', 'wage');
        }]);

        return Inertia::render('Admin/Applications/Show', [
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
                'type' => 'application',
            ],
        ]);
    }

    /** Admin: szczegóły szybkiej aplikacji */
    public function showQuickApplication(QuickApplication $quickApplication)
    {
        $quickApplication->load(['offer' => function ($q) {
            $q->select('id', 'title', 'city', 'country', 'start_date', 'duration', 'language', 'wage');
        }]);

        return Inertia::render('Admin/Applications/Show', [
            'application' => [
                'id' => $quickApplication->id,
                'name' => $quickApplication->name,
                'email' => $quickApplication->email,
                'phone' => $quickApplication->phone,
                'offer_id' => $quickApplication->offer_id,
                'offer_title' => $quickApplication->offer_title,
                'status' => 'new', // Domyślny status
                'created_at' => $quickApplication->created_at ?? now(),
                'offer' => $quickApplication->offer
                    ? $quickApplication->offer->only(['id', 'title', 'city', 'country', 'start_date', 'duration', 'language', 'wage'])
                    : null,
                'url' => $quickApplication->url,
                'ip' => $quickApplication->ip,
                'user_agent' => $quickApplication->user_agent,
                'consent1' => $quickApplication->consent1,
                'consent2' => $quickApplication->consent2,
                'consent3' => $quickApplication->consent3,
                'type' => 'quick_application',
            ],
        ]);
    }

    /** Admin: pobranie referencji */
    public function downloadReferences(Application $application)
    {
        abort_if(!$application->references_path, 404, 'Plik nie istnieje');
        return Storage::disk('public')->download($application->references_path);
    }

    /** Admin: zmiana statusu zwykłej aplikacji */
    public function updateStatusApplication(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,accepted,rejected'
        ]);

        $application->update(['status' => $validated['status']]);

        return back()->with('success', 'Status aplikacji zaktualizowany.');
    }

    /** Admin: zmiana statusu szybkiej aplikacji */
    public function updateStatusQuickApplication(Request $request, QuickApplication $quickApplication)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,accepted,rejected'
        ]);

        $quickApplication->update(['status' => $validated['status']]);

        return back()->with('success', 'Status aplikacji zaktualizowany.');
    }

    /** Admin: usunięcie zwykłej aplikacji */
    public function destroyApplication(Application $application)
    {
        if ($application->references_path && Storage::disk('public')->exists($application->references_path)) {
            Storage::disk('public')->delete($application->references_path);
        }
        $application->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Aplikacja została usunięta.');
    }

    /** Admin: usunięcie szybkiej aplikacji */
    public function destroyQuickApplication(QuickApplication $quickApplication)
    {
        $quickApplication->delete();

        return redirect()->route('admin.applications.index')
            ->with('success', 'Aplikacja została usunięta.');
    }
}
