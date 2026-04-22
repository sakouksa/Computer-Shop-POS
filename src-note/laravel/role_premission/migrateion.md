+ Table migration Users
public function up(): void
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('password');
        $table->timestamps();
});
}
+ Table migration Roles
public function up(): void
{
    Schema::create('roles', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->timestamps();
});
}
+ Table migration User Roles
public function up(): void
{
    Schema::create('user_roles', function (Blueprint $table) {
        // Define the foreign key columns for the pivot table
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('role_id');
        // Set the primary key for the pivot table
        $table->primary(['user_id', 'role_id']);
        // Set up the foreign key constraints
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
    });
}
+ Table migration Permission
public function up(): void
{
    Schema::create('permissions', function (Blueprint $table) {
        $table->id();
        $table->string('name')->unique();
        $table->string('group');
        $table->boolean('is_menu_web')->nullable();
        $table->string('web_route_key')->nullable();
        $table->timestamps();
    });
}

