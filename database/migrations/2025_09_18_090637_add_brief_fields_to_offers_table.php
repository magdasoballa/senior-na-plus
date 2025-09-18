<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('offers', function (Blueprint $table) {
            $table->enum('care_recipient_gender', ['female','male'])->nullable()->after('language');
            $table->enum('mobility', ['mobile','limited','immobile'])->nullable()->after('care_recipient_gender');
            $table->boolean('lives_alone')->nullable()->after('mobility');
        });
    }
    public function down(): void {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn(['care_recipient_gender','mobility','lives_alone']);
        });
    }
};

