<?php
defined('BASEPATH') OR exit('No direct script access allowed');



// Database Configuration
$config['db_hostname'] = 'localhost';
$config['db_username'] = 'root';
$config['db_password'] = '';
$config['db_database'] = 'gharwa_auth';
$config['db_port'] = 3306;

// JWT Configuration
$config['jwt_secret'] = '35ce5a33fbbefea240139f7ca8e9eb92f9c9794df7942a8cea5a6275c01837ee';
$config['jwt_expiration_hours'] = 24;

// CORS Configuration
$config['cors_origin'] = 'http://localhost:3000';
$config['cors_methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
$config['cors_headers'] = 'Content-Type, Authorization';

// File Upload Configuration
$config['upload_max_size'] = 10 * 1024 * 1024; // 10MB
$config['upload_allowed_types'] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Application URLs
$config['base_url'] = 'http://localhost/gharwa-backend/';
$config['frontend_url'] = 'http://localhost:3000';
