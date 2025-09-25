<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void {
Schema::table('portal_settings', function (Blueprint $table) {
if (!Schema::hasColumn('portal_settings','phone_pl'))   $table->string('phone_pl')->nullable()->after('phone');
if (!Schema::hasColumn('portal_settings','phone_de'))   $table->string('phone_de')->nullable()->after('phone_pl');
if (!Schema::hasColumn('portal_settings','address_pl')) $table->string('address_pl')->nullable()->after('address');
if (!Schema::hasColumn('portal_settings','address_de')) $table->string('address_de')->nullable()->after('address_pl');
if (!Schema::hasColumn('portal_settings','email_pl'))   $table->string('email_pl')->nullable()->after('email');
if (!Schema::hasColumn('portal_settings','email_de'))   $table->string('email_de')->nullable()->after('email_pl');
});
}
public function down(): void {
Schema::table('portal_settings', function (Blueprint $table) {
$table->dropColumn(['phone_pl','phone_de','address_pl','address_de','email_pl','email_de']);
});
}
};
