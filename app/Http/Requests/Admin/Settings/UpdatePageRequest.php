<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->is_admin ?? false);
    }

    protected function prepareForValidation(): void
    {
        // Zmień puste stringi na null, żeby 'nullable' działało sensownie
        foreach ([
                     'meta_title_pl','meta_title_de',
                     'meta_description_pl','meta_description_de',
                     'meta_keywords_pl','meta_keywords_de',
                     'meta_copyright_pl','meta_copyright_de',
                     'slug','name',
                 ] as $k) {
            if ($this->has($k) && trim((string)$this->input($k)) === '') {
                $this->merge([$k => null]);
            }
        }

        // Jeśli przychodzą checkboxy – zrób z nich booleany tylko gdy są obecne
        foreach (['visible_pl','visible_de'] as $k) {
            if ($this->has($k)) {
                $this->merge([$k => $this->boolean($k)]);
            }
        }
    }

    public function rules(): array
    {
        return [
            // Aktualizujemy tylko pola, które przyszły:
            'name' => ['sometimes','required','string','max:120'],
            'slug' => ['sometimes','required','string','max:120'],

            'visible_pl' => ['sometimes','boolean'],
            'visible_de' => ['sometimes','boolean'],

            // META – nie wymagamy na update
            'meta_title_pl'       => ['sometimes','nullable','string','max:255'],
            'meta_title_de'       => ['sometimes','nullable','string','max:255'],
            'meta_description_pl' => ['sometimes','nullable','string','max:1000'],
            'meta_description_de' => ['sometimes','nullable','string','max:1000'],
            'meta_keywords_pl'    => ['sometimes','nullable','string','max:255'],
            'meta_keywords_de'    => ['sometimes','nullable','string','max:255'],
            'meta_copyright_pl'   => ['sometimes','nullable','string','max:255'],
            'meta_copyright_de'   => ['sometimes','nullable','string','max:255'],

            // Uploady też only-if-present
            'image_pl' => ['sometimes','file','mimes:jpg,jpeg,png,webp','max:2048'],
            'image_de' => ['sometimes','file','mimes:jpg,jpeg,png,webp','max:2048'],

            // pomocnicze
            'stay' => ['sometimes','boolean'],
        ];
    }
}
