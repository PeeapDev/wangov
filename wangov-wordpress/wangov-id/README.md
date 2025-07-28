# WanGov ID WordPress Plugin

## Installation

1. Copy the `wangov-id` folder to your WordPress `wp-content/plugins/` directory
2. Activate the plugin in WordPress Admin → Plugins
3. Go to Settings → WanGov ID to configure

## Configuration

### Basic Settings

1. **SSO Server URL**: `http://localhost:3010` (for local development)
2. **Client ID**: `wangov-universal` (default universal client)
3. **Enable WanGov ID**: Check to enable the integration
4. **Auto Create Users**: Check to automatically create WordPress users
5. **Login Button Text**: Customize the button text

### Usage

#### Shortcodes

Add login button to any page/post:
```
[wangov_login_button]
```

Display user profile after login:
```
[wangov_user_profile]
```

#### Callback URL

Configure this callback URL in your WanGov SSO system:
```
http://your-wordpress-site.com/wangov-auth/callback
```

For local development:
```
http://localhost:8080/wangov-auth/callback
```

## Testing

1. Install and activate the plugin
2. Configure the settings
3. Add `[wangov_login_button]` to a page
4. Test the login flow

## Troubleshooting

- Check that the SSO server is running on the configured URL
- Verify the callback URL is registered in WanGov SSO
- Check WordPress error logs for authentication issues
- Ensure the client ID matches your SSO configuration
