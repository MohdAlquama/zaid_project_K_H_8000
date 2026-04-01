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
        Schema::create('billing_lenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('billing_id')->constrained()->cascadeOnDelete();

            $table->string('lens_type');
            $table->decimal('price', 10, 2);

            // Right Eye
            $table->string('right_sph')->nullable();
            $table->string('right_axis')->nullable();
            $table->string('right_va')->nullable();

            // Left Eye
            $table->string('left_sph')->nullable();
            $table->string('left_axis')->nullable();
            $table->string('left_va')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billing_lenses');
    }
};
