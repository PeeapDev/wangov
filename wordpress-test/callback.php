<?php
session_start();

// Configuration
$sso_server = 'http://localhost:3010';
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

// Clear state from session
unset($_SESSION['oauth_state']);

// Exchange code for token
$token_url = $sso_server . '/auth/token';
$post_data = [
    'grant_type' => 'authorization_code',
    'code' => $_GET['code'],
    'client_id' => $client_id,
    'redirect_uri' => $redirect_uri
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query($post_data)
    ]
]);

$response = file_get_contents($token_url, false, $context);

if ($response === false) {
    die('Failed to exchange code for token');
}

$token_data = json_decode($response, true);

if (!$token_data || isset($token_data['error'])) {
    die('Token exchange failed: ' . ($token_data['error_description'] ?? 'Unknown error'));
}

// Store user data in session
if (isset($token_data['user'])) {
    $_SESSION['wangov_user'] = $token_data['user'];
    $_SESSION['wangov_access_token'] = $token_data['access_token'];
}

// Redirect back to main page
header('Location: index.php');
exit;
?>
