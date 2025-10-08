<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DeSiteContact; // <-- model z $table = 'de_site_contacts'
use Faker\Factory as Faker;

class DeSiteContactsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('de_DE');

        $subjects = [
            'Anfrage zur Stelle', 'Bewerbung', 'Frage zum Vertrag',
            'Verfügbarkeit', 'Rückruf erbeten', 'Sonstiges'
        ];

        for ($i = 0; $i < 60; $i++) {
            $ts = now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));

            DeSiteContact::create([
                'name'       => $faker->name(),
                'email'      => $faker->unique()->safeEmail(),
                'phone'      => $faker->numerify('+49 ### ### ####'),
                'subject'    => $faker->randomElement($subjects),
                'is_read'    => (bool)rand(0,1),
                'created_at' => $ts,
                'updated_at' => $ts,
            ]);
        }
    }
}
