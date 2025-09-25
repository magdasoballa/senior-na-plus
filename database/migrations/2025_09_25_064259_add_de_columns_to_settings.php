<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('portal_settings', function (Blueprint $table) {
            $table->string('phone_pl')->nullable();
            $table->string('phone_de')->nullable();
            $table->string('address_pl')->nullable();
            $table->string('address_de')->nullable();
            $table->string('email_pl')->nullable();
            $table->string('email_de')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('portal_settings', function (Blueprint $table) {
            $table->dropColumn(['phone_pl', 'phone_de', 'address_pl', 'address_de', 'email_pl', 'email_de']);
        });
    }
};
