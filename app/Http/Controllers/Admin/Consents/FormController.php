<?php

namespace App\Http\Controllers\Admin\Consents;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConsentsFormRequest;
use App\Models\Form;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();

        $forms = Form::query()
            ->when($q, fn ($qq) => $qq->where('name', 'like', "%{$q}%"))
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/consents/forms/Index', [
            'forms'   => $forms,
            'filters' => ['q' => $q],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/consents/forms/Form', ['form' => null]);
    }

    public function store(ConsentsFormRequest $request)
    {
        $payload = $request->validated();
        $payload['visible_pl'] = $request->boolean('visible_pl');
        $payload['visible_de'] = $request->boolean('visible_de');

        $form = Form::create($payload);

        return $request->input('redirectTo') === 'continue'
            ? to_route('admin.consents.forms.edit', $form)
            : to_route('admin.consents.forms.index');
    }

    public function show(Form $form)
    {
        return Inertia::render('Admin/consents/forms/Show', ['form' => $form]);
    }

    public function edit(Form $form)
    {
        return Inertia::render('Admin/consents/forms/Form', ['form' => $form]);
    }

    public function update(ConsentsFormRequest $request, Form $form)
    {
        $payload = $request->validated();
        $payload['visible_pl'] = $request->boolean('visible_pl');
        $payload['visible_de'] = $request->boolean('visible_de');

        $form->update($payload);

        return $request->input('redirectTo') === 'continue'
            ? back()
            : to_route('admin.consents.forms.index');
    }

    public function destroy(Form $form)
    {
        $form->delete();
        return back();
    }

    public function toggle(Form $form, string $locale)
    {
        abort_unless(in_array($locale, ['pl', 'de']), 404);
        $field = $locale === 'pl' ? 'visible_pl' : 'visible_de';
        $form->update([$field => ! $form->{$field}]);

        return back()->with('success', 'Zmieniono widoczność.');
    }
}
