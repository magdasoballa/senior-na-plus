<?php

namespace App\Http\Controllers\Admin\Messages\Pl;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class SiteContactController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'q'        => $request->string('q')->toString(),
            'sort'     => $request->string('sort')->toString() ?: 'created_at',
            'dir'      => $request->string('dir')->toString() ?: 'desc',
            'read'     => $request->string('read')->toString() ?: 'all', // all|yes|no
            'per_page' => (int) $request->input('per_page', 25),
        ];

        $allowedSorts = ['id','full_name','name','email','phone','subject','created_at','is_read'];
        $sort    = in_array($filters['sort'], $allowedSorts, true) ? $filters['sort'] : 'created_at';
        $dir     = $filters['dir'] === 'asc' ? 'asc' : 'desc';
        $perPage = in_array($filters['per_page'], [10,25,50,100], true) ? $filters['per_page'] : 25;

        // kolumny w DB
        $hasFullName = Schema::hasColumn('contact_messages', 'full_name');
        $hasName     = Schema::hasColumn('contact_messages', 'name');
        $hasSubject  = Schema::hasColumn('contact_messages', 'subject');
        $hasIsRead   = Schema::hasColumn('contact_messages', 'is_read');
        $hasLocale   = Schema::hasColumn('contact_messages', 'locale');

        $nameCol = $hasFullName ? 'full_name' : ($hasName ? 'name' : null);

        // mapowanie sortowania
        $sortCol = $sort;
        if ($sort === 'full_name' && !$hasFullName && $hasName) $sortCol = 'name';
        if ($sort === 'subject' && !$hasSubject)                $sortCol = 'created_at';

        $q = DB::table('contact_messages');

        // SELECT
        $selects = [
            'contact_messages.id',
            'contact_messages.email',
            'contact_messages.phone',
            'contact_messages.created_at',
        ];
        // subject może nie istnieć
        $selects[] = $hasSubject ? 'contact_messages.subject' : DB::raw('NULL as subject');
        // alias dla nazwy
        $selects[] = $nameCol
            ? DB::raw(($nameCol === 'full_name' ? 'full_name' : 'name') . ' as full_name')
            : DB::raw("'' as full_name");
        // is_read może nie istnieć
        $selects[] = $hasIsRead ? 'contact_messages.is_read' : DB::raw('0 as is_read');

        $q->select($selects);

        if ($hasLocale) {
            $q->where('locale', 'pl');
        }

        // filtrowanie tekstowe
        if ($filters['q'] !== '') {
            $term = $filters['q'];
            $q->where(function ($x) use ($term, $hasFullName, $hasName, $hasSubject) {
                if ($hasFullName) $x->orWhere('full_name', 'like', "%{$term}%");
                if ($hasName)     $x->orWhere('name', 'like', "%{$term}%");
                $x->orWhere('email', 'like', "%{$term}%")
                    ->orWhere('phone', 'like', "%{$term}%");
                if ($hasSubject)  $x->orWhere('subject', 'like', "%{$term}%");
                $x->orWhere('message', 'like', "%{$term}%");
            });
        }

        if ($hasIsRead && $filters['read'] !== 'all') {
            $q->where('is_read', $filters['read'] === 'yes');
        }

        $q->orderBy($sortCol, $dir);

        $rows = $q->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/messages/pl/site-contacts/Index', [
            'contacts' => $rows,
            'filters'  => $filters,
        ]);
    }

    public function show($id)
    {
        $row = DB::table('contact_messages')->where('id', $id)->first();
        if (!$row) abort(404);

        $hasFullName = property_exists($row, 'full_name');
        $hasName     = property_exists($row, 'name');
        $hasSubject  = property_exists($row, 'subject');
        $hasIsRead   = property_exists($row, 'is_read');

        return Inertia::render('Admin/messages/pl/site-contacts/Show', [
            'contact' => [
                'id'         => $row->id,
                'full_name'  => $hasFullName ? $row->full_name : ($hasName ? $row->name : ''),
                'email'      => $row->email ?? '',
                'phone'      => $row->phone ?? '',
                'subject'    => $hasSubject ? ($row->subject ?? null) : null,
                'message'    => $row->message ?? '',
                'consents'   => $row->consents ?? null,
                'is_read'    => (bool) ($hasIsRead ? ($row->is_read ?? false) : false),
                'created_at' => optional(optional($row)->created_at)->toDateTimeString(),
            ],
        ]);
    }

    public function edit($id)
    {
        $row = DB::table('contact_messages')->where('id', $id)->first();
        if (!$row) abort(404);

        $hasFullName = property_exists($row, 'full_name');
        $hasName     = property_exists($row, 'name');
        $hasSubject  = property_exists($row, 'subject');
        $hasIsRead   = property_exists($row, 'is_read');

        return Inertia::render('Admin/messages/pl/site-contacts/Edit', [
            'contact' => [
                'id'         => $row->id,
                'full_name'  => $hasFullName ? $row->full_name : ($hasName ? $row->name : ''),
                'email'      => $row->email ?? '',
                'phone'      => $row->phone ?? '',
                'subject'    => $hasSubject ? ($row->subject ?? '') : '',
                'message'    => $row->message ?? '',
                'is_read'    => (bool) ($hasIsRead ? ($row->is_read ?? false) : false),
                'created_at' => optional(optional($row)->created_at)->toDateTimeString(),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $exists = DB::table('contact_messages')->where('id', $id)->exists();
        abort_unless($exists, 404);

        $data = $request->validate([
            'full_name' => ['required','string','max:255'],
            'email'     => ['required','email','max:255'],
            'phone'     => ['required','string','max:255'],
            'subject'   => ['nullable','string','max:255'],
            'message'   => ['required','string','max:500'],
            'is_read'   => ['sometimes','boolean'],
        ]);

        $payload = [
            'email'   => $data['email'],
            'phone'   => $data['phone'],
            'message' => $data['message'],
        ];

        if (Schema::hasColumn('contact_messages', 'full_name')) {
            $payload['full_name'] = $data['full_name'];
        } elseif (Schema::hasColumn('contact_messages', 'name')) {
            $payload['name'] = $data['full_name'];
        }

        if (Schema::hasColumn('contact_messages', 'subject') && array_key_exists('subject', $data)) {
            $payload['subject'] = $data['subject'];
        }

        if (Schema::hasColumn('contact_messages', 'is_read') && $request->has('is_read')) {
            $payload['is_read'] = $request->boolean('is_read');
        }

        DB::table('contact_messages')->where('id', $id)->update($payload);

        return $request->boolean('stay')
            ? back()->with('success', 'Zaktualizowano.')
            : redirect()->route('admin.msg.pl.site-contacts.show', $id)->with('success', 'Zaktualizowano.');
    }

    public function destroy($id)
    {
        DB::table('contact_messages')->where('id', $id)->delete();
        return redirect()->route('admin.msg.pl.site-contacts.index')->with('success', 'Usunięto.');
    }

    public function toggleRead($id)
    {
        if (!Schema::hasColumn('contact_messages', 'is_read')) {
            return back(303)->with('error', 'Brak kolumny is_read w contact_messages.');
        }

        $row = DB::table('contact_messages')->where('id', $id)->first();
        if (!$row) abort(404);

        DB::table('contact_messages')->where('id', $id)->update([
            'is_read' => ! (bool) ($row->is_read ?? false),
        ]);

        return back(303)->with('success', 'Zmieniono status.');
    }
}
