<?php

namespace App\Http\Controllers;

use App\Models\QuickApplication;
use Illuminate\Http\Request;

class QuickApplicationController extends Controller
{
    public function store(Request $request)
    {
        try {
            \Log::info('QuickApplication store hit', $request->all());

            $data = $request->validate([
                'name'     => ['required','string','max:255'],
                'email'    => ['required','email','max:255'],
                'phone'    => ['nullable','string','max:50'],
                'consent1' => ['accepted'],
                'consent2' => ['sometimes', 'boolean'],
                'consent3' => ['sometimes', 'boolean'],
                'offer_id'    => ['nullable', 'integer'],
                'offer_title' => ['nullable','string','max:255'],
            ]);

            $data['consent2'] = $data['consent2'] ?? false;
            $data['consent3'] = $data['consent3'] ?? false;
            $data['ip'] = $request->ip();
            $data['user_agent'] = $request->userAgent();
            $data['url'] = url()->previous();

            \Log::info('QuickApplication data validated', $data);

            $application = QuickApplication::create($data);

            \Log::info('QuickApplication created with ID: ' . $application->id);

            return back()->with('success', 'Dziękujemy! Zgłoszenie z „Szybkiej aplikacji” zostało wysłane.');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('QuickApplication validation failed: ' . json_encode($e->errors()));
            return back()->withErrors($e->errors())->withInput();

        } catch (\Exception $e) {
            \Log::error('QuickApplication error: ' . $e->getMessage());
            return back()->with('error', 'Wystąpił błąd: ' . $e->getMessage());
        }
    }
}
