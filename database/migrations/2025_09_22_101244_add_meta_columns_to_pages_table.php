<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
public function up(): void
{
Schema::table('pages', function (Blueprint $t) {
$t->string('meta_title_pl')->nullable();
$t->string('meta_title_de')->nullable();
$t->text('meta_description_pl')->nullable();
$t->text('meta_description_de')->nullable();
$t->string('meta_keywords_pl')->nullable();
$t->string('meta_keywords_de')->nullable();
$t->string('meta_copyright_pl')->nullable();
$t->string('meta_copyright_de')->nullable();
});
}

public function down(): void
{
Schema::table('pages', function (Blueprint $t) {
$t->dropColumn([
'meta_title_pl','meta_title_de',
'meta_description_pl','meta_description_de',
'meta_keywords_pl','meta_keywords_de',
'meta_copyright_pl','meta_copyright_de',
]);
});
}
};
