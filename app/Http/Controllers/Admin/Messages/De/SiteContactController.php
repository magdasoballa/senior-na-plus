<?php

namespace App\Http\Controllers\Admin\Messages\De;

use App\Http\Controllers\Controller;
use App\Models\SiteContact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteContactController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'q'    => (string) $request->string('q'),
            'sort' => (string) $request->string('sort') ?: 'created_at',
            'dir'  => (string) $request->string('dir')  ?: 'desc',
        ];

        // zamiana aliasu z UI
        $requestedSort = $filters['sort'] === 'full_name' ? 'name' : $filters['sort'];
        $allowedSorts  = ['id','name','email','phone','subject','created_at','is_read'];
        $sort = in_array($requestedSort, $allowedSorts, true) ? $requestedSort : 'created_at';
        $dir  = $filters['dir'] === 'asc' ? 'asc' : 'desc';

        $rows = SiteContact::query()
            ->where('locale', 'de')
            ->search($filters['q'] ?? null)     // Twój scope z modelu
            ->orderBy($sort, $dir)
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('Admin/messages/de/site-contacts/Index', [
            'contacts' => $rows,
            'filters'  => $filters,
        ]);
    }

    public function show(SiteContact $contact)
    {
        abort_if($contact->locale !== 'de', 404);

        // zwracamy wszystko; appended 'full_name' będzie dołączone
        $payload         = $contact->toArray();
        $payload['created_at'] = optional($contact->created_at)->toIso8601String();

        return Inertia::render('Admin/messages/de/site-contacts/Show', [
            'contact' => $payload,
        ]);
    }

    public function edit(SiteContact $contact)
    {
        abort_if($contact->locale !== 'de', 404);

        return Inertia::render('Admin/messages/de/site-contacts/Edit', [
            'contact' => $contact->only([
                'id','name','email','phone','subject','message','is_read','created_at'
            ]),
        ]);
    }

    public function update(Request $request, SiteContact $contact)
    {
        abort_if($contact->locale !== 'de', 404);

        $data = $request->validate([
            'name'    => ['required','string','max:255'],
            'email'   => ['required','email','max:255'],
            'phone'   => ['nullable','string','max:255'],
            'subject' => ['nullable','string','max:255'],
            'message' => ['nullable','string'],
            'is_read' => ['boolean'],
        ]);

        $contact->update($data);

        return $request->boolean('stay')
            ? back()->with('success', 'Zaktualizowano.')
            : to_route('admin.msg.de.site-contacts.index')->with('success', 'Zaktualizowano.');
    }

    public function destroy(SiteContact $contact)
    {
        abort_if($contact->locale !== 'de', 404);
        $contact->delete();
        return back()->with('success', 'Usunięto.');
    }

    public function toggleRead(SiteContact $contact)
    {
        abort_if($contact->locale !== 'de', 404);
        $contact->update(['is_read' => ! $contact->is_read]);
        return back(303);
    }
}
