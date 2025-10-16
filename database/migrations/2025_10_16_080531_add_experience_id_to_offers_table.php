<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->foreignId('experience_id')
                ->nullable()
                ->constrained('experiences')
                ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropForeign(['experience_id']);
            $table->dropColumn('experience_id');
        });
    }
};
