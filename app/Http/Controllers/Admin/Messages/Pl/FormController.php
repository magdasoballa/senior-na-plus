<?php

namespace App\Http\Controllers\Admin\Messages\Pl;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    // aliasy z frontu -> realne kolumny w DB
    private array $colMap = [
        'id'             => 'applications.id',
        'full_name'      => 'applications.name',
        'email'          => 'applications.email',
        'phone'          => 'applications.phone',
        'language_level' => 'applications.language_level',
        'experience'     => 'applications.experience',
        'created_at'     => 'applications.created_at',
        // 'is_read' — nie istnieje w DB; nie sortujemy po nim
    ];

    public function index(Request $request)
    {
        $filters = [
            'q'          => (string)$request->query('q', ''),
            'level'      => (string)$request->query('level', ''),
            'experience' => (string)$request->query('experience', ''),
            'read'       => (string)$request->query('read', ''),   // ignorujemy – brak kolumny
            'per_page'   => (int)$request->query('per_page', 25),
            'sort'       => (string)$request->query('sort', 'created_at'),
            'dir'        => strtolower((string)$request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc',
        ];

        $sortCol = $this->colMap[$filters['sort']] ?? 'applications.created_at';

        $rows = Application::query()
            ->selectRaw("
                applications.id,
                applications.name as full_name,
                applications.email,
                applications.phone,
                applications.language_level,
                applications.experience,
                applications.created_at,
                0 as is_read
            ")
            ->when($filters['q'] !== '', function ($q) use ($filters) {
                $t = $filters['q'];
                $q->where(function ($qq) use ($t) {
                    $qq->where('applications.name',  'like', "%{$t}%")
                        ->orWhere('applications.email', 'like', "%{$t}%")
                        ->orWhere('applications.phone', 'like', "%{$t}%");
                });
            })
            ->when($filters['level'] !== '', fn($q) => $q->where('applications.language_level', $filters['level']))
            ->when($filters['experience'] !== '', fn($q) => $q->where('applications.experience', $filters['experience']))
            // UWAGA: brak kolumny is_read — filtr 'read' ignorujemy.
            ->orderBy($sortCol, $filters['dir'])
            ->paginate(max(5, min(200, $filters['per_page'])))
            ->withQueryString();

        return Inertia::render('Admin/messages/pl/forms/Index', [
            'forms'   => $rows,
            'filters' => $filters,
        ]);
    }

    public function show(Application $form)
    {
        // dopasowane pola do widoku Show (możesz rozszerzyć według potrzeb)
        return Inertia::render('Admin/messages/pl/forms/Show', [
            'form' => [
                'id'                   => $form->id,
                'full_name'            => $form->name,
                'email'                => $form->email,
                'phone'                => $form->phone,
                'language_level'       => $form->language_level,
                'profession_trained'   => $form->education ?? null,           // jeśli masz inne nazwy – podmień
                'profession_performed' => $form->current_profession ?? null,
                'experience'           => $form->experience,
                'skills'               => null,                                // brak w DB – zostaw null/[] jeśli potrzebne
                'salary'               => $form->salary_expectations ?? null,
                'references'           => $form->references_path ?? null,
                'is_read'              => false,                               // brak kolumny
                'created_at'           => optional($form->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function edit(Application $form)
    {
        return Inertia::render('Admin/messages/pl/forms/Edit', [
            'form' => [
                'id'                   => $form->id,
                'full_name'            => $form->name,
                'email'                => $form->email,
                'phone'                => $form->phone,
                'language_level'       => $form->language_level,
                'profession_trained'   => $form->education ?? null,
                'profession_performed' => $form->current_profession ?? null,
                'experience'           => $form->experience,
                'skills'               => [],   // brak kolumny — dostosuj, jeśli dodasz
                'salary'               => $form->salary_expectations ?? null,
                'references'           => $form->references_path ?? null,
                'is_read'              => false,
                'created_at'           => optional($form->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, Application $form)
    {
        // minimalna walidacja pod dane, które realnie istnieją
        $data = $request->validate([
            'full_name'            => ['required','string','max:255'],
            'email'                => ['required','email','max:255'],
            'phone'                => ['nullable','string','max:255'],
            'language_level'       => ['nullable','string','max:255'],
            'experience'           => ['nullable','string','max:255'],
            'salary'               => ['nullable','string','max:255'],
        ]);

        // mapowanie z aliasów do kolumn
        $form->update([
            'name'               => $data['full_name'],
            'email'              => $data['email'],
            'phone'              => $data['phone'] ?? null,
            'language_level'     => $data['language_level'] ?? null,
            'experience'         => $data['experience'] ?? null,
            'salary_expectations'=> $data['salary'] ?? null,
        ]);

        return to_route('admin.msg.pl.forms.index')->with('success','Zaktualizowano.');
    }

    public function destroy(Application $form)
    {
        $form->delete();
        return to_route('admin.msg.pl.forms.index')->with('success','Usunięto.');
    }

}
