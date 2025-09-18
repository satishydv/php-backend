<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Gallery_image_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    /**
     * Get all active gallery images
     */
    public function get_active() {
        $this->db->where('is_active', 1);
        $this->db->order_by('display_order', 'ASC');
        $query = $this->db->get('gallery_images');
        
        return $query->result_array();
    }
    
    /**
     * Get all gallery images (for admin)
     */
    public function get_all() {
        $this->db->order_by('display_order', 'ASC');
        $query = $this->db->get('gallery_images');
        
        return $query->result_array();
    }
    
    /**
     * Create new gallery image
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
        
        $this->db->insert('gallery_images', $image_data);
        return $this->db->insert_id();
    }
    
    /**
     * Update gallery image
     */
    public function update($id, $data) {
        $update_data = array(
            'name' => $data['name'],
            'alt_text' => $data['alt_text'],
            'is_active' => $data['is_active'] ?? 1,
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->where('id', $id);
        $this->db->update('gallery_images', $update_data);
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Update gallery image by filename
     */
    public function update_by_filename($filename, $data) {
        $update_data = array(
            'name' => $data['name'],
            'alt_text' => $data['alt_text'],
            'updated_at' => date('Y-m-d H:i:s')
        );
        
        $this->db->where('filename', $filename);
        $this->db->update('gallery_images', $update_data);
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Delete gallery image
     */
    public function delete($id) {
        $this->db->where('id', $id);
        $this->db->delete('gallery_images');
        
        return $this->db->affected_rows() > 0;
    }
    
    /**
     * Get gallery image by ID
     */
    public function get_by_id($id) {
        $this->db->where('id', $id);
        $query = $this->db->get('gallery_images');
        return $query->row_array();
    }
    
    /**
     * Get gallery image by filename
     */
    public function get_by_filename($filename) {
        $this->db->where('filename', $filename);
        $query = $this->db->get('gallery_images');
        return $query->row_array();
    }
    
    /**
     * Check if filename exists
     */
    public function filename_exists($filename) {
        $this->db->where('filename', $filename);
        $query = $this->db->get('gallery_images');
        return $query->num_rows() > 0;
    }
    
    /**
     * Get next display order
     */
    private function get_next_order() {
        $this->db->select_max('display_order');
        $query = $this->db->get('gallery_images');
        $result = $query->row();
        return ($result->display_order ?? 0) + 1;
    }
}
