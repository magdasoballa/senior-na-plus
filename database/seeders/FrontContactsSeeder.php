<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FrontContactsSeeder extends Seeder
{
    public function run(): void
    {
        // DB::table('front_contacts')->truncate(); // ostrożnie: tylko na dev!

        $faker  = \Faker\Factory::create('pl_PL');
        $levels = ['Brak języka','Podstawowa','Komunikatywna','Bardzo dobra'];

        $rows = [];
        for ($i = 0; $i < 60; $i++) {
            $ts = Carbon::now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));
            $rows[] = [
                'full_name'      => $faker->name(),
                'email'          => $faker->unique()->safeEmail(),
                'phone'          => $faker->numerify('###-###-###'),
                'language_level' => $levels[array_rand($levels)],
                'consents'       => json_encode(['rodo' => true, 'marketing' => (bool)rand(0,1)]), // kolumna JSON
                'is_read'        => (bool)rand(0,1),
                'created_at'     => $ts,
                'updated_at'     => $ts,
            ];
        }

        // jeden zbiorczy insert (szybciej)
        DB::table('front_contacts')->insert($rows);
    }
}
