<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('offers', function (Blueprint $table) {
            // Dodaj wszystkie brakujące kolumny
            if (!Schema::hasColumn('offers', 'experience_id')) {
                $table->foreignId('experience_id')
                    ->nullable()
                    ->constrained('experiences')
                    ->onDelete('set null');
            }

            if (!Schema::hasColumn('offers', 'experiences')) {
                $table->string('experiences', 255)->nullable();
            }

            if (!Schema::hasColumn('offers', 'care_target')) {
                $table->string('care_target', 255)->nullable();
            }

            if (!Schema::hasColumn('offers', 'care_recipient_gender')) {
                $table->string('care_recipient_gender', 50)->nullable();
            }

            if (!Schema::hasColumn('offers', 'mobility')) {
                $table->string('mobility', 50)->nullable();
            }

            if (!Schema::hasColumn('offers', 'lives_alone')) {
                $table->boolean('lives_alone')->default(false);
            }
        });
    }

    public function down()
    {
        Schema::table('offers', function (Blueprint $table) {
            // Usuń tylko te kolumny które dodaliśmy
            $columnsToDrop = ['experience_id', 'experiences', 'care_target', 'care_recipient_gender', 'mobility', 'lives_alone'];

            foreach ($columnsToDrop as $column) {
                if (Schema::hasColumn('offers', $column)) {
                    if ($column === 'experience_id') {
                        $table->dropForeign(['experience_id']);
                    }
                    $table->dropColumn($column);
                }
            }
        });
    }
};
