<?php

namespace App\Http\Requests\Admin\Dictionaries;

use Illuminate\Foundation\Http\FormRequest;

class RecruitmentRequirementRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['required','string','max:255'],
            'body'        => ['required','string'],
            'image'       => ['nullable','image','max:5120'],
            'is_visible'  => ['sometimes','boolean'],
            'remove_image'=> ['sometimes','boolean'],
            'redirectTo'  => ['nullable','in:index,continue'],
        ];
    }

    public function attributes(): array
    {
        return ['title' => 'tytuł', 'body' => 'opis'];
    }
}
