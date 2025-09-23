<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::table('social_links', function (Blueprint $t) {
            $t->string('icon_file')->nullable()->after('icon');
        });
    }
    public function down(): void {
        Schema::table('social_links', function (Blueprint $t) {
            $t->dropColumn('icon_file');
        });
    }
};
