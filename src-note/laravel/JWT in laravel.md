JWT Setup in Laravel
* JWT

* Install the tymon/jwt-auth package via Composer:
    + composer require tymon/jwt-auth

* Publish the package's configuration file:
    + php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
    + This will publish a config/jwt.php configuration file and create a JWT_SECRET key in your .env.

* Generate the JWT secret:
    + php artisan jwt:secret
    - This will generate a random key and set it in the .env file as JWT_SECRET.

* Set Up Authentication with JWT
    - Update the config/auth.php file to use jwt as the default guard for API authentication.
'guards' => [
    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],