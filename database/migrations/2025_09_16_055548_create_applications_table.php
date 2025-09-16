<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();

            // Podstawowe informacje
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('language_level');

            // Dodatkowe informacje
            $table->string('additional_language')->nullable();
            $table->string('learned_profession')->nullable();
            $table->string('current_profession')->nullable();

            // Doświadczenie zawodowe
            $table->enum('experience', ['brak', 'od 1 roku', 'od 1 do 3 lat', 'powyżej 3 lat']);
            $table->boolean('first_aid_course')->default(false);
            $table->boolean('medical_caregiver_course')->default(false);
            $table->boolean('care_experience')->default(false);
            $table->boolean('housekeeping_experience')->default(false);
            $table->boolean('cooking_experience')->default(false);
            $table->boolean('driving_license')->default(false);
            $table->boolean('smoker')->default(false);

            // Oczekiwania finansowe
            $table->string('salary_expectations')->nullable();

            // Referencje
            $table->string('references_path')->nullable();

            // Zgody
            $table->boolean('consent1')->default(false);
            $table->boolean('consent2')->default(false);
            $table->boolean('consent3')->default(false);

            // Powiązanie z ofertą
            $table->foreignId('offer_id')->constrained()->onDelete('cascade');
            $table->string('offer_title');

            // Status aplikacji
            $table->enum('status', ['new', 'reviewed', 'accepted', 'rejected'])->default('new');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('applications');
    }
};
