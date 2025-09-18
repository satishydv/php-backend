<?php
/**
 * Simple API Test Script
 * Run this to test if the CodeIgniter API endpoints are working
 */

echo "<h1>CodeIgniter 3 API Test</h1>";

// Test database connection
echo "<h2>Database Connection Test</h2>";
try {
    $mysqli = new mysqli('localhost', 'root', '', 'gharwa_auth');
    if ($mysqli->connect_error) {
        echo "<p style='color: red;'>❌ Database connection failed: " . $mysqli->connect_error . "</p>";
    } else {
        echo "<p style='color: green;'>✅ Database connection successful</p>";
        
        // Test tables
        $tables = ['users', 'reviews', 'gallery_images', 'hero_images'];
        foreach ($tables as $table) {
            $result = $mysqli->query("SHOW TABLES LIKE '$table'");
            if ($result->num_rows > 0) {
                echo "<p style='color: green;'>✅ Table '$table' exists</p>";
            } else {
                echo "<p style='color: red;'>❌ Table '$table' missing</p>";
            }
        }
    }
    $mysqli->close();
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>";
}

// Test API endpoints
echo "<h2>API Endpoints Test</h2>";
$base_url = 'http://localhost/gharwa-backend';

$endpoints = [
    'GET /api/gallery-images' => $base_url . '/api/gallery-images',
    'GET /api/hero-images' => $base_url . '/api/hero-images',
    'GET /api/reviews' => $base_url . '/api/reviews',
];

foreach ($endpoints as $name => $url) {
    echo "<h3>$name</h3>";
    echo "<p>URL: <a href='$url' target='_blank'>$url</a></p>";
    
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => 'Content-Type: application/json'
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        echo "<p style='color: red;'>❌ Failed to connect to endpoint</p>";
    } else {
        echo "<p style='color: green;'>✅ Endpoint responded</p>";
        echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 5px;'>";
        echo htmlspecialchars(substr($response, 0, 500));
        if (strlen($response) > 500) echo "...";
        echo "</pre>";
    }
    echo "<hr>";
}

echo "<h2>Next Steps</h2>";
echo "<ol>";
echo "<li>Make sure your Next.js frontend is running on <code>http://localhost:3000</code></li>";
echo "<li>Update your Next.js environment variables to point to this CodeIgniter backend</li>";
echo "<li>Test the admin panel login functionality</li>";
echo "<li>Test file uploads for gallery and hero images</li>";
echo "</ol>";

echo "<h2>Environment Variables for Next.js</h2>";
echo "<p>Add these to your Next.js <code>.env.local</code> file:</p>";
echo "<pre style='background: #f5f5f5; padding: 10px; border-radius: 5px;'>";
echo "NEXT_PUBLIC_API_URL=http://localhost/gharwa-backend/api\n";
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000";
echo "</pre>";
?>
