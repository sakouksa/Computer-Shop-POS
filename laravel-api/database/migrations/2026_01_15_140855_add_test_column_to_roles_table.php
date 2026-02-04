<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Run the migrations.
    public function up(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->string('test')->nullable()->after('status'); // Add 'price' column after 'status' column
        });
    }

    // Reverse the migrations.
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            // សម្រាប់លុប column វិញពេលយើង rollback
            $table->dropColumn('test'); // Remove 'price' column
        });
    }
};
