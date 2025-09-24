<?php

namespace App\Http\Requests\Admin\Settings;

use Illuminate\Foundation\Http\FormRequest;

class BannerUpdateRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'name'      => ['required','string','max:255'],
            'image'     => ['nullable','image','max:4096'],
            'visible'   => ['sometimes','boolean'],

            'starts_at' => ['nullable','date'],
            'ends_at'   => ['nullable','date','after_or_equal:starts_at'],
            'link'      => ['nullable','url'],
            'scope'     => ['nullable','in:home,offers,both'],
        ];
    }
}
