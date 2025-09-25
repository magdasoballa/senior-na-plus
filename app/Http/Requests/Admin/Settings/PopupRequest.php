<?php
namespace App\Http\Requests\Admin\Settings;



use Illuminate\Foundation\Http\FormRequest;


class PopupRequest extends FormRequest
{
    public function authorize(): bool { return true; }


    public function rules(): array
    {
        return [
            'name' => ['required','string','max:255'],
            'link' => ['nullable','url','max:2048'],
            'image' => ['nullable','image','max:5120'], // 5 MB
            'is_visible' => ['sometimes','boolean'],
            'remove_image' => ['sometimes','boolean'],
        ];
    }
}
