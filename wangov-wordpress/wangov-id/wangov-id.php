<?php
/**
 * Plugin Name: WanGov ID Integration
 * Plugin URI: https://wangov.sl
 * Description: Integrates WanGov ID Single Sign-On (SSO) with WordPress sites
 * Version: 1.0.0
 * Author: WanGov Development Team
 * Author URI: https://wangov.sl
 * License: GPL-2.0+
 * Text Domain: wangov-id
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

define('WANGOV_ID_VERSION', '1.0.0');
define('WANGOV_ID_PATH', plugin_dir_path(__FILE__));
define('WANGOV_ID_URL', plugin_dir_url(__FILE__));
define('WANGOV_ID_BASENAME', plugin_basename(__FILE__));

/**
 * Main WanGov ID Plugin Class
 */
class WanGovID {
    /**
     * Instance of this class.
     */
    private static $instance = null;
    
    /**
     * Plugin settings - like Google OAuth
     */
    private $settings = [
        'client_id' => 'wangov-universal',
        'client_secret' => 'wangov-universal-secret',
        'enabled' => true,
        'auto_create_users' => true,
        'button_text' => 'Login with WanGov ID',
        'show_on_login_page' => true,
    ];
    
    /**
     * Fixed SSO server configuration
     */
    private $sso_config = [
        'server_url' => 'http://localhost:3010',
        'auth_endpoint' => '/auth/authorize',
        'token_endpoint' => '/auth/token',
        'status_endpoint' => '/auth/status',
    ];
    
    /**
     * WanGov backend API configuration
     */
    private $backend_config = [
        'api_url' => 'http://localhost:3004',
        'oauth_callback_endpoint' => '/api/auth/callback',
    ];

    /**
     * Return an instance of this class.
     */
    public static function get_instance() {
        if (null == self::$instance) {
            self::$instance = new self;
        }
        
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        // Load settings from options
        $this->load_settings();

        // Initialize hooks
        $this->init_hooks();
    }

    /**
     * Load settings from WordPress options
     */
    private function load_settings() {
        $saved_settings = get_option('wangov_id_settings');
        
        if (is_array($saved_settings)) {
            $this->settings = array_merge($this->settings, $saved_settings);
        }
    }

    /**
     * Register all hooks
     */
    private function init_hooks() {
        // Admin hooks
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        
        // Frontend hooks
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('login_enqueue_scripts', array($this, 'enqueue_login_scripts'));
        
        // Authentication hooks
        add_action('init', array($this, 'process_oauth_callback'));
        
        // Shortcodes
        add_shortcode('wangov_login_button', array($this, 'login_button_shortcode'));
        add_shortcode('wangov_user_profile', array($this, 'user_profile_shortcode'));

        // AJAX actions
        add_action('wp_ajax_wangov_logout', array($this, 'ajax_logout'));
        add_action('wp_ajax_nopriv_wangov_logout', array($this, 'ajax_logout'));
    }

