<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FrontContactsSeeder::class,
            SiteContactsSeeder::class,
            SiteFormsSeeder::class,

        ]);
    }
}
