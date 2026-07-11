<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->string('total_display_type')->default('net_total');
        });
    }

    public function down(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->dropColumn('total_display_type');
        });
    }
};
