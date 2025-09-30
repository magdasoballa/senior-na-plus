<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        if (!Schema::hasTable('offer_perks')) {
            Schema::create('offer_perks', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->boolean('is_visible')->default(true);
                $table->unsignedInteger('position')->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void {
        Schema::dropIfExists('offer_perks');
    }
};
