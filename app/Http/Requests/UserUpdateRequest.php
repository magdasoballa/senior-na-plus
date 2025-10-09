<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
public function authorize(): bool { return true; }

public function rules(): array
{
$id = $this->route('user')?->id ?? $this->route('user');

return [
'name'     => ['required','string','max:255'],
'email'    => ['required','email','max:255', Rule::unique('users','email')->ignore($id)],
'password' => ['nullable','string','min:8'],
];
}
}
