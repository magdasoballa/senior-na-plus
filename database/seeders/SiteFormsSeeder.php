<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FormSubmission; // $table = 'site_forms'
use Faker\Factory as Faker;

class SiteFormsSeeder extends Seeder
{
    public function run(): void
    {
        // ile rekordów na język
        $this->seedLocale('pl', 60);
        $this->seedLocale('de', 40);
    }

    private function seedLocale(string $locale, int $count): void
    {
        $faker = Faker::create($locale === 'pl' ? 'pl_PL' : 'de_DE');

        $levels = ['Brak języka','Podstawowa','Komunikatywna','Bardzo dobra'];
        $exper  = ['brak','do 1 roku','od 1 do 3 lat','powyżej 3 lat'];
        $skillsPool = ['prawo jazdy','porządki domowe','gotowanie','zakupy','pielęgnacja','asysta medyczna'];

        for ($i = 0; $i < $count; $i++) {
            $ts = now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));

            FormSubmission::create([
                'full_name'            => $faker->name(),
                'email'                => $faker->unique()->safeEmail(),
                'phone'                => $faker->numerify('###-###-###'),
                'language_level'       => $faker->randomElement($levels),
                'profession_trained'   => $faker->optional()->jobTitle(),
                'profession_performed' => $faker->optional()->jobTitle(),
                'experience'           => $faker->randomElement($exper),
                'skills'               => $faker->randomElements($skillsPool, rand(1, 4)),
                'salary'               => (string)rand(1800, 2800),
                'references'           => $faker->optional()->sentence(),
                'consents'             => ['rodo' => true],
                'is_read'              => (bool)rand(0, 1),
                'locale'               => $locale,
                'created_at'           => $ts,
                'updated_at'           => $ts,
            ]);
        }
    }
}
