<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('link');
            $table->string('image_path')->nullable();
            $table->boolean('is_visible')->default(true)->index();
            $table->unsignedInteger('position')->default(0)->index();
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
