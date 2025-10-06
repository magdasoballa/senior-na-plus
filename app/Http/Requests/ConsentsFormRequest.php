<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;


class ConsentsFormRequest extends FormRequest
{
    public function authorize(): bool { return true; }
    public function rules(): array {
        return [
            'name' => ['required','string','max:255'],
            'content_pl' => ['required','string','max:10000'],
            'content_de' => ['nullable','string','max:10000'],
            'visible_pl' => ['sometimes','boolean'],
            'visible_de' => ['sometimes','boolean'],
        ];
    }
}
