<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->boolean('admin_check')->default(false);
            $table->boolean('staff_check')->default(false);
            $table->string('phone', 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('invoice_controls', function (Blueprint $table) {
            $table->dropColumn(['admin_check', 'staff_check', 'phone']);
        });
    }
};
