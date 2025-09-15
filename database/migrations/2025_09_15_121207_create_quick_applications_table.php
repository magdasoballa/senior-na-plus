<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void {
Schema::create('quick_applications', function (Blueprint $table) {
$table->id();
$table->string('name');
$table->string('email');
$table->string('phone')->nullable();
$table->boolean('consent1')->default(false);
$table->boolean('consent2')->default(false);
$table->boolean('consent3')->default(false);
$table->string('offer_id')->nullable();
$table->string('offer_title')->nullable();
// meta
$table->string('url')->nullable();
$table->string('ip')->nullable();
$table->text('user_agent')->nullable();
$table->timestamps();
});
}
public function down(): void {
Schema::dropIfExists('quick_applications');
}
};
