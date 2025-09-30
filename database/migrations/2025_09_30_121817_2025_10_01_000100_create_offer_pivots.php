<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // offers × duties
        if (!Schema::hasTable('offer_duty')) {
            Schema::create('offer_duty', function (Blueprint $t) {
                $t->unsignedBigInteger('offer_id');
                $t->unsignedBigInteger('duty_id');
                $t->primary(['offer_id','duty_id']);
                $t->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
                $t->foreign('duty_id')->references('id')->on('duties')->onDelete('cascade');
            });
        }

        // offers × offer_requirements
        if (!Schema::hasTable('offer_requirement')) {
            Schema::create('offer_requirement', function (Blueprint $t) {
                $t->unsignedBigInteger('offer_id');
                $t->unsignedBigInteger('offer_requirement_id');
                $t->primary(['offer_id','offer_requirement_id'], 'offer_requirement_pk');
                $t->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
                $t->foreign('offer_requirement_id')->references('id')->on('offer_requirements')->onDelete('cascade');
            });
        }

        // offers × offer_perks  (to właśnie „Oferujemy”)
        if (!Schema::hasTable('offer_perk')) {
            Schema::create('offer_perk', function (Blueprint $t) {
                $t->unsignedBigInteger('offer_id');
                $t->unsignedBigInteger('offer_perk_id');
                $t->primary(['offer_id','offer_perk_id'], 'offer_perk_pk');
                $t->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
                $t->foreign('offer_perk_id')->references('id')->on('offer_perks')->onDelete('cascade');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('offer_perk');
        Schema::dropIfExists('offer_requirement');
        Schema::dropIfExists('offer_duty');
    }
};
