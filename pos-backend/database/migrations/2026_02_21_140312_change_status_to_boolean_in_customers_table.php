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
        // ១. ឆែកមើលថាមាន Column status ឬអត់ បើមានត្រូវលុបវាចោលសិន
        if (Schema::hasColumn('customers', 'status')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }

        // ២. បង្កើត Column status ថ្មីជាប្រភេទ boolean
        Schema::table('customers', function (Blueprint $table) {
            $table->boolean('status')->default(1)->after('address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('status')->nullable()->after('address');
        });
    }
};