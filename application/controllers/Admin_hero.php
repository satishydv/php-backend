<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_hero extends CI_Controller {
    
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
     * GET /api/admin/hero-slider - Get all hero images (admin)
     */
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
            $images = $this->Hero_image_model->get_all();
            $this->output->set_status_header(200)->set_output(json_encode($images));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch hero images']));
        }
    }
    
    /**
     * PUT /api/admin/hero-slider - Update hero image
     */
    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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
            $input = json_decode($this->input->raw_input_stream, true);
            
            if (!$input || !isset($input['id'])) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Image ID is required']));
                return;
            }
            
            $id = $input['id'];
            $name = $input['name'] ?? '';
            $alt_text = $input['alt_text'] ?? '';
            $description = $input['description'] ?? null;
            $is_active = $input['is_active'] ?? 1;
            $display_order = $input['display_order'] ?? 1;
            
            $update_data = [
                'name' => $name,
                'alt_text' => $alt_text,
                'description' => $description,
                'is_active' => $is_active,
                'display_order' => $display_order
            ];
            
            $success = $this->Hero_image_model->update($id, $update_data);
            
            if ($success) {
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Hero image updated successfully',
                    'id' => $id
                ]));
            } else {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to update hero image']));
        }
    }
    
    /**
     * DELETE /api/admin/hero-slider - Delete hero image
     */
    public function delete() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
            $id = $this->input->get('id');
            
            if (!$id) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Image ID is required']));
                return;
            }
            
            // Get image details before deletion
            $image = $this->Hero_image_model->get_by_id($id);
            
            if (!$image) {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
                return;
            }
            
            // Delete from database
            $success = $this->Hero_image_model->delete($id);
            
            if ($success) {
                // Delete physical file
                if ($image['filename']) {
                    $file_path = FCPATH . 'public/Hero/' . $image['filename'];
                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                }
                
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Hero image deleted successfully',
                    'deletedId' => $id
                ]));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete hero image']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete hero image']));
        }
    }
    
    /**
     * DELETE /api/admin/hero-slider/delete-image - Delete hero image by filename (for EditHeroModal)
     */
    public function delete_image() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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
            // Get filename from query parameter
            $filename = $this->input->get('filename');
            
            // Debug logging
            error_log("Delete hero image request - Filename: " . ($filename ?: 'empty'));
            error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
            error_log("Query string: " . ($_SERVER['QUERY_STRING'] ?? 'empty'));
            
            if (empty($filename)) {
                error_log("Hero filename is empty");
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Filename is required']));
                return;
            }
            
            // Find image by filename
            $image = $this->Hero_image_model->get_by_filename($filename);
            
            if (!$image) {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
                return;
            }
            
            // Only delete the physical file, not the database record
            $file_path = FCPATH . 'public/Hero/' . $filename;
            error_log("Attempting to delete hero file: " . $file_path);
            
            if (file_exists($file_path)) {
                unlink($file_path);
                error_log("Hero physical file deleted successfully");
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Physical file deleted successfully',
                    'imageId' => $image['id'],
                    'filename' => $filename
                ]));
            } else {
                error_log("Hero physical file not found: " . $file_path);
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Physical file not found']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete hero image']));
        }
    }
}
