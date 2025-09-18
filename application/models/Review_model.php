<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Review_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    /**
     * Create a new review
     */
    public function create($data) {
        $review_data = array(
            'name' => $data['name'],
            'email' => $data['email'],
            'mobile' => $data['mobile'],
            'subject' => $data['subject'] ?? null,
            'message' => $data['message'],
            'rating' => $data['rating'],
            'profile_image' => $data['profile_image'] ?? null,
            'status' => 'pending',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->insert('reviews', $review_data);
        return $this->db->insert_id();
    }
    
    /**
     * Get all reviews with pagination and filtering
     */
    public function get_all($page = 1, $limit = 10, $status = '') {
        $offset = ($page - 1) * $limit;
        
        if (!empty($status)) {
            $this->db->where('status', $status);
        }
        
        $this->db->order_by('created_at', 'DESC');
        $this->db->limit($limit, $offset);
        $query = $this->db->get('reviews');
        
        return $query->result_array();
    }
    
    /**
     * Get active reviews for public display
     */
    public function get_active() {
        $this->db->where('status', 'active');
        $this->db->order_by('created_at', 'DESC');
        $query = $this->db->get('reviews');
        
        return $query->result_array();
    }
    
    /**
     * Count total reviews
     */
    public function count_all($status = '') {
        if (!empty($status)) {
            $this->db->where('status', $status);
        }
        
        return $this->db->count_all_results('reviews');
    }
    
    /**
     * Update review status
     */
    public function update_status($id, $status) {
        $this->db->where('id', $id);
        $this->db->update('reviews', array(
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s')
        ));
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Delete review
     */
    public function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('reviews');
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Get review by ID
     */
    public function get_by_id($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('reviews');
        return $query->row_array();
    }
}
