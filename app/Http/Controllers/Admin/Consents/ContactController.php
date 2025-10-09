<?php

namespace App\Http\Controllers\Admin\Consents;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConsentsContactRequest;
use App\Models\ContactConsent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();

        $contacts = ContactConsent::query()
            ->when($q, fn($qq) => $qq->where('name','like',"%{$q}%"))
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/consents/contacts/Index', [
            'contacts' => $contacts,
            'filters'  => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/consents/contacts/Form', ['contact' => null]);
    }

    public function store(ConsentsContactRequest $request)
    {
        $contact = ContactConsent::create($request->validated() + [
                'visible_pl' => $request->boolean('visible_pl'),
                'visible_de' => $request->boolean('visible_de'),
            ]);

        // ↙️ jeśli front przysłał redirectTo=continue → idź na E D Y C J Ę
        if ($request->input('redirectTo') === 'continue') {
            return redirect()
                ->route('admin.consents.contacts.edit', $contact)
                ->with('success', 'Utworzono kontaktową zgodę.');
        }

        return to_route('admin.consents.contacts.index')
            ->with('success', 'Utworzono kontaktową zgodę.');
    }

    public function show(ContactConsent $contact)
    {
        return Inertia::render('Admin/consents/contacts/Show', ['contact' => $contact]);
    }

    public function edit(ContactConsent $contact)
    {
        return Inertia::render('Admin/consents/contacts/Form', ['contact' => $contact]);
    }

    public function update(ConsentsContactRequest $request, ContactConsent $contact)
    {
        $contact->update($request->validated() + [
                'visible_pl' => $request->boolean('visible_pl'),
                'visible_de' => $request->boolean('visible_de'),
            ]);

        // ↙️ zostań na edycji jeśli redirectTo=continue (Inertia dostanie flash)
        if ($request->input('redirectTo') === 'continue') {
            // wariant 1: powrót 303 na tę samą stronę (bez zmiany URL)
            return back(303)->with('success', 'Zapisano zmiany.');
            // wariant 2: jawnie na route edit (również OK):
            // return redirect()->route('admin.consents.contacts.edit', $contact)->with('success', 'Zapisano zmiany.');
        }

        return to_route('admin.consents.contacts.index')
            ->with('success', 'Zaktualizowano.');
    }

    public function destroy(ContactConsent $contact)
    {
        $contact->delete();
        return back()->with('success', 'Usunięto.');
    }

    public function toggle(ContactConsent $contact, string $locale)
    {
        abort_unless(in_array($locale, ['pl','de']), 404);
        $field = $locale === 'pl' ? 'visible_pl' : 'visible_de';
        $contact->update([$field => ! $contact->{$field}]);

        return back()->with('success', 'Zmieniono widoczność.');
    }
}
