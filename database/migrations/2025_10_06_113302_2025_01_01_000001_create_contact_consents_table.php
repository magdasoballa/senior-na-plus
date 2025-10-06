<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('contact_consents', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->text('content_pl');
            $t->text('content_de')->nullable();
            $t->boolean('visible_pl')->default(true);
            $t->boolean('visible_de')->default(true);
            $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('contact_consents');
    }
};
