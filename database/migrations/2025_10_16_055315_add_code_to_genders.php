<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('genders', function (Blueprint $table) {
            $table->string('code', 64)->nullable()->after('id');
            $table->index('code');
        });

        // backfill
        $rows = DB::table('genders')->select('id','name_pl','name_de')->get();
        foreach ($rows as $r) {
            $base = Str::slug($r->name_pl ?: $r->name_de ?: 'gender_'.$r->id, '_') ?: 'gender_'.$r->id;
            $code = $base;
            $i = 2;
            while (DB::table('genders')->where('code', $code)->where('id','!=',$r->id)->exists()) {
                $code = "{$base}_{$i}";
                $i++;
            }
            DB::table('genders')->where('id',$r->id)->update(['code'=>$code]);
        }

        Schema::table('genders', function (Blueprint $table) {
            $table->string('code', 64)->nullable(false)->change();
            $table->unique('code');
        });
    }

    public function down(): void
    {
        Schema::table('genders', function (Blueprint $table) {
            if (Schema::hasColumn('genders','code')) {
                $table->dropUnique(['code']);
                $table->dropColumn('code');
            }
        });
    }
};
