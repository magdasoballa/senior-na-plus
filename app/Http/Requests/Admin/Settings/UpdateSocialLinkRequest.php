<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSocialLinkRequest extends FormRequest
{
    public function authorize(): bool { return (bool) ($this->user()->is_admin ?? false); }

    public function rules(): array
    {
        return [
            'name'       => ['required','string','max:190'],
            'url'        => ['required','url','max:255'],
            'icon'       => ['nullable','string','max:190'],
            'icon_file'  => ['nullable','file','mimes:svg,png,jpg,jpeg,webp','max:2048'],
            'keep_icon_file'   => ['sometimes','boolean'],
            'remove_icon_file' => ['sometimes','boolean'],
            'visible_pl' => ['sometimes','boolean'],
            'visible_de' => ['sometimes','boolean'],
        ];
    }
}
