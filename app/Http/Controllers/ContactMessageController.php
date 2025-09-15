<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255'],
            'phone'    => ['nullable','string','max:30'],
            'message'  => ['required','string','min:10'],
            'consent1' => ['accepted'],
            'consent2' => ['boolean'],
            'consent3' => ['boolean'],
        ]);

        $data['ip'] = $request->ip();
        $data['user_agent'] = $request->userAgent();

        ContactMessage::create($data);

        return back()->with('success', 'Dziękujemy! Wiadomość została wysłana.');
    }
}
