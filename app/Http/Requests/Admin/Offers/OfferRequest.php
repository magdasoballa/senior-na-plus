<?php

namespace App\Http\Requests\Admin\Offers;

use Illuminate\Foundation\Http\FormRequest;

class OfferRequest extends FormRequest
{
    public function authorize(): bool
    {
        $u = $this->user();
        return $u ? (bool)($u->is_admin ?? false) : false;
    }

    public function rules(): array
    {
        return [
            'title'      => ['required','string','max:255'],
            'city'       => ['nullable','string','max:120'],
            'country'    => ['nullable','string','max:120'],
            'language'   => ['nullable','string','max:60'],
            'wage'       => ['nullable','string','max:50'],   // zostawiasz jako string
            'is_visible' => ['sometimes','boolean'],

            // NOWE – listy ID
            'duties'         => ['array'],
            'duties.*'       => ['integer','exists:duties,id'],

            'requirements'   => ['array'],
            'requirements.*' => ['integer','exists:offer_requirements,id'],

            'perks'          => ['array'],
            'perks.*'        => ['integer','exists:offer_perks,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_visible' => filter_var($this->input('is_visible', false), FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}
