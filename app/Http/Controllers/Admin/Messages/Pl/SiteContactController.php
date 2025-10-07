<?php

namespace App\Http\Controllers\Admin\Messages\Pl;

use App\Http\Controllers\Controller;
use App\Models\SiteContact; // <- model kontaktów ze strony
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteContactController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'q'        => $request->string('q')->toString(),
            'sort'     => $request->string('sort')->toString() ?: 'created_at',
            'dir'      => $request->string('dir')->toString() ?: 'desc',
            'read'     => $request->string('read')->toString() ?: 'all',      // all|yes|no
            'per_page' => (int) $request->input('per_page', 25),
        ];

        $allowedSorts = ['id','name','full_name','email','phone','subject','created_at','is_read'];
        $sort    = in_array($filters['sort'], $allowedSorts, true) ? $filters['sort'] : 'created_at';
        $dir     = $filters['dir'] === 'asc' ? 'asc' : 'desc';
        $perPage = in_array($filters['per_page'], [10,25,50,100], true) ? $filters['per_page'] : 25;
        $q       = $filters['q'];
        $read    = $filters['read'];

        $rows = SiteContact::query()
            ->when($q, function ($query, $q) {
                $query->where(function ($x) use ($q) {
                    $x->where('name', 'like', "%{$q}%")
                        ->orWhere('full_name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%")
                        ->orWhere('phone', 'like', "%{$q}%")
                        ->orWhere('subject', 'like', "%{$q}%")
                        ->orWhere('message', 'like', "%{$q}%");
                });
            })
            ->when($read === 'yes', fn($q) => $q->where('is_read', true))
            ->when($read === 'no',  fn($q) => $q->where('is_read', false))
            ->orderBy($sort === 'full_name' ? 'name' : $sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/messages/pl/site-contacts/Index', [
            'contacts' => $rows,
            'filters'  => $filters,
        ]);
    }

    public function show(SiteContact $contact)
    {
        return Inertia::render('Admin/messages/pl/site-contacts/Show', [
            'contact' => [
                'id'         => $contact->id,
                'full_name'  => $contact->full_name ?? $contact->name,
                'email'      => $contact->email,
                'phone'      => $contact->phone,
                'subject'    => $contact->subject,
                'message'    => $contact->message,
                'consents'   => $contact->consents,
                'is_read'    => (bool) $contact->is_read,
                'created_at' => optional($contact->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function edit(SiteContact $contact)
    {
        return Inertia::render('Admin/messages/pl/site-contacts/Edit', [
            'contact' => [
                'id'         => $contact->id,
                'full_name'  => $contact->full_name ?? $contact->name,
                'email'      => $contact->email,
                'phone'      => $contact->phone,
                'subject'    => $contact->subject,
                'message'    => $contact->message,
                'is_read'    => (bool) $contact->is_read,
                'created_at' => optional($contact->created_at)->toIso8601String(),
            ],
        ]);
    }

    public function update(Request $request, SiteContact $contact)
    {
        $data = $request->validate([
            'full_name' => ['required','string','max:255'],
            'email'     => ['required','email','max:255'],
            'phone'     => ['required','string','max:255'],
            'subject'   => ['required','string','max:255'],
            'message'   => ['required','string','max:500'],
            'is_read'   => ['boolean'],
        ]);

        // jeżeli w DB masz kolumnę `name`, zmapuj:
        $payload = [
            'name'     => $data['full_name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'],
            'subject'  => $data['subject'],
            'message'  => $data['message'],
            'is_read'  => $request->boolean('is_read'),
        ];

        $contact->update($payload);

        return $request->boolean('stay')
            ? back()->with('success', 'Zaktualizowano.')
            : redirect()->route('admin.msg.pl.site-contacts.show', $contact)->with('success', 'Zaktualizowano.');
    }

    public function destroy(SiteContact $contact)
    {
        $contact->delete();
        return redirect()->route('admin.msg.pl.site-contacts.index')->with('success', 'Usunięto.');
    }

    public function toggleRead(SiteContact $contact)
    {
        $contact->update(['is_read' => ! $contact->is_read]);
        return back(303)->with('success', 'Zmieniono status.');
    }
}
