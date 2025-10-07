<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SiteContact;
use Faker\Factory as Faker;

class DeSiteContactsSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedLocale('de', 60); // ile rekordów w DE
    }

    private function seedLocale(string $locale, int $count): void
    {
        $faker = Faker::create($locale === 'de' ? 'de_DE' : 'pl_PL');

        $subjects = [
            'Anfrage zur Stelle', 'Bewerbung', 'Frage zum Vertrag',
            'Verfügbarkeit', 'Rückruf erbeten', 'Sonstiges'
        ];

        for ($i = 0; $i < $count; $i++) {
            $ts = now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));

            SiteContact::create([
                'name'      => $faker->name(),
                'email'     => $faker->unique()->safeEmail(),
                'phone'     => $faker->numerify('+49 ### ### ####'), // ← ZAWSZE wartość
                'subject'   => $faker->randomElement($subjects),
                'message'   => $faker->optional()->paragraphs(rand(1, 3), true),
                'consents'  => ['rodo' => true, 'marketing' => (bool)rand(0,1)],
                'is_read'   => (bool)rand(0,1),
                'locale'    => $locale,
                'created_at'=> $ts,
                'updated_at'=> $ts,
            ]);
        }
    }
}
