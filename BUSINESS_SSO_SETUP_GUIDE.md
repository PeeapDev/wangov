# WanGov Business SSO Setup Guide

## Overview

WanGov now provides **business-specific SSO** similar to Google Cloud Console, where each registered business can have its own SSO configuration and credentials.

## Architecture

### 1. **Business Registration** (Required First Step)
- Businesses must be registered and **approved** in the WanGov Organization Portal
- Only approved businesses can enable SSO
- Location: Organization Portal → Business Registration

### 2. **SSO Management** (New Dedicated Section)
- **Separate from API Integration** (API Keys are for data exchange)
- **Business-specific configurations** (each business gets unique credentials)
- Location: Organization Portal → SSO Management

### 3. **WordPress Plugin** (Simplified Configuration)
- Only requires: **Client ID** + **Client Secret**
- No hardcoded URLs or complex configuration
- Works with any business's SSO credentials

## Step-by-Step Setup

### Step 1: Register Your Business
1. Go to **Organization Portal → Business Registration**
2. Register your business with complete details
3. Wait for **approval** (required for SSO)

### Step 2: Enable SSO for Your Business
1. Go to **Organization Portal → SSO Management**
2. Find your **approved business** in the list
3. Click **"Enable SSO"**
4. Enter your **Authorized Redirect URIs**:
   ```
   https://yoursite.com/wangov-auth/callback
   https://app.yoursite.com/auth/callback
   ```
5. Click **"Enable SSO"**
6. **Copy your Client ID and Client Secret**

### Step 3: Configure WordPress Plugin
1. Install the **WanGov ID WordPress Plugin**
2. Go to **WordPress Admin → Settings → WanGov ID**
3. Enter your business-specific credentials:
   - **Client ID**: `wangov_yourbusiness_abc123def456`
   - **Client Secret**: `sk_live_yourbusiness_xyz789abc123`
4. **Enable** the integration
5. **Save Changes**

### Step 4: Test SSO
1. Add `[wangov_login_button]` to any page
2. Test the login flow
3. Users will authenticate with WanGov and be redirected back

## Key Features

### ✅ **Business-Specific Credentials**
- Each business gets unique Client ID and Secret
- Credentials are tied to specific business registration
- No shared or universal credentials

### ✅ **Approval-Based Access**
- Only approved businesses can enable SSO
- Ensures legitimate business verification
- Prevents unauthorized SSO usage

### ✅ **Usage Analytics**
- Track total logins per business
- Monitor last usage dates
- View SSO status and health

### ✅ **Easy Management**
- Enable/disable SSO per business
- Update redirect URIs as needed
- Delete SSO configurations when needed

## Security Features

### 🔒 **Business Verification**
- SSO only available for approved businesses
- Tied to official business registration
- Prevents fraudulent SSO usage

### 🔒 **Unique Credentials**
- Each business has isolated credentials
- No cross-business access
- Secure client secret management

### 🔒 **Redirect URI Validation**
- Only registered URIs are allowed
- Prevents redirect attacks
- Business-specific URI management

## Comparison with Google OAuth

| Feature | Google Cloud Console | WanGov SSO |
|---------|---------------------|------------|
| Project-based | ✅ Google Projects | ✅ Registered Businesses |
| Unique Credentials | ✅ Per Project | ✅ Per Business |
| Approval Process | ✅ Project Verification | ✅ Business Approval |
| Usage Analytics | ✅ Detailed Metrics | ✅ Login Tracking |
| Easy Integration | ✅ Simple Setup | ✅ WordPress Plugin |

## Migration from Old System

If you were using the old universal client system:

1. **Register your business** (if not already done)
2. **Enable SSO** for your specific business
3. **Update WordPress plugin** with new business-specific credentials
4. **Test the integration**

The old universal client will be deprecated in favor of business-specific SSO.

## Support

For issues with:
- **Business Registration**: Contact organization support
- **SSO Configuration**: Check SSO Management dashboard
- **WordPress Plugin**: Review plugin settings and logs
- **Authentication Issues**: Check SSO server debug logs

## Next Steps

1. **Complete business registration and approval**
2. **Enable SSO for your business**
3. **Configure WordPress plugin with business credentials**
4. **Test and deploy SSO integration**

This new system provides enterprise-grade SSO management similar to major OAuth providers while maintaining the simplicity of the WanGov ecosystem.
