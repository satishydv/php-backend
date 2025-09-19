<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_gallery extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Gallery_image_model');
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
     * GET /api/admin/gallery - Get all gallery images (admin)
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
            $images = $this->Gallery_image_model->get_all();
            $this->output->set_status_header(200)->set_output(json_encode($images));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch gallery images']));
        }
    }
    
    /**
     * PUT /api/admin/gallery - Update gallery image
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
            $is_active = $input['is_active'] ?? 1;
            
            $update_data = [
                'name' => $name,
                'alt_text' => $alt_text,
                'is_active' => $is_active
            ];
            
            $success = $this->Gallery_image_model->update($id, $update_data);
            
            if ($success) {
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Image updated successfully',
                    'id' => $id
                ]));
            } else {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to update image']));
        }
    }
    
    /**
     * DELETE /api/admin/gallery - Delete gallery image
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
            $image = $this->Gallery_image_model->get_by_id($id);
            
            if (!$image) {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
                return;
            }
            
            // Delete from database
            $success = $this->Gallery_image_model->delete($id);
            
            if ($success) {
                // Delete physical file
                if ($image['filename']) {
                    $file_path = FCPATH . 'public/Gallery/' . $image['filename'];
                    if (file_exists($file_path)) {
                        unlink($file_path);
                    }
                }
                
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Image deleted successfully',
                    'deletedId' => $id
                ]));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete image']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete image']));
        }
    }
    
    /**
     * DELETE /api/admin/gallery/delete-image - Delete image by filename (for EditImageModal)
     */
    public function delete_image() {
        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        $this->verify_admin_auth();
        
        try {
            $filename = $this->input->post('filename');
            
            if (empty($filename)) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Filename is required']));
                return;
            }
            
            // Find image by filename
            $image = $this->Gallery_image_model->get_by_filename($filename);
            
            if (!$image) {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Image not found']));
                return;
            }
            
            // Delete from database
            $success = $this->Gallery_image_model->delete($image['id']);
            
            if ($success) {
                // Delete physical file
                $file_path = FCPATH . 'public/Gallery/' . $filename;
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
                
                $this->output->set_status_header(200)->set_output(json_encode([
                    'message' => 'Image deleted successfully',
                    'deletedId' => $image['id']
                ]));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete image']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete image']));
        }
    }
}
