<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin_reviews extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Review_model');
        $this->load->library('Jwt_helper');
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
     * Verify admin authentication
     */
    private function verify_admin_auth() {
        $token = $this->jwt_helper->get_token_from_header();
        
        if (!$token) {
            return ['error' => 'Access token required', 'status' => 401];
        }
        
        $payload = $this->jwt_helper->verify_token($token);
        
        if (!$payload) {
            return ['error' => 'Invalid or expired token', 'status' => 401];
        }
        
        return ['user' => $payload];
    }
    
    /**
     * GET /api/admin/reviews - Get all reviews with pagination and filtering
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
            // Get pagination parameters
            $page = (int)$this->input->get('page') ?: 1;
            $limit = (int)$this->input->get('limit') ?: 10;
            $status = $this->input->get('status') ?: '';
            
            // Get reviews with pagination
            $reviews = $this->Review_model->get_all($page, $limit, $status);
            $total = $this->Review_model->count_all($status);
            
            $response = [
                'reviews' => $reviews,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'totalPages' => ceil($total / $limit)
                ]
            ];
            
            $this->output->set_status_header(200)->set_output(json_encode($response));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch reviews']));
        }
    }
    
    /**
     * PUT /api/admin/reviews - Update review status
     */
    public function update_status() {
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
            
            if (!$input || !isset($input['id']) || !isset($input['status'])) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Review ID and status are required']));
                return;
            }
            
            $id = $input['id'];
            $status = $input['status'];
            
            if (!in_array($status, ['pending', 'active', 'inactive'])) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Invalid status. Must be pending, active, or inactive']));
                return;
            }
            
            $success = $this->Review_model->update_status($id, $status);
            
            if ($success) {
                $this->output->set_status_header(200)->set_output(json_encode(['message' => 'Review status updated successfully']));
            } else {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Review not found']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to update review']));
        }
    }
    
    /**
     * DELETE /api/admin/reviews - Delete review
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
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Review ID is required']));
                return;
            }
            
            // Get review data to delete associated image file
            $review = $this->Review_model->get_by_id($id);
            
            if (!$review) {
                $this->output->set_status_header(404)->set_output(json_encode(['error' => 'Review not found']));
                return;
            }
            
            // Delete review from database
            $success = $this->Review_model->delete($id);
            
            if ($success) {
                // TODO: Delete associated image file from filesystem if needed
                // if ($review['profile_image']) {
                //     $image_path = FCPATH . 'public/' . $review['profile_image'];
                //     if (file_exists($image_path)) {
                //         unlink($image_path);
                //     }
                // }
                
                $this->output->set_status_header(200)->set_output(json_encode(['message' => 'Review deleted successfully']));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete review']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to delete review']));
        }
    }
}
