<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_controls', function (Blueprint $table) {
            $table->id();
            $table->string('business_name')->nullable();
            $table->string('mobile_number')->nullable();
            $table->text('address')->nullable();
            $table->string('logo_path')->nullable(); 
            
            // Checkboxes (Boolean)
            $table->boolean('customer_copy')->default(false);
            $table->boolean('shop_copy')->default(false);
            $table->boolean('order_no')->default(false);
            $table->boolean('show_logo')->default(false);
            
            // Vertical Line Settings
            $table->boolean('vertical_line_show')->default(false);
            $table->string('line_type')->default('customizable');
            $table->string('custom_line_width')->nullable();
            $table->string('custom_line_type')->nullable(); 

            // Header divider line settings
            $table->boolean('header_line_show')->nullable()->default(1);
            $table->unsignedInteger('header_line_width')->nullable()->default(2);
            $table->unsignedInteger('header_line_spacing')->nullable()->default(8); 
            $table->unsignedInteger('header_line_spacing_top')->nullable();
            $table->unsignedInteger('header_line_spacing_bottom')->nullable();
            
            // Add this inside the Schema::create block
            $table->text('terms_and_conditions')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_controls');
    }
};