<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void
{
if (!Schema::hasTable('site_forms')) {
Schema::create('site_forms', function (Blueprint $table) {
$table->id();
$table->string('full_name');
$table->string('email');
$table->string('phone')->nullable();
$table->string('language_level')->nullable();
$table->string('profession_trained')->nullable();
$table->string('profession_performed')->nullable();
$table->string('experience')->nullable();
$table->json('skills')->nullable();
$table->string('salary')->nullable();
$table->text('references')->nullable();
$table->json('consents')->nullable();
$table->boolean('is_read')->default(false);
$table->string('locale', 2)->default('pl');
$table->timestamps();
});
}
}

public function down(): void
{
Schema::dropIfExists('site_forms');
}
};
