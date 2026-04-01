<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('billing_lenses', function (Blueprint $table) {
            $table->string('right_cyl')->nullable()->after('right_sph');
            $table->string('left_cyl')->nullable()->after('left_sph');
            $table->boolean('is_linked')->default(false)->after('left_va');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('billing_lenses', function (Blueprint $table) {
            $table->dropColumn(['right_cyl', 'left_cyl', 'is_linked']);
        });
    }
};
