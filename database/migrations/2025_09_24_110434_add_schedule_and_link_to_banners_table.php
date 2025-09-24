<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            // datetime-local -> DATETIME w DB (UTC po stronie kontrolera)
            if (!Schema::hasColumn('banners', 'starts_at')) {
                $table->dateTime('starts_at')->nullable()->after('position');
            }
            if (!Schema::hasColumn('banners', 'ends_at')) {
                $table->dateTime('ends_at')->nullable()->after('starts_at');
            }
            if (!Schema::hasColumn('banners', 'link')) {
                $table->string('link')->nullable()->after('ends_at');
            }
            if (!Schema::hasColumn('banners', 'scope')) {
                // prościej jako string; walidujemy w Request (home|offers|both)
                $table->string('scope', 16)->default('both')->after('link');
            }
        });
    }

    public function down(): void
    {
        Schema::table('banners', function (Blueprint $table) {
            if (Schema::hasColumn('banners', 'scope')) $table->dropColumn('scope');
            if (Schema::hasColumn('banners', 'link'))  $table->dropColumn('link');
            if (Schema::hasColumn('banners', 'ends_at')) $table->dropColumn('ends_at');
            if (Schema::hasColumn('banners', 'starts_at')) $table->dropColumn('starts_at');
        });
    }
};
