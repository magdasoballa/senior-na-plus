<?php

namespace App\Http\Controllers\Admin\Messages\De;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DeForm;
class FormController extends Controller
{
    private string $locale = 'de';
    private array $sortable = ['id','full_name','email','phone','language_level','created_at','is_read'];

    public function index(Request $request)
    {
        $filters = [
            'q'        => $request->string('q')->toString(),
            'read'     => $request->string('read')->toString(),
            'per_page' => (int)($request->input('per_page', 25)),
        ];

        $pp = max(5, min(200, $filters['per_page'] ?: 25));

        $rows = DeForm::query()
            ->when($filters['q'], function ($q, $term) {
                $q->where(function ($x) use ($term) {
                    $x->where('full_name', 'like', "%{$term}%")
                        ->orWhere('phone', 'like', "%{$term}%")
                        ->orWhere('city', 'like', "%{$term}%")
                        ->orWhere('zip', 'like', "%{$term}%")
                        ->orWhere('zip_code', 'like', "%{$term}%");
                });
            })
            ->when($filters['read'] !== '', fn($q) => $q->where('is_read', $filters['read'] === '1'))
            ->orderByDesc('created_at')
            ->paginate($pp)
            ->withQueryString();

        return Inertia::render('Admin/messages/de/forms/Index', [
            'forms'   => $rows,
            'filters' => $filters,
        ]);
    }

    public function show(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);

        return Inertia::render('Admin/messages/de/forms/Show', [
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

        return Inertia::render('Admin/messages/de/forms/Edit', [
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
            'experience'           => ['nullable','string','max:255'],
            'skills'               => ['nullable','array'],
            'skills.*'             => ['string','max:255'],
            'salary'               => ['nullable','string','max:255'],
            'references'           => ['nullable','string'],
            'is_read'              => ['sometimes','boolean'],
        ]);

        $form->update($data);

        return $request->boolean('stay')
            ? back()->with('success','Aktualisiert.')
            : to_route('admin.msg.de.forms.index')->with('success','Aktualisiert.');
    }

    public function destroy(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);
        $form->delete();

        return to_route('admin.msg.de.forms.index')->with('success','Gelöscht.');
    }

    public function toggleRead(FormSubmission $form)
    {
        abort_unless($form->locale === $this->locale, 404);
        $form->update(['is_read' => ! $form->is_read]);

        return back(303);
    }
}
