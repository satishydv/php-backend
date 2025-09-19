<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/userguide3/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

/*
|--------------------------------------------------------------------------
| API Routes - Matching Next.js API endpoints exactly
|--------------------------------------------------------------------------
*/

// Auth routes
$route['api/auth/login'] = 'auth/login';
$route['api/auth/register'] = 'auth/register';
$route['api/auth/me'] = 'auth/me';

// Reviews routes
$route['api/reviews'] = 'reviews/index';
$route['api/reviews/create'] = 'reviews/create';

// Admin Reviews routes
$route['api/admin/reviews'] = 'admin_reviews/index';
$route['api/admin/reviews/update'] = 'admin_reviews/update_status';
$route['api/admin/reviews/delete'] = 'admin_reviews/delete';

// Gallery routes
$route['api/gallery-images'] = 'gallery/list';

// Admin Gallery routes
$route['api/admin/gallery'] = 'admin_gallery/index';
$route['api/admin/gallery/update'] = 'admin_gallery/update';
$route['api/admin/gallery/delete'] = 'admin_gallery/delete';
$route['api/admin/gallery/delete-image'] = 'admin_gallery/delete_image';
$route['api/admin/gallery/upload-image'] = 'admin_gallery_upload/upload_image';

// Hero routes
$route['api/hero-images'] = 'hero/list';

// Admin Hero routes
$route['api/admin/hero-slider'] = 'admin_hero/index';
$route['api/admin/hero-slider/update'] = 'admin_hero/update';
$route['api/admin/hero-slider/delete'] = 'admin_hero/delete';
$route['api/admin/hero-slider/delete-image'] = 'admin_hero/delete_image';
$route['api/admin/hero-slider/upload-image'] = 'admin_hero_upload/upload_image';
