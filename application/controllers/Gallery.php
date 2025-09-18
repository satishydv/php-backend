<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Gallery extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Gallery_image_model');
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
     * GET /api/gallery-images - Get active gallery images for public display
     */
    public function list() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        try {
            $images = $this->Gallery_image_model->get_active();
            
            // Add URL field to each image and convert boolean fields
            $images_with_url = array_map(function($image) {
                return [
                    ...$image,
                    'url' => "/Gallery/{$image['filename']}",
                    'alt' => $image['alt_text'] ?: $image['name'] ?: 'Gallery image',
                    'is_active' => (bool)$image['is_active']
                ];
            }, $images);
            
            $this->output->set_status_header(200)->set_output(json_encode($images_with_url));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch gallery images']));
        }
    }
}
