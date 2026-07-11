<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->boolean('auto_delivery')->default(false);
            $table->unsignedTinyInteger('delivery_days')->default(1);
        });
    }

    public function down(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->dropColumn(['auto_delivery', 'delivery_days']);
        });
    }
};
