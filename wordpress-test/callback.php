<?php
session_start();

// Configuration
$backend_api = 'http://localhost:3004';
$client_id = 'wangov-universal';
$redirect_uri = 'http://localhost:8080/callback.php';

// Check for required parameters
if (!isset($_GET['code']) || !isset($_GET['state'])) {
    die('Missing required parameters');
}

// Validate state to prevent CSRF
if (!isset($_SESSION['oauth_state']) || $_SESSION['oauth_state'] !== $_GET['state']) {
    die('Invalid state parameter');
}

// Get state for backend processing
$state = $_SESSION['oauth_state'];

// Clear state from session
unset($_SESSION['oauth_state']);

// Exchange code for token via WanGov backend
$token_url = $backend_api . '/api/auth/callback';
$post_data = [
    'code' => $_GET['code'],
    'state' => $state,
    'client_id' => $client_id
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($post_data)
    ]
]);

$response = file_get_contents($token_url, false, $context);

if ($response === false) {
    die('Failed to exchange code for token');
}

$token_data = json_decode($response, true);

if (!$token_data || $token_data['status'] !== 'success') {
    die('Token exchange failed: ' . ($token_data['message'] ?? 'Unknown error'));
}

// Extract user and token from backend response
$access_token = $token_data['data']['token'];
$user_data = $token_data['data']['user'];

// Store user data in session
if (isset($user_data)) {
    $_SESSION['wangov_user'] = $user_data;
    $_SESSION['wangov_access_token'] = $access_token;
}

// Redirect back to main page
header('Location: index.php');
exit;
?>
