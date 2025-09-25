<?php

namespace App\Http\Requests\Admin\Dictionaries;

use Illuminate\Foundation\Http\FormRequest;

class CareTargetRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name_pl'       => ['required','string','max:255'],
            'name_de'       => ['nullable','string','max:255'],
            'is_visible_pl' => ['sometimes','boolean'],
            'is_visible_de' => ['sometimes','boolean'],
            'redirectTo'    => ['nullable','in:index,continue'],
        ];
    }

    public function attributes(): array
    {
        return ['name_pl' => 'nazwa (PL)', 'name_de' => 'nazwa (DE)'];
    }
}
