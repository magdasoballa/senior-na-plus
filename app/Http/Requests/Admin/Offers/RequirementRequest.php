<?php

namespace App\Http\Requests\Admin\Offers;

use Illuminate\Foundation\Http\FormRequest;

class RequirementRequest extends FormRequest
{
    public function authorize(): bool
    {
        $u = $this->user();
        return $u ? (bool) ($u->is_admin ?? false) : false;
    }

    public function rules(): array
    {
        return [
            'name'       => ['required','string','max:255'],
            'is_visible' => ['sometimes','boolean'],
            'redirectTo' => ['nullable','in:index,continue'],
        ];
    }

    public function prepareForValidation(): void
    {
        $this->merge([
            'is_visible' => filter_var($this->input('is_visible', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nazwa jest wymagana.',
        ];
    }
}