    /**
     * Add admin menu pages
     */
    public function add_admin_menu() {
        add_options_page(
            'WanGov ID Settings',
            'WanGov ID',
            'manage_options',
            'wangov-id-settings',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('wangov_id_settings', 'wangov_id_settings');
        
        add_settings_section(
            'wangov_id_main_section',
            'WanGov ID SSO Configuration',
            array($this, 'settings_section_callback'),
            'wangov-id-settings'
        );
        
        add_settings_field(
            'client_id',
            'Client ID',
            array($this, 'render_client_id_field'),
            'wangov-id-settings',
            'wangov_id_main_section'
        );
        
        add_settings_field(
            'client_secret',
            'Client Secret',
            array($this, 'render_client_secret_field'),
            'wangov-id-settings',
            'wangov_id_main_section'
        );
        
        add_settings_field(
            'enabled',
            'Enable WanGov ID',
            array($this, 'render_enabled_field'),
            'wangov-id-settings',
            'wangov_id_main_section'
        );
        
        add_settings_field(
            'button_text',
            'Login Button Text',
            array($this, 'render_button_text_field'),
            'wangov-id-settings',
            'wangov_id_main_section'
        );
        
        add_settings_field(
            'auto_create_users',
            'Auto Create Users',
            array($this, 'render_auto_create_users_field'),
            'wangov-id-settings',
            'wangov_id_main_section'
        );
    }

    /**
     * Settings section description
     */
    public function settings_section_callback() {
        echo '<p>Configure the WanGov ID SSO integration settings.</p>';
    }

    /**
     * Render client ID field
     */
    public function render_client_id_field() {
        $value = isset($this->settings['client_id']) ? esc_attr($this->settings['client_id']) : '';
        echo '<input type="text" id="client_id" name="wangov_id_settings[client_id]" value="' . $value . '" class="regular-text" placeholder="wangov_wp_abc123def456">';
        echo '<p class="description">Your OAuth Client ID from WanGov SSO Management dashboard</p>';
    }
    
    /**
     * Render client secret field
     */
    public function render_client_secret_field() {
        $value = isset($this->settings['client_secret']) ? esc_attr($this->settings['client_secret']) : '';
        echo '<input type="password" id="client_secret" name="wangov_id_settings[client_secret]" value="' . $value . '" class="regular-text" placeholder="sk_live_abcdef123456789">';
        echo '<p class="description">Your OAuth Client Secret from WanGov SSO Management dashboard</p>';
    }
    
    /**
     * Render enabled field
     */
    public function render_enabled_field() {
        $value = isset($this->settings['enabled']) ? $this->settings['enabled'] : true;
        echo '<input type="checkbox" id="enabled" name="wangov_id_settings[enabled]" value="1" ' . checked(1, $value, false) . '>';
        echo '<p class="description">Enable or disable WanGov ID integration</p>';
    }
    
    /**
     * Render button text field
     */
    public function render_button_text_field() {
        $value = isset($this->settings['button_text']) ? esc_attr($this->settings['button_text']) : 'Login with WanGov ID';
        echo '<input type="text" id="button_text" name="wangov_id_settings[button_text]" value="' . $value . '" class="regular-text">';
        echo '<p class="description">Text to display on the login button</p>';
    }
    
    /**
     * Render auto create users field
     */
    public function render_auto_create_users_field() {
        $value = isset($this->settings['auto_create_users']) ? $this->settings['auto_create_users'] : true;
        echo '<input type="checkbox" id="auto_create_users" name="wangov_id_settings[auto_create_users]" value="1" ' . checked(1, $value, false) . '>';
        echo '<p class="description">Automatically create WordPress users for new WanGov ID users</p>';
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1><?= esc_html(get_admin_page_title()); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields('wangov_id_settings');
                do_settings_sections('wangov-id-settings');
                submit_button();
                ?>
            </form>
            
            <div class="card">
                <h2>Testing OAuth Integration</h2>
                <p>Add the following shortcode to any page to display a WanGov ID login button:</p>
                <code>[wangov_login_button]</code>
                
                <p>After login, display user profile information with:</p>
                <code>[wangov_user_profile]</code>
                
                <p>Callback URL to configure in WanGov SSO:</p>
                <code><?php echo esc_url(site_url('/wangov-auth/callback')); ?></code>
            </div>
        </div>
        <?php
    }

    /**
     * Enqueue frontend scripts
     */
    public function enqueue_scripts() {
        wp_enqueue_style('wangov-id-style', WANGOV_ID_URL . 'assets/css/wangov-id.css', array(), WANGOV_ID_VERSION);
        wp_enqueue_script('wangov-id-script', WANGOV_ID_URL . 'assets/js/wangov-id.js', array('jquery'), WANGOV_ID_VERSION, true);
        
        wp_localize_script('wangov-id-script', 'wangovId', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'logoutNonce' => wp_create_nonce('wangov-logout-nonce'),
        ));
    }

