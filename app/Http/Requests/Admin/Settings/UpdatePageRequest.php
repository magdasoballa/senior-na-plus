<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) ($this->user()->is_admin ?? false);
    }

    public function rules(): array
    {
        $pageId = $this->route('page')->id ?? null;

        return [
            'name'  => ['required','string','max:190'],
            'slug'  => ['required','string','max:190', Rule::unique('pages','slug')->ignore($pageId)],

            // META – PL wymagane, DE opcjonalne
            'meta_title_pl'        => ['required','string','max:255'],
            'meta_title_de'        => ['nullable','string','max:255'],
            'meta_description_pl'  => ['required','string'],
            'meta_description_de'  => ['nullable','string'],
            'meta_keywords_pl'     => ['required','string','max:255'],
            'meta_keywords_de'     => ['nullable','string','max:255'],
            'meta_copyright_pl'    => ['required','string','max:255'],
            'meta_copyright_de'    => ['nullable','string','max:255'],

            // checkboxy + pliki
            'visible_pl' => ['sometimes','boolean'],
            'visible_de' => ['sometimes','boolean'],
            'image_pl'   => ['nullable','image','max:2048'],
            'image_de'   => ['nullable','image','max:2048'],
        ];
    }
}
