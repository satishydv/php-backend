<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
    
    public function __construct() {
        parent::__construct();
        $this->load->model('User_model');
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
     * POST /api/auth/login
     */
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        $input = json_decode($this->input->raw_input_stream, true);
        
        if (!$input || !isset($input['username']) || !isset($input['password'])) {
            $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Username and password are required']));
            return;
        }
        
        $username = $input['username'];
        $password = $input['password'];
        
        // Find user by username or email
        $user = $this->User_model->find_by_username_or_email($username);
        
        if (!$user) {
            $this->output->set_status_header(401)->set_output(json_encode(['error' => 'Invalid credentials']));
            return;
        }
        
        // Verify password
        if (!password_verify($password, $user['password_hash'])) {
            $this->output->set_status_header(401)->set_output(json_encode(['error' => 'Invalid credentials']));
            return;
        }
        
        // Generate JWT token
        $token = $this->jwt_helper->generate_token([
            'userId' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email']
        ]);
        
        $response = [
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ],
            'token' => $token
        ];
        
        $this->output->set_status_header(200)->set_output(json_encode($response));
    }
    
    /**
     * POST /api/auth/register
     */
    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        $input = json_decode($this->input->raw_input_stream, true);
        
        if (!$input || !isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
            $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Username, email, and password are required']));
            return;
        }
        
        $username = $input['username'];
        $email = $input['email'];
        $password = $input['password'];
        
        // Validate password length
        if (strlen($password) < 6) {
            $this->output->set_status_header(400)->set_output(json_encode(['error' => 'Password must be at least 6 characters long']));
            return;
        }
        
        // Check if user already exists
        if ($this->User_model->exists($username, $email)) {
            $this->output->set_status_header(409)->set_output(json_encode(['error' => 'Username or email already exists']));
            return;
        }
        
        // Hash password
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        
        // Create user
        $user_data = [
            'username' => $username,
            'email' => $email,
            'password_hash' => $password_hash
        ];
        
        $user_id = $this->User_model->create($user_data);
        
        if ($user_id) {
            $this->output->set_status_header(201)->set_output(json_encode(['message' => 'User registered successfully']));
        } else {
            $this->output->set_status_header(500)->set_output(json_encode(['error' => 'Internal server error']));
        }
    }
    
    /**
     * GET /api/auth/me
     */
    public function me() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->output->set_status_header(405)->set_output(json_encode(['error' => 'Method not allowed']));
            return;
        }
        
        // Get token from Authorization header
        $token = $this->jwt_helper->get_token_from_header();
        
        if (!$token) {
            $this->output->set_status_header(401)->set_output(json_encode(['error' => 'Access token required']));
            return;
        }
        
        // Verify JWT token
        $payload = $this->jwt_helper->verify_token($token);
        
        if (!$payload) {
            $this->output->set_status_header(401)->set_output(json_encode(['error' => 'Invalid or expired token']));
            return;
        }
        
        // Get user data from database
        $user = $this->User_model->find_by_id($payload['userId']);
        
        if (!$user) {
            $this->output->set_status_header(404)->set_output(json_encode(['error' => 'User not found']));
            return;
        }
        
        $response = [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'created_at' => $user['created_at']
            ]
        ];
        
        $this->output->set_status_header(200)->set_output(json_encode($response));
    }
}
