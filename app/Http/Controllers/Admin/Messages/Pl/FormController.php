<?php

namespace App\Http\Controllers\Admin\Messages\Pl;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    private string $locale = 'pl';

    // dodane 'experience' do sortowalnych kolumn
    private array $sortable = [
        'id','full_name','email','phone','language_level','experience','created_at','is_read'
    ];

    public function index(Request $request)
    {
        $filters = [
            'q'          => $request->string('q')->toString(),
            'level'      => $request->string('level')->toString(),
            'experience' => $request->string('experience')->toString(), // NOWE
            'read'       => $request->string('read')->toString(),       // '' | '1' | '0'
            'per_page'   => (int)($request->input('per_page', 25)),
            'sort'       => $request->string('sort')->toString() ?: 'created_at',
            'dir'        => $request->string('dir')->toString() ?: 'desc',
        ];

        $sort = in_array($filters['sort'], $this->sortable, true) ? $filters['sort'] : 'created_at';
        $dir  = $filters['dir'] === 'asc' ? 'asc' : 'desc';
        $pp   = max(5, min(200, $filters['per_page'] ?: 25));

        $rows = FormSubmission::query()
            ->where('locale', $this->locale)
            ->when($filters['q'], function ($q, $term) {
                $q->where(function ($x) use ($term) {
                    $x->where('full_name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%")
                        ->orWhere('phone', 'like', "%{$term}%");
                });
            })
            ->when($filters['level'] !== '', fn($q) => $q->where('language_level', $filters['level']))
            ->when($filters['experience'] !== '', fn($q) => $q->where('experience', $filters['experience']))
            ->when($filters['read'] !== '', fn($q) => $q->where('is_read', $filters['read'] === '1'))
            ->orderBy($sort, $dir)
            ->paginate($pp)
            ->withQueryString();

        return Inertia::render('Admin/messages/pl/forms/Index', [
            'forms'   => $rows,
            'filters' => $filters,
        ]);
    }

    public function show(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);

        return Inertia::render('Admin/messages/pl/forms/Show', [
            'form' => [
                'id'                   => $form->id,
                'full_name'            => $form->full_name,
                'email'                => $form->email,
                'phone'                => $form->phone,
                'language_level'       => $form->language_level,
                'profession_trained'   => $form->profession_trained,
                'profession_performed' => $form->profession_performed,
                'experience'           => $form->experience,
                'skills'               => $form->skills,
                'salary'               => $form->salary,
                'references'           => $form->references,
                'consents'             => $form->consents,
                'is_read'              => (bool)$form->is_read,
                'created_at'           => optional($form->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function edit(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);

        return Inertia::render('Admin/messages/pl/forms/Edit', [
            'form' => [
                'id'                   => $form->id,
                'full_name'            => $form->full_name,
                'email'                => $form->email,
                'phone'                => $form->phone,
                'language_level'       => $form->language_level,
                'profession_trained'   => $form->profession_trained,
                'profession_performed' => $form->profession_performed,
                'experience'           => $form->experience,
                'skills'               => $form->skills ?? [],
                'salary'               => $form->salary,
                'references'           => $form->references,
                'is_read'              => (bool)$form->is_read,
                'created_at'           => optional($form->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);

        $data = $request->validate([
            'full_name'            => ['required','string','max:255'],
            'email'                => ['required','email','max:255'],
            'phone'                => ['nullable','string','max:255'],
            'language_level'       => ['nullable','string','max:255'],
            'profession_trained'   => ['nullable','string','max:255'],
            'profession_performed' => ['nullable','string','max:255'],
            'experience'           => ['nullable','string','max:255'], // NOWE
            'skills'               => ['nullable','array'],
            'skills.*'             => ['string','max:255'],
            'salary'               => ['nullable','string','max:255'],
            'references'           => ['nullable','string'],
            'is_read'              => ['sometimes','boolean'],
        ]);

        $form->update($data);

        return $request->boolean('stay')
            ? back()->with('success','Zaktualizowano.')
            : to_route('admin.msg.pl.forms.index')->with('success','Zaktualizowano.');
    }

    public function destroy(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);
        $form->delete();

        return to_route('admin.msg.pl.forms.index')->with('success','Usunięto.');
    }

    public function toggleRead(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);
        $form->update(['is_read' => ! $form->is_read]);

        return back(303);
    }
}
