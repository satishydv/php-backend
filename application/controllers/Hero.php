<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Hero extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Hero_image_model');
        $this->setup_cors();
    }
    
    private function setup_cors() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit();
        }
    }
    
    /**
     * GET /api/hero-images - Get active hero images for public display
     */
    public function list() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        try {
            $images = $this->Hero_image_model->get_active();
            
            // Add URL field to each image and convert boolean fields
            $images_with_url = array_map(function($image) {
                return [
                    ...$image,
                    'url' => "/Hero/{$image['filename']}",
                    'alt' => $image['alt_text'] ?: $image['name'] ?: 'Hero image',
                    'is_active' => (bool)$image['is_active']
                ];
            }, $images);
            
            $this->output->set_status_header(200)->set_output(json_encode($images_with_url));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch hero images']));
        }
    }
}
