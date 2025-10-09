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
        // wejściowe filtry
        $q        = (string) $request->string('q');
        $sortIn   = (string) ($request->string('sort') ?: 'created_at');
        $dir      = (string) ($request->string('dir')  ?: 'desc');

        // nowość: parametry z UI
        $perPage  = (int) $request->input('per_page', 25);
        // sanity-check perPage
        if (!in_array($perPage, [10, 25, 50, 100], true)) {
            $perPage = 25;
        }

        // is_read może przyjść jako '1'/'0' lub bool
        $isReadParam = $request->input('is_read', null); // '1'|'0'|1|0|true|false|null
        $isRead = null;
        if ($isReadParam !== null && $isReadParam !== '') {
            $isRead = filter_var($isReadParam, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            // FILTER_VALIDATE_BOOLEAN zwraca true/false dla '1','0','true','false', 1,0 itp.
            // jeśli dostał '1' => true, '0' => false
        }

        // sort whitelist
        $requestedSort = $sortIn === 'full_name' ? 'name' : $sortIn;
        $allowedSorts  = ['id','name','email','phone','subject','created_at','is_read'];
        $sort = in_array($requestedSort, $allowedSorts, true) ? $requestedSort : 'created_at';
        $dir  = $dir === 'asc' ? 'asc' : 'desc';

        $rows = SiteContact::query()
            ->where('locale', 'de')
            ->when($q !== '', fn($qBuilder) => $qBuilder->search($q))                 // Twój scope
            ->when($isRead !== null, fn($qBuilder) => $qBuilder->where('is_read', $isRead ? 1 : 0))
            ->orderBy($sort, $dir)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/messages/de/site-contacts/Index', [
            'contacts' => $rows,
            // zwróć wszystkie filtry, żeby UI mogło je ustawić
            'filters'  => [
                'q'        => $q,
                'sort'     => $sortIn,
                'dir'      => $dir,
                'is_read'  => $isRead === null ? null : ($isRead ? '1' : '0'),
                'per_page' => $perPage,
            ],
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
