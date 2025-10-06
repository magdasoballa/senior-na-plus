<?php
namespace App\Http\Resources;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class FormResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'content_pl' => $this->content_pl,
            'content_de' => $this->content_de,
            'visible_pl' => (bool)$this->visible_pl,
            'visible_de' => (bool)$this->visible_de,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
