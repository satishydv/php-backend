<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_hero_upload extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Hero_image_model');
        $this->load->library('Jwt_helper');
        $this->load->config('env');
        $this->setup_cors();
    }
    
    private function setup_cors() {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: ' . $this->config->item('frontend_url'));
        header('Access-Control-Allow-Methods: ' . $this->config->item('cors_methods'));
        header('Access-Control-Allow-Headers: ' . $this->config->item('cors_headers'));
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit();
        }
    }
    
    /**
     * Verify admin authentication
     */
    private function verify_admin_auth() {
        $token = $this->jwt_helper->get_token_from_header();
        
        if (!$token) {
            return ['error' => 'Unauthorized access', 'status' => 401];
        }
        
        $payload = $this->jwt_helper->verify_token($token);
        
        if (!$payload) {
            return ['error' => 'Unauthorized access', 'status' => 401];
        }
        
        return ['user' => $payload];
    }
    
    /**
     * POST /api/admin/hero-slider/upload-image - Upload hero image
     */
    public function upload_image() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        // Verify admin authentication
        $auth_result = $this->verify_admin_auth();
        if (isset($auth_result['error'])) {
            $this->output->set_status_header($auth_result['status'])->set_output(json_encode(['error' => $auth_result['error']]));
            return;
        }
        
        try {
            // Get form data
            $image = $_FILES['image'] ?? null;
            $name = $this->input->post('name') ?: '';
            $alt = $this->input->post('alt') ?: '';
            $description = $this->input->post('description') ?: null;
            $order = (int)$this->input->post('order') ?: 1;
            $image_id = $this->input->post('imageId') ?: null;
            $original_filename = $this->input->post('originalFilename') ?: null;
            
            if (!$image || !$name || !$alt) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Missing required fields']));
                return;
            }
            
            // Determine filename
            $filename = $this->determine_filename($image, $image_id, $original_filename);
            
            // Validate file type
            if (!str_starts_with($image['type'], 'image/')) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'File must be an image']));
                return;
            }
            
            // Validate file size (10MB limit)
            if ($image['size'] > 10 * 1024 * 1024) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'File size must be less than 10MB']));
                return;
            }
            
            // Create upload directory if it doesn't exist
            $upload_dir = FCPATH . 'public/Hero/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            
            // Save file
            $file_path = $upload_dir . $filename;
            if (!move_uploaded_file($image['tmp_name'], $file_path)) {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to upload file']));
                return;
            }
            
            // Save to database
            $image_data = [
                'name' => $name,
                'filename' => $filename,
                'alt_text' => $alt,
                'description' => $description,
                'display_order' => $order
            ];
            
            $is_update = false;
            $db_image_id = null;
            
            if ($image_id && $original_filename) {
                // Image replacement - update existing record
                $success = $this->Hero_image_model->update_by_filename($original_filename, $image_data);
                $is_update = true;
                $db_image_id = $image_id;
            } else {
                // Check if filename already exists
                $existing = $this->Hero_image_model->get_by_filename($filename);
                if ($existing) {
                    // Update existing record
                    $success = $this->Hero_image_model->update_by_filename($filename, $image_data);
                    $is_update = true;
                    $db_image_id = $existing['id'];
                } else {
                    // Create new record
                    $db_image_id = $this->Hero_image_model->create($image_data);
                    $success = $db_image_id !== false;
                }
            }
            
            if ($success) {
                $response = [
                    'message' => $is_update ? 'Hero image updated successfully' : 'Hero image uploaded successfully',
                    'imageId' => $db_image_id,
                    'filename' => $filename,
                    'url' => $this->config->item('base_url') . "public/Hero/{$filename}",
                    'isUpdate' => $is_update
                ];
                $this->output->set_status_header(200)->set_output(json_encode($response));
            } else {
                // Delete uploaded file if database operation failed
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to save image data']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to upload hero image']));
        }
    }
    
    /**
     * Determine filename for upload
     */
    private function determine_filename($image, $image_id, $original_filename) {
        if ($image_id && $original_filename) {
            // Image replacement - keep the original filename
            return $original_filename;
        } else {
            // New image - generate filename from uploaded file's name
            $uploaded_filename = $image['name'];
            $file_extension = strtolower(pathinfo($uploaded_filename, PATHINFO_EXTENSION));
            $base_name = pathinfo($uploaded_filename, PATHINFO_FILENAME);
            $sanitized_base_name = preg_replace('/[^a-zA-Z0-9-_]/', '-', $base_name);
            return "{$sanitized_base_name}.{$file_extension}";
        }
    }
}
