<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerRequest extends FormRequest
{
public function authorize(): bool { return true; }

public function rules(): array
{
return [
'link'       => ['required','string','max:255','url'],
'is_visible' => ['sometimes','boolean'],
'image'      => ['nullable','image','mimes:jpg,jpeg,png,webp','max:2048'],
];
}
}
