<?php

namespace App\Http\Controllers\Admin\Messages\Pl;

use App\Http\Controllers\Controller;
use App\Models\FrontContact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontContactController extends Controller
{
    public function index(Request $request)
    {
        // Filtry z UI
        $filters = [
            'q'        => $request->string('q')->toString(),
            'sort'     => $request->string('sort')->toString() ?: 'created_at',
            'dir'      => $request->string('dir')->toString() ?: 'desc',
            'level'    => $request->string('level')->toString(),
            'read'     => $request->string('read')->toString() ?: 'all', // all|yes|no
            'per_page' => (int) $request->input('per_page', 25),
        ];

        // Sanitizacja
        $allowedSorts = ['id','full_name','email','phone','language_level','created_at','is_read'];
        $sort     = in_array($filters['sort'], $allowedSorts, true) ? $filters['sort'] : 'created_at';
        $dir      = $filters['dir'] === 'asc' ? 'asc' : 'desc';
        $perPage  = in_array($filters['per_page'], [10,25,50,100], true) ? $filters['per_page'] : 25;
        $q        = $filters['q'];
        $level    = $filters['level'];
        $read     = $filters['read'];

        $rows = FrontContact::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($x) use ($q) {
                    $x->where('full_name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%")
                        ->orWhere('phone', 'like', "%{$q}%");
                });
            })
            ->when($level !== '', fn($q) => $q->where('language_level', $level))
            ->when($read === 'yes', fn($q) => $q->where('is_read', true))
            ->when($read === 'no',  fn($q) => $q->where('is_read', false))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/messages/pl/front-contacts/Index', [
            'contacts' => $rows,
            'filters'  => $filters,
        ]);
    }

    public function show(FrontContact $contact)
    {
        return Inertia::render('Admin/messages/pl/front-contacts/Show', [
            'contact' => [
                'id'             => $contact->id,
                'full_name'      => $contact->full_name ?? $contact->name,
                'email'          => $contact->email,
                'phone'          => $contact->phone,
                'language_level' => $contact->language_level,
                'consents'       => $contact->consents,
                'is_read'        => (bool) $contact->is_read,
                'created_at'     => optional($contact->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function edit(FrontContact $contact)
    {
        return Inertia::render('Admin/messages/pl/front-contacts/Edit', [
            'contact' => [
                'id'             => $contact->id,
                'full_name'      => $contact->full_name,
                'email'          => $contact->email,
                'phone'          => $contact->phone,
                'language_level' => $contact->language_level,
                'is_read'        => (bool) $contact->is_read,
                'created_at'     => optional($contact->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, FrontContact $contact)
    {
        $data = $request->validate([
            'full_name'      => ['required','string','max:255'],
            'email'          => ['required','email','max:255'],
            'phone'          => ['nullable','string','max:255'],
            'language_level' => ['nullable','string','max:255'],
            'is_read'        => ['boolean'],
        ]);

        $contact->update($data);

        return $request->boolean('stay')
            ? back()->with('success', 'Zaktualizowano.')
            : redirect()->route('admin.msg.pl.front-contacts.show', $contact)
                ->with('success', 'Zaktualizowano.');
    }

    public function destroy(FrontContact $contact)
    {
        $contact->delete();

        return redirect()
            ->route('admin.msg.pl.front-contacts.index')
            ->with('success', 'Usunięto.');
    }

    public function toggleRead(FrontContact $contact)
    {
        $contact->update(['is_read' => ! $contact->is_read]);
        return back(303)->with('success', 'Zmieniono status.');
    }
}
