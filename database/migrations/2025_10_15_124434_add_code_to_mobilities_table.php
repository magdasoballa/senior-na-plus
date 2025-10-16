<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('mobilities', function (Blueprint $table) {
            $table->string('code', 50)->nullable()->after('id');
        });

        // Ustaw kody dla istniejących rekordów
        DB::table('mobilities')->where('id', 1)->update(['code' => 'mobile']);
        DB::table('mobilities')->where('id', 3)->update(['code' => 'immobile']);

        // Dodaj brakujące rekordy
        DB::table('mobilities')->insert([
            [
                'code' => 'limited',
                'name_pl' => 'ograniczona mobilność',
                'name_de' => 'Eingeschränkte Mobilität',
                'is_visible_pl' => true,
                'is_visible_de' => true,
                'position' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'other',
                'name_pl' => 'inna',
                'name_de' => 'Andere',
                'is_visible_pl' => true,
                'is_visible_de' => true,
                'position' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down()
    {
        // Usuń dodane rekordy
        DB::table('mobilities')->whereIn('code', ['limited', 'other'])->delete();

        Schema::table('mobilities', function (Blueprint $table) {
            $table->dropColumn('code');
        });
    }
};
