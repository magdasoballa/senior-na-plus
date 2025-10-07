<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('site_contacts')) {
            Schema::create('site_contacts', function (Blueprint $table) {
                $table->id();
                $table->string('full_name');
                $table->string('email');
                $table->string('phone')->nullable();
                $table->string('subject')->nullable();       // temat
                $table->text('message')->nullable();          // treść wiadomości
                $table->json('consents')->nullable();
                $table->boolean('is_read')->default(false);
                $table->string('locale', 2)->default('pl');   // 'pl' / 'de'
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contacts');
    }
};
