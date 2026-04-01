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
            $table->unsignedInteger('linked_to_index')->nullable()->after('is_linked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('billing_lenses', function (Blueprint $table) {
            $table->dropColumn('linked_to_index');
        });
    }
};