    /**
     * Enqueue login page scripts
     */
    public function enqueue_login_scripts() {
        wp_enqueue_style('wangov-id-login-style', WANGOV_ID_URL . 'assets/css/wangov-id-login.css', array(), WANGOV_ID_VERSION);
        wp_enqueue_script('wangov-id-login-script', WANGOV_ID_URL . 'assets/js/wangov-id-login.js', array('jquery'), WANGOV_ID_VERSION, true);
        
        $login_url = $this->get_oauth_login_url();
        
        wp_localize_script('wangov-id-login-script', 'wangovIdLogin', array(
            'loginUrl' => $login_url,
        ));
    }

    /**
     * Get OAuth login URL
     */
    private function get_oauth_login_url() {
        // Check if plugin is properly configured
        if (empty($this->settings['client_id']) || empty($this->settings['client_secret'])) {
            return '#'; // Return dummy URL if not configured
        }
        
        $state = $this->generate_state_parameter();
        $redirect_uri = site_url('/wangov-auth/callback');
        
        // Store state in session for validation
        if (!session_id()) {
            session_start();
        }
        $_SESSION['wangov_oauth_state'] = $state;
        
        $params = array(
            'client_id' => $this->settings['client_id'],
            'redirect_uri' => $redirect_uri,
            'response_type' => 'code',
            'state' => $state,
            'scope' => 'profile email',
        );
        
        return $this->sso_config['server_url'] . $this->sso_config['auth_endpoint'] . '?' . http_build_query($params);
    }

    /**
     * Generate random state parameter for OAuth security
     */
    private function generate_state_parameter() {
        return wp_generate_password(24, false);
    }

    /**
     * Process OAuth callback
     */
    public function process_oauth_callback() {
        // Check if this is an OAuth callback request
        if (!isset($_GET['code']) || !isset($_GET['state'])) {
            return;
        }
        
        // Get current path
        $current_path = sanitize_text_field($_SERVER['REQUEST_URI']);
        
        // Only process if this is our callback endpoint
        if (strpos($current_path, '/wangov-auth/callback') === false) {
            return;
        }
        
        // Start session if not started
        if (!session_id()) {
            session_start();
        }
        
        // Validate state parameter to prevent CSRF
        if (!isset($_SESSION['wangov_oauth_state']) || $_SESSION['wangov_oauth_state'] !== $_GET['state']) {
            wp_die('Invalid OAuth state parameter. Authentication failed.', 'Authentication Failed', array('response' => 403));
        }
        
        // Clear state from session
        unset($_SESSION['wangov_oauth_state']);
        
        // Exchange code for token
        $token_data = $this->exchange_code_for_token($_GET['code']);
        
        if (!$token_data || isset($token_data['error'])) {
            wp_die(
                'Failed to obtain access token: ' . (isset($token_data['error_description']) ? $token_data['error_description'] : 'Unknown error'),
                'Authentication Failed',
                array('response' => 401)
            );
        }
        
        // Store token in session
        $_SESSION['wangov_access_token'] = $token_data['access_token'];
        $_SESSION['wangov_user'] = isset($token_data['user']) ? $token_data['user'] : null;
        
        // If we have user data, create or update WordPress user
        if (isset($token_data['user']) && isset($token_data['user']['email'])) {
            $this->create_or_update_wp_user($token_data['user']);
        }
        
        // Redirect to homepage or a specific page
        wp_redirect(home_url());
        exit;
    }

    /**
     * Exchange authorization code for token via WanGov backend
     */
    private function exchange_code_for_token($code) {
        $url = $this->backend_config['api_url'] . $this->backend_config['oauth_callback_endpoint'];
        
        // Get state from session for backend processing
        $state = isset($_SESSION['wangov_oauth_state']) ? $_SESSION['wangov_oauth_state'] : '';
        
        $body = json_encode(array(
            'code' => $code,
            'state' => $state,
            'client_id' => $this->settings['client_id'] ?: 'wangov-universal',
        ));
        
        $response = wp_remote_post($url, array(
            'body' => $body,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
        ));
        
        if (is_wp_error($response)) {
            error_log('WanGov ID token exchange error: ' . $response->get_error_message());
            return null;
        }
        
        $data = json_decode(wp_remote_retrieve_body($response), true);
        
        // Handle the new backend response format
        if (isset($data['status']) && $data['status'] === 'success' && isset($data['data'])) {
            return array(
                'access_token' => $data['data']['token'],
                'user' => $data['data']['user']
            );
        }
        
        return $data;
    }

