<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Jwt_helper {
    
    private $secret_key;
    
    public function __construct() {
        // Load environment configuration
        if (file_exists(APPPATH . 'config/env.php')) {
            include(APPPATH . 'config/env.php');
            $this->secret_key = isset($config['jwt_secret']) ? $config['jwt_secret'] : '35ce5a33fbbefea240139f7ca8e9eb92f9c9794df7942a8cea5a6275c01837ee';
        } else {
            $this->secret_key = '35ce5a33fbbefea240139f7ca8e9eb92f9c9794df7942a8cea5a6275c01837ee';
        }
    }
    
    /**
     * Generate JWT token
     */
    public function generate_token($payload, $expiration_hours = 24) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + ($expiration_hours * 3600);
        $payload = json_encode($payload);
        
        $base64_header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64_payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, $this->secret_key, true);
        $base64_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64_header . "." . $base64_payload . "." . $base64_signature;
    }
    
    /**
     * Verify JWT token
     */
    public function verify_token($token) {
        $token_parts = explode('.', $token);
        
        if (count($token_parts) != 3) {
            return false;
        }
        
        list($base64_header, $base64_payload, $base64_signature) = $token_parts;
        
        $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, $this->secret_key, true);
        $expected_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if (!hash_equals($expected_signature, $base64_signature)) {
            return false;
        }
        
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64_payload)), true);
        
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Get token from Authorization header
     */
    public function get_token_from_header() {
        $headers = getallheaders();
        
        if (!isset($headers['Authorization'])) {
            return null;
        }
        
        $auth_header = $headers['Authorization'];
        
        if (!preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            return null;
        }
        
        return $matches[1];
    }
}
