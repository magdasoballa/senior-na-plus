<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void {
Schema::create('de_forms', function (Blueprint $table) {
$table->id();
$table->string('full_name');
$table->string('zip')->nullable();
$table->string('city')->nullable();
$table->string('phone')->nullable();
$table->boolean('is_read')->default(false)->index();
$table->timestamps(); // created_at do listy
});
}

public function down(): void {
Schema::dropIfExists('de_forms');
}
};
