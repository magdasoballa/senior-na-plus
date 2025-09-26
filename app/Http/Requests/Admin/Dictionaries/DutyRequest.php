<?php

namespace App\Http\Requests\Admin\Dictionaries;

use Illuminate\Foundation\Http\FormRequest;

class DutyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'is_visible' => ['nullable', 'boolean'],
            'redirectTo' => ['nullable', 'in:index,continue'],
        ];
    }
}
