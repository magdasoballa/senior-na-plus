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
        'is_read'        => 'applications.is_read', // DODANO - teraz istnieje w DB
    ];

    public function index(Request $request)
    {
        $filters = [
            'q'          => (string)$request->query('q', ''),
            'level'      => (string)$request->query('level', ''),
            'experience' => (string)$request->query('experience', ''),
            'read'       => (string)$request->query('read', ''),   // 'all' | 'yes' | 'no'
            'per_page'   => (int)$request->query('per_page', 25),
            'sort'       => (string)$request->query('sort', 'created_at'),
            'dir'        => strtolower((string)$request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc',
        ];

        $sortCol = $this->colMap[$filters['sort']] ?? 'applications.created_at';

        $rows = Application::query()
            ->select([
                'applications.id',
                'applications.name as full_name',
                'applications.email',
                'applications.phone',
                'applications.language_level',
                'applications.experience',
                'applications.created_at',
                'applications.is_read', // DODANO - pobieramy rzeczywistą kolumnę
            ])
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
            // DODANO: Filtr dla is_read
            ->when($filters['read'] !== '', function ($q) use ($filters) {
                if ($filters['read'] === 'yes') {
                    $q->where('applications.is_read', true);
                } elseif ($filters['read'] === 'no') {
                    $q->where('applications.is_read', false);
                }
            })
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
        return Inertia::render('Admin/messages/pl/forms/Show', [
            'form' => [
                'id'                   => $form->id,
                'full_name'            => $form->name,
                'email'                => $form->email,
                'phone'                => $form->phone,
                'language_level'       => $form->language_level,
                'profession_trained'   => $form->education ?? null,
                'profession_performed' => $form->current_profession ?? null,
                'experience'           => $form->experience,
                'skills'               => null,
                'salary'               => $form->salary_expectations ?? null,
                'references'           => $form->references_path ?? null,
                'is_read'              => (bool)$form->is_read, // DODANO - rzeczywista wartość
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
                'skills'               => [],
                'salary'               => $form->salary_expectations ?? null,
                'references'           => $form->references_path ?? null,
                'is_read'              => (bool)$form->is_read, // DODANO - rzeczywista wartość
                'created_at'           => optional($form->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, Application $form)
    {
        $data = $request->validate([
            'full_name'            => ['required','string','max:255'],
            'email'                => ['required','email','max:255'],
            'phone'                => ['nullable','string','max:255'],
            'language_level'       => ['nullable','string','max:255'],
            'experience'           => ['nullable','string','max:255'],
            'salary'               => ['nullable','string','max:255'],
            'is_read'              => ['sometimes','boolean'], // DODANO - walidacja is_read
        ]);

        $form->update([
            'name'               => $data['full_name'],
            'email'              => $data['email'],
            'phone'              => $data['phone'] ?? null,
            'language_level'     => $data['language_level'] ?? null,
            'experience'         => $data['experience'] ?? null,
            'salary_expectations'=> $data['salary'] ?? null,
            'is_read'            => $data['is_read'] ?? $form->is_read, // DODANO - aktualizacja is_read
        ]);

        return to_route('admin.msg.pl.forms.index')->with('success','Zaktualizowano.');
    }

    // DODAJ METODĘ TOGGLE-READ
    public function toggleRead(Application $form)
    {
        $form->update([
            'is_read' => !$form->is_read,
        ]);

        return back()->with('success', 'Zmieniono status przeczytania.');
    }

    public function destroy(Application $form)
    {
        $form->delete();
        return to_route('admin.msg.pl.forms.index')->with('success','Usunięto.');
    }
}
