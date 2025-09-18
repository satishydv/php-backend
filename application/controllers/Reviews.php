<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reviews extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('Review_model');
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
     * GET /api/reviews - Get active reviews for public display
     */
    public function index() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        try {
            $reviews = $this->Review_model->get_active();
            
            $response = ['reviews' => $reviews];
            $this->output->set_status_header(200)->set_output(json_encode($response));
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to fetch reviews']));
        }
    }
    
    /**
     * POST /api/reviews - Create new review
     */
    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        try {
            // Handle multipart form data
            $name = $this->input->post('name');
            $email = $this->input->post('email');
            $mobile = $this->input->post('mobile');
            $subject = $this->input->post('subject');
            $message = $this->input->post('message');
            $rating = (int)$this->input->post('rating');
            
            // Validate required fields
            if (!$name || !$email || !$mobile || !$message || !$rating) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Name, email, mobile, message, and rating are required']));
                return;
            }
            
            // Validate rating
            if ($rating < 1 || $rating > 5) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Rating must be between 1 and 5']));
                return;
            }
            
            // Validate email format
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Please enter a valid email address']));
                return;
            }
            
            // Handle file upload
            $profile_image_path = null;
            if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
                $profile_image_path = $this->handle_image_upload($_FILES['profileImage']);
            }
            
            // Create review data
            $review_data = [
                'name' => $name,
                'email' => $email,
                'mobile' => $mobile,
                'subject' => $subject,
                'message' => $message,
                'rating' => $rating,
                'profile_image' => $profile_image_path
            ];
            
            $review_id = $this->Review_model->create($review_data);
            
            if ($review_id) {
                $response = [
                    'message' => 'Review submitted successfully! It will be reviewed before being published.',
                    'reviewId' => $review_id
                ];
                $this->output->set_status_header(201)->set_output(json_encode($response));
            } else {
                $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to submit review. Please try again.']));
            }
            
        } catch (Exception $e) {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Failed to submit review. Please try again.']));
        }
    }
    
    /**
     * Handle image upload for profile images
     */
    private function handle_image_upload($file) {
        $upload_dir = FCPATH . 'public/reviews/';
        
        // Create directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        // Generate unique filename
        $timestamp = time();
        $random_string = substr(str_shuffle('abcdefghijklmnopqrstuvwxyz0123456789'), 0, 10);
        $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = "review_{$timestamp}_{$random_string}.{$file_extension}";
        
        $file_path = $upload_dir . $filename;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $file_path)) {
            return "reviews/{$filename}";
        }
        
        return null;
    }
}
