<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SiteContactsSeeder extends Seeder
{
    public function run(): void
    {
        // DB::table('site_contacts')->truncate(); // ostrożnie: tylko na dev!

        $faker = \Faker\Factory::create('pl_PL');

        $rows = [];
        for ($i = 0; $i < 60; $i++) {
            $ts = Carbon::now()->subDays(rand(0, 90))->subMinutes(rand(0, 1440));
            $rows[] = [
                'name'        => $faker->name(), // = full_name
                'email'       => $faker->unique()->safeEmail(),
                'phone'       => $faker->numerify('###-###-###'),
                'subject'     => $faker->sentence(4),
                'message'     => $faker->paragraph(),
                'consents'    => json_encode(['rodo' => true]),
                'is_read'     => (bool)rand(0,1),
                'locale'      => 'pl',
                'created_at'  => $ts,
                'updated_at'  => $ts,
            ];
        }

        DB::table('site_contacts')->insert($rows);
    }
}
