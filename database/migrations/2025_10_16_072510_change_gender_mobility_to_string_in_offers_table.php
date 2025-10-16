<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeGenderMobilityToStringInOffersTable extends Migration
{
    public function up()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->string('care_recipient_gender', 50)->nullable()->change();
            $table->string('mobility', 50)->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->enum('care_recipient_gender', ['female', 'male'])->nullable()->change();
            $table->enum('mobility', ['mobile', 'limited', 'immobile'])->nullable()->change();
        });
    }
}
