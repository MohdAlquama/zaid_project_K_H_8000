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
        Schema::create('billings', function (Blueprint $table) {
            $table->id();

            $table->string('customer_name');
            $table->string('mobile_number', 15)->default("n/a");

            $table->string('order_number')->unique();

            $table->date('order_date')->nullable();
            $table->date('delivery_date')->nullable();

            $table->decimal('frame_total', 10, 2)->default(0);
            $table->decimal('lens_total', 10, 2)->default(0);
            $table->decimal('net_total', 10, 2)->default(0);
            $table->decimal('advance_paid', 10, 2)->default(0);
            $table->decimal('balance', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
