<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Hero_image_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    /**
     * Get all active hero images
     */
    public function get_active() {
        $this->db->where('is_active', 1);
        $this->db->order_by('display_order', 'ASC');
        $query = $this->db->get('hero_images');
        
        return $query->result_array();
    }
    
    /**
     * Get all hero images (for admin)
     */
    public function get_all() {
        $this->db->order_by('display_order', 'ASC');
        $query = $this->db->get('hero_images');
        
        return $query->result_array();
    }
    
    /**
     * Create new hero image
     */
    public function create($data) {
        $image_data = array(
            'name' => $data['name'],
            'filename' => $data['filename'],
            'alt_text' => $data['alt_text'],
            'description' => $data['description'] ?? null,
            'display_order' => $data['display_order'] ?? $this->get_next_order(),
            'is_active' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->insert('hero_images', $image_data);
        return $this->db->insert_id();
    }
    
    /**
     * Update hero image
     */
    public function update($id, $data) {
        $update_data = array(
            'name' => $data['name'],
            'alt_text' => $data['alt_text'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? 1,
            'display_order' => $data['display_order'] ?? 1,
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->where('id', $id);
        $this->db->update('hero_images', $update_data);
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Update hero image by filename
     */
    public function update_by_filename($filename, $data) {
        $update_data = array(
            'name' => $data['name'],
            'alt_text' => $data['alt_text'],
            'description' => $data['description'] ?? null,
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->where('filename', $filename);
        $this->db->update('hero_images', $update_data);
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Delete hero image
     */
    public function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('hero_images');
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Get hero image by ID
     */
    public function get_by_id($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('hero_images');
        return $query->row_array();
    }
    
    /**
     * Get hero image by filename
     */
    public function get_by_filename($filename) {
        $this->db->where('filename', $filename);
        $query = $this->db->get('hero_images');
        return $query->row_array();
    }
    
    /**
     * Check if filename exists
     */
    public function filename_exists($filename) {
        $this->db->where('filename', $filename);
        $query = $this->db->get('hero_images');
        return $query->num_rows() > 0;
    }
    
    /**
     * Get next display order
     */
    private function get_next_order() {
        $this->db->select_max('display_order');
        $query = $this->db->get('hero_images');
        $result = $query->row();
        return ($result->display_order ?? 0) + 1;
    }
}
