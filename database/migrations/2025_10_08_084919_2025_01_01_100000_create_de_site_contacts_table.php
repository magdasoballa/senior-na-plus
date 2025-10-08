<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void {
Schema::create('de_site_contacts', function (Blueprint $table) {
$table->id();
$table->string('name');                 // w widokach DE używasz "name"
$table->string('email');
$table->string('phone')->nullable();
$table->string('subject')->nullable();
$table->boolean('is_read')->default(false)->index();
$table->timestamps(); // created_at używasz jako "Data wysłania"
});
}

public function down(): void {
Schema::dropIfExists('de_site_contacts');
}
};