    /**
     * Create or update WordPress user based on OAuth data
     */
    private function create_or_update_wp_user($user_data) {
        $email = sanitize_email($user_data['email']);
        $user_id = email_exists($email);
        
        if (!$user_id) {
            // Create new user
            $username = $this->generate_username_from_email($email);
            $random_password = wp_generate_password(20);
            
            $user_id = wp_create_user($username, $random_password, $email);
            
            if (is_wp_error($user_id)) {
                error_log('WanGov ID: Error creating user - ' . $user_id->get_error_message());
                return;
            }
            
            // Set display name
            $display_name = isset($user_data['name']) ? $user_data['name'] : '';
            if (empty($display_name) && isset($user_data['firstName']) && isset($user_data['lastName'])) {
                $display_name = $user_data['firstName'] . ' ' . $user_data['lastName'];
            }
            
            if (!empty($display_name)) {
                wp_update_user(array(
                    'ID' => $user_id,
                    'display_name' => $display_name,
                ));
            }
            
            // Store WanGov ID metadata
            update_user_meta($user_id, 'wangov_user_id', isset($user_data['id']) ? $user_data['id'] : '');
        }
        
        // Log the user in
        wp_clear_auth_cookie();
        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id);
    }

    /**
     * Generate username from email
     */
    private function generate_username_from_email($email) {
        $username = sanitize_user(current(explode('@', $email)), true);
        
        // Check if username exists
        $counter = 1;
        $original_username = $username;
        
        while (username_exists($username)) {
            $username = $original_username . $counter;
            $counter++;
        }
        
        return $username;
    }

    /**
     * Login button shortcode
     */
    public function login_button_shortcode($atts) {
        $atts = shortcode_atts(array(
            'text' => 'Login with WanGov ID',
            'class' => 'wangov-login-button',
        ), $atts, 'wangov_login_button');
        
        $login_url = $this->get_oauth_login_url();
        
        if (is_user_logged_in()) {
            return '<div class="wangov-user-logged-in">
                <p>You are already logged in.</p>
                <button class="wangov-logout-button ' . esc_attr($atts['class']) . '">Logout</button>
            </div>';
        } else {
            return '<a href="' . esc_url($login_url) . '" class="' . esc_attr($atts['class']) . '">' . esc_html($atts['text']) . '</a>';
        }
    }

    /**
     * User profile shortcode
     */
    public function user_profile_shortcode($atts) {
        if (!is_user_logged_in()) {
            return '<div class="wangov-profile-not-logged-in">
                <p>Please login to view your profile.</p>
                ' . $this->login_button_shortcode(array()) . '
            </div>';
        }
        
        // Start session if not started
        if (!session_id()) {
            session_start();
        }
        
        $user_data = isset($_SESSION['wangov_user']) ? $_SESSION['wangov_user'] : null;
        $current_user = wp_get_current_user();
        
        $output = '<div class="wangov-user-profile">';
        $output .= '<h2>Your WanGov ID Profile</h2>';
        
        if ($user_data) {
            $output .= '<div class="wangov-profile-info">';
            $output .= '<p><strong>Name:</strong> ' . esc_html(isset($user_data['name']) ? $user_data['name'] : $current_user->display_name) . '</p>';
            $output .= '<p><strong>Email:</strong> ' . esc_html($current_user->user_email) . '</p>';
            
            if (isset($user_data['nin'])) {
                $output .= '<p><strong>National ID:</strong> ' . esc_html($user_data['nin']) . '</p>';
            }
            
            $output .= '</div>';
        } else {
            $output .= '<div class="wangov-profile-info">';
            $output .= '<p><strong>Name:</strong> ' . esc_html($current_user->display_name) . '</p>';
            $output .= '<p><strong>Email:</strong> ' . esc_html($current_user->user_email) . '</p>';
            $output .= '<p><em>Limited profile information available.</em></p>';
            $output .= '</div>';
        }
        
        $output .= '<button class="wangov-logout-button">Logout</button>';
        $output .= '</div>';
        
        return $output;
    }

    /**
     * AJAX logout handler
     */
    public function ajax_logout() {
        check_ajax_referer('wangov-logout-nonce', 'nonce');
        
        // Start session if not started
        if (!session_id()) {
            session_start();
        }
        
        // Clear WanGov session data
        unset($_SESSION['wangov_access_token']);
        unset($_SESSION['wangov_user']);
        
        // WordPress logout
        wp_logout();
        
        wp_send_json_success(array('redirect' => home_url()));
    }
}

