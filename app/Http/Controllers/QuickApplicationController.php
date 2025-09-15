<?php

namespace App\Http\Controllers;

use App\Models\QuickApplication;
use Illuminate\Http\Request;

class QuickApplicationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255'],
            'phone'    => ['nullable','string','max:50'],
            'consent1' => ['accepted'],
            'consent2' => ['boolean'],
            'consent3' => ['boolean'],
            'offer_id'    => ['nullable','string','max:255'],
            'offer_title' => ['nullable','string','max:255'],
        ]);

        $data['ip'] = $request->ip();
        $data['user_agent'] = $request->userAgent();
        $data['url'] = url()->previous();

        QuickApplication::create($data);

        return back()->with('success', 'Dziękujemy! Zgłoszenie z „Szybkiej aplikacji” zostało wysłane.');
    }
}
