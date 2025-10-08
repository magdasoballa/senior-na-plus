<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DeForm;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Schema;

class DeFormsSeeder extends Seeder
{
    public function run(): void
    {
        $faker  = Faker::create('de_DE');

        $levels = ['Kein Deutsch','Grundlegend','Kommunikativ','Sehr gut'];
        $exper  = ['kein','1–2 Jahre','3–5 Jahre','über 5 Jahre'];
        $skills = ['Führerschein','Hausarbeit','Kochen','Einkaufen','Pflege','Medizinische Assistenz'];

        // Aktualna lista kolumn w tabeli (co naprawdę istnieje)
        $cols = array_flip(Schema::getColumnListing('de_forms'));

        for ($i = 0; $i < 40; $i++) {
            $ts = now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));

            // Pełny zestaw możliwych pól
            $payload = [
                'full_name'            => $faker->name(),
                'email'                => $faker->unique()->safeEmail(),       // zostanie odrzucone, jeśli kolumny brak
                'phone'                => $faker->numerify('0151 #### ####'),
                'language_level'       => $faker->randomElement($levels),      // j.w.
                'zip_code'             => $faker->postcode(),
                'city'                 => $faker->city(),

                'profession_trained'   => $faker->optional()->jobTitle(),
                'profession_performed' => $faker->optional()->jobTitle(),
                'experience'           => $faker->randomElement($exper),
                'skills'               => $faker->randomElements($skills, rand(1, 4)),

                'salary'               => (string) rand(2000, 3000),
                'references'           => $faker->optional()->sentence(),
                'consents'             => ['rodo' => true, 'marketing' => (bool) rand(0,1)],
                'is_read'              => (bool) rand(0,1),

                'created_at'           => $ts,
                'updated_at'           => $ts,
            ];

            // Zostaw tylko klucze, które faktycznie są kolumnami w de_forms
            $payload = array_intersect_key($payload, $cols);

            DeForm::create($payload);
        }
    }
}
