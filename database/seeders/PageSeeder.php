<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        // proste 1x1 px PNG jako placeholder obrazka
        $pixel = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAukB9d8E7ckAAAAASUVORK5CYII='
        );

        if (!Storage::disk('public')->exists('pages')) {
            Storage::disk('public')->makeDirectory('pages');
        }

        $plImg = 'pages/pl.png';
        $deImg = 'pages/de.png';
        Storage::disk('public')->put($plImg, $pixel);
        Storage::disk('public')->put($deImg, $pixel);

        $now = now();

        // 7 stron jak na screenie
        $rows = [
            [
                'id' => 1,
                'name' => 'Strona główna',
                'slug' => '/',
                'image_pl' => $plImg,
                'image_de' => null,
                'visible_pl' => 0,
                'visible_de' => 0,
                'position' => 1,
                'meta_title_pl' => 'Tytuł Strona główna',
                'meta_description_pl' => 'Meta Opis Strona główna',
                'meta_keywords_pl' => 'Meta Słowa kluczowe Strona główna',
                'meta_copyright_pl' => 'Meta copyright Strona główna',
                'meta_title_de' => null,
                'meta_description_de' => null,
                'meta_keywords_de' => null,
                'meta_copyright_de' => null,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'O nas',
                'slug' => '/o-nas',
                'image_pl' => $plImg,
                'image_de' => $deImg,
                'visible_pl' => 1,
                'visible_de' => 1,
                'position' => 2,
                'meta_title_pl' => 'Tytuł O nas',
                'meta_description_pl' => 'Meta Opis O nas',
                'meta_keywords_pl' => 'Słowa kluczowe O nas',
                'meta_copyright_pl' => 'Copyright O nas',
                'meta_title_de' => 'Titel Über uns',
                'meta_description_de' => 'Meta Beschreibung Über uns',
                'meta_keywords_de' => 'Schlüsselwörter Über uns',
                'meta_copyright_de' => 'Copyright Über uns',
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Oferty pracy',
                'slug' => '/oferty-pracy',
                'image_pl' => $plImg,
                'image_de' => null,
                'visible_pl' => 1,
                'visible_de' => 0,
                'position' => 3,
                'meta_title_pl' => 'Tytuł Oferty pracy',
                'meta_description_pl' => 'Meta Opis Oferty pracy',
                'meta_keywords_pl' => 'Słowa kluczowe Oferty pracy',
                'meta_copyright_pl' => 'Copyright Oferty pracy',
                'meta_title_de' => null,
                'meta_description_de' => null,
                'meta_keywords_de' => null,
                'meta_copyright_de' => null,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 4,
                'name' => 'Formularz',
                'slug' => '/formularz',
                'image_pl' => $plImg,
                'image_de' => $deImg,
                'visible_pl' => 1,
                'visible_de' => 1,
                'position' => 4,
                'meta_title_pl' => 'Tytuł Formularz',
                'meta_description_pl' => 'Meta Opis Formularz',
                'meta_keywords_pl' => 'Słowa kluczowe Formularz',
                'meta_copyright_pl' => 'Copyright Formularz',
                'meta_title_de' => 'Titel Formular',
                'meta_description_de' => 'Meta Beschreibung Formular',
                'meta_keywords_de' => 'Schlüsselwörter Formular',
                'meta_copyright_de' => 'Copyright Formular',
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 5,
                'name' => 'Kontakt',
                'slug' => '/kontakt',
                'image_pl' => $plImg,
                'image_de' => null, // obraz DE może być, ale nie musi
                'visible_pl' => 1,
                'visible_de' => 1,
                'position' => 5,
                'meta_title_pl' => 'Tytuł Kontakt',
                'meta_description_pl' => 'Meta Opis Kontakt',
                'meta_keywords_pl' => 'Słowa kluczowe Kontakt',
                'meta_copyright_pl' => 'Copyright Kontakt',
                'meta_title_de' => 'Titel Kontakt',
                'meta_description_de' => 'Meta Beschreibung Kontakt',
                'meta_keywords_de' => 'Schlüsselwörter Kontakt',
                'meta_copyright_de' => 'Copyright Kontakt',
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 6,
                'name' => 'Polityka prywatności',
                'slug' => '/polityka-prywatnosci',
                'image_pl' => $plImg,
                'image_de' => null,
                'visible_pl' => 0,
                'visible_de' => 0,
                'position' => 6,
                'meta_title_pl' => 'Tytuł Polityka prywatności',
                'meta_description_pl' => 'Meta Opis Polityka prywatności',
                'meta_keywords_pl' => 'Słowa kluczowe Polityka prywatności',
                'meta_copyright_pl' => 'Copyright Polityka prywatności',
                'meta_title_de' => null,
                'meta_description_de' => null,
                'meta_keywords_de' => null,
                'meta_copyright_de' => null,
                'created_at' => $now, 'updated_at' => $now,
            ],
            [
                'id' => 7,
                'name' => 'Pojedyńcza oferta',
                'slug' => '/oferta',
                'image_pl' => $plImg,
                'image_de' => $deImg,
                'visible_pl' => 0,
                'visible_de' => 0,
                'position' => 7,
                'meta_title_pl' => 'Tytuł Pojedyńcza oferta',
                'meta_description_pl' => 'Meta Opis Pojedyńcza oferta',
                'meta_keywords_pl' => 'Słowa kluczowe Pojedyńcza oferta',
                'meta_copyright_pl' => 'Copyright Pojedyńcza oferta',
                'meta_title_de' => 'Titel Einzelnes Angebot',
                'meta_description_de' => 'Meta Beschreibung Einzelnes Angebot',
                'meta_keywords_de' => 'Schlüsselwörter Einzelnes Angebot',
                'meta_copyright_de' => 'Copyright Einzelnes Angebot',
                'created_at' => $now, 'updated_at' => $now,
            ],
        ];

        // wstaw/aktualizuj po id (nie czyści tabeli)
        DB::table('pages')->upsert($rows, ['id'], array_keys($rows[0]));
    }
}