/**
 * Add rewrite rules for OAuth callback
 */
function wangov_id_add_rewrite_rules() {
    add_rewrite_rule('^wangov-auth/callback/?', 'index.php', 'top');
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'wangov_id_add_rewrite_rules');

/**
 * Creates necessary directories and files on plugin activation
 */
function wangov_id_activate() {
    // Create directories
    $dirs = array(
        WANGOV_ID_PATH . 'assets',
        WANGOV_ID_PATH . 'assets/css',
        WANGOV_ID_PATH . 'assets/js',
    );
    
    foreach ($dirs as $dir) {
        if (!file_exists($dir)) {
            wp_mkdir_p($dir);
        }
    }

    // Create CSS file
    $css_content = <<<CSS
/* WanGov ID Plugin Styles */
.wangov-login-button {
    display: inline-block;
    background-color: #006064;
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: bold;
    transition: background-color 0.3s;
}

.wangov-login-button:hover {
    background-color: #00838f;
    color: white;
}

.wangov-logout-button {
    background-color: #e91e63;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.wangov-logout-button:hover {
    background-color: #c2185b;
}

.wangov-user-profile {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #e0e0e0;
}

.wangov-profile-info {
    margin-bottom: 20px;
}
CSS;

    file_put_contents(WANGOV_ID_PATH . 'assets/css/wangov-id.css', $css_content);

    // Create login CSS file
    $login_css_content = <<<CSS
/* WanGov ID Login Page Styles */
.wangov-id-login-button {
    display: block;
    margin: 20px auto;
    background-color: #006064;
    color: white;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 4px;
    font-weight: bold;
    text-align: center;
    max-width: 250px;
    transition: background-color 0.3s;
}

.wangov-id-login-button:hover {
    background-color: #00838f;
    color: white;
}

.login-separator {
    text-align: center;
    margin: 20px 0;
    font-size: 14px;
    color: #777;
    position: relative;
}

.login-separator:before,
.login-separator:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background-color: #ddd;
}

.login-separator:before {
    left: 0;
}

.login-separator:after {
    right: 0;
}
CSS;

    file_put_contents(WANGOV_ID_PATH . 'assets/css/wangov-id-login.css', $login_css_content);

    // Create JS file
    $js_content = <<<JAVASCRIPT
(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Handle logout button click
        $('.wangov-logout-button').on('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: wangovId.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'wangov_logout',
                    nonce: wangovId.logoutNonce
                },
                success: function(response) {
                    if (response.success && response.data.redirect) {
                        window.location.href = response.data.redirect;
                    }
                }
            });
        });
    });
})(jQuery);
JAVASCRIPT;

    file_put_contents(WANGOV_ID_PATH . 'assets/js/wangov-id.js', $js_content);

    // Create login JS file
    $login_js_content = <<<JAVASCRIPT
(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Add WanGov ID login button to WordPress login form
        $('#loginform').append('<div class="login-separator">OR</div>');
        $('#loginform').append('<a href="' + wangovIdLogin.loginUrl + '" class="wangov-id-login-button">Login with WanGov ID</a>');
    });
})(jQuery);
JAVASCRIPT;

    file_put_contents(WANGOV_ID_PATH . 'assets/js/wangov-id-login.js', $login_js_content);
}
register_activation_hook(__FILE__, 'wangov_id_activate');

/**
 * Load the plugin
 */
function wangov_id_init() {
    return WanGovID::get_instance();
}
add_action('plugins_loaded', 'wangov_id_init');
