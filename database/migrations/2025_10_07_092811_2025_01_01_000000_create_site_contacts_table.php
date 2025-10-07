<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('site_contacts', function (Blueprint $table) {
            $table->id();

            // podstawowe dane z formularza „Kontakt Strona”
            $table->string('name');           // pełne imię i nazwisko
            $table->string('email');
            $table->string('phone');
            $table->string('subject');        // temat
            $table->text('message');          // treść wiadomości

            // metadane
            $table->json('consents')->nullable(); // np. {rodo:true, marketing:false}
            $table->boolean('is_read')->default(false);
            $table->string('locale', 5)->default('pl'); // na przyszłość (PL/DE)

            $table->timestampsTz();

            // indeksy przydatne do list/sortowania
            $table->index(['created_at']);
            $table->index(['is_read']);
            $table->index(['email']);
            $table->index(['locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contacts');
    }
};
