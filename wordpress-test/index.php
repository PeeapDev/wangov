<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordPress WanGov ID Test Site</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .wangov-login-button {
            display: inline-block;
            background-color: #006064;
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: bold;
            margin: 10px 0;
        }
        .wangov-login-button:hover {
            background-color: #00838f;
        }
        .user-info {
            background: #e8f5e8;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
        }
        .error {
            background: #ffe6e6;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
            color: #d32f2f;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>WordPress WanGov ID Integration Test</h1>
        
        <?php
        session_start();
        
        // Configuration
        $sso_server = 'http://localhost:3010';
        $client_id = 'wangov-universal';
        $redirect_uri = 'http://localhost:8080/callback.php';
        
        // Check if user is logged in
        if (isset($_SESSION['wangov_user'])) {
            $user = $_SESSION['wangov_user'];
            echo '<div class="user-info">';
            echo '<h2>Welcome, ' . htmlspecialchars($user['name'] ?? 'User') . '!</h2>';
            echo '<p><strong>Email:</strong> ' . htmlspecialchars($user['email'] ?? 'N/A') . '</p>';
            if (isset($user['nin'])) {
                echo '<p><strong>National ID:</strong> ' . htmlspecialchars($user['nin']) . '</p>';
            }
            echo '<p><a href="logout.php">Logout</a></p>';
            echo '</div>';
        } else {
            // Generate OAuth login URL
            $state = bin2hex(random_bytes(16));
            $_SESSION['oauth_state'] = $state;
            
            $params = http_build_query([
                'client_id' => $client_id,
                'redirect_uri' => $redirect_uri,
                'response_type' => 'code',
                'state' => $state,
                'scope' => 'profile email'
            ]);
            
            $login_url = $sso_server . '/auth/authorize?' . $params;
            
            echo '<p>This is a test WordPress site demonstrating WanGov ID integration.</p>';
            echo '<p>Click the button below to login with your WanGov ID:</p>';
            echo '<a href="' . htmlspecialchars($login_url) . '" class="wangov-login-button">Login with WanGov ID</a>';
            
            echo '<div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 4px;">';
            echo '<h3>Test Credentials:</h3>';
            echo '<p>Email: john.doe@wangov.sl<br>Password: password123</p>';
            echo '</div>';
        }
        ?>
        
        <div style="margin-top: 30px; font-size: 14px; color: #666;">
            <h3>Integration Details:</h3>
            <ul>
                <li>SSO Server: <?php echo htmlspecialchars($sso_server); ?></li>
                <li>Client ID: <?php echo htmlspecialchars($client_id); ?></li>
                <li>Callback URL: <?php echo htmlspecialchars($redirect_uri); ?></li>
            </ul>
        </div>
    </div>
</body>
</html>
