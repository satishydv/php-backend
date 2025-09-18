<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    /**
     * Create a new user
     */
    public function create($data) {
        $user_data = array(
            'username' => $data['username'],
            'email' => $data['email'],
            'password_hash' => $data['password_hash'],
            'created_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->insert('users', $user_data);
        return $this->db->insert_id();
    }
    
    /**
     * Find user by username or email
     */
    public function find_by_username_or_email($username) {
        $this->db->where('username', $username);
        $this->db->or_where('email', $username);
        $query = $this->db->get('users');
        return $query->row_array();
    }
    
    /**
     * Find user by ID
     */
    public function find_by_id($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('users');
        return $query->row_array();
    }
    
    /**
     * Check if username or email already exists
     */
    public function exists($username, $email) {
        $this->db->where('username', $username);
        $this->db->or_where('email', $email);
        $query = $this->db->get('users');
        return $query->num_rows() > 0;
    }
}
