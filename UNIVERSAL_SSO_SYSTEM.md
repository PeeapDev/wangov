# Universal WanGov SSO System - Complete Implementation

## 🎯 **System Overview**

The **Universal WanGov SSO** is a dynamic, scalable single sign-on system that automatically handles authentication for any subdomain or organization without requiring hardcoded configurations. This eliminates the need to manually register every provider portal or subdomain.

---

## 🏗️ **Architecture**

### **Core Components:**
1. **Universal OAuth Client** (`wangov-universal`)
2. **Dynamic Redirect URI Validation**
3. **Automatic Subdomain Recognition**
4. **Centralized User Management via NCRA**

### **How It Works:**
```
Any Organization/Subdomain
    ↓
Click "Sign in with WanGov"
    ↓
Redirects to sso.localhost:3010 (Universal SSO)
    ↓
Shows Login/Register Popup
    ↓
User authenticates via NCRA database
    ↓
Redirects back to original site with success/failure
```

---

## ⚙️ **Technical Implementation**

### **1. Universal OAuth Client Configuration**
```javascript
'wangov-universal': {
  name: 'WanGov Universal SSO',
  domain: '*', // Wildcard for all domains
  redirectUris: [
    // Production patterns
    'https://*.wangov.sl/auth/callback',
    'https://*.gov.sl/auth/callback',
    // Development patterns  
    'http://localhost:3004/auth/callback',
    'http://*.localhost:3004/auth/callback'
  ],
  scopes: ['profile', 'email', 'organization_access', 'government_access', 'nin'],
  trusted: true,
  universal: true // Flag for universal client
}
```

### **2. Dynamic Redirect URI Validation**
The system automatically validates redirect URIs based on patterns:

**✅ Allowed Patterns:**
- `http://localhost:3004/auth/callback` (main site)
- `http://*.localhost:3004/auth/callback` (any subdomain)
- `https://*.wangov.sl/auth/callback` (production subdomains)
- `https://*.gov.sl/auth/callback` (government domains)

**❌ Blocked Patterns:**
- Wrong ports or protocols
- Non-callback endpoints
- Unauthorized domains

### **3. Frontend Integration**
All login pages now use the universal client:
```typescript
const clientId = 'wangov-universal'; // Works for any subdomain
const currentUrl = window.location.origin + '/auth/callback';
const ssoUrl = `http://localhost:3010/?client_id=${clientId}&redirect_uri=${currentUrl}&...`;
```

---

## 🌐 **Supported Access Patterns**

### **Development Environment:**
| URL | Status | Description |
|-----|--------|-------------|
| `http://localhost:3004` | ✅ | Main portal |
| `http://nacsa.localhost:3004` | ✅ | NACSA provider portal |
| `http://tax.localhost:3004` | ✅ | Tax Authority portal |
| `http://education.localhost:3004` | ✅ | Education Ministry portal |
| `http://health.localhost:3004` | ✅ | Health Ministry portal |
| `http://[any].localhost:3004` | ✅ | Any provider subdomain |

### **Production Environment:**
| URL Pattern | Status | Description |
|-------------|--------|-------------|
| `https://wangov.sl` | ✅ | Main portal |
| `https://nacsa.wangov.sl` | ✅ | NACSA portal |
| `https://tax.wangov.sl` | ✅ | Tax portal |
| `https://[any].wangov.sl` | ✅ | Any provider portal |
| `https://[any].gov.sl` | ✅ | Government portals |

---

## 🔐 **Authentication Flow**

### **Step-by-Step Process:**

1. **User Access**: User visits any portal (e.g., `nacsa.localhost:3004`)
2. **Login Trigger**: User clicks "Sign in with WanGov"
3. **SSO Redirect**: Browser redirects to `localhost:3010` with:
   - `client_id=wangov-universal`
   - `redirect_uri=http://nacsa.localhost:3004/auth/callback`
   - `state=random_token`
4. **URI Validation**: SSO server validates redirect URI dynamically
5. **Login Form**: SSO shows unified login/register popup
6. **Authentication**: User credentials verified against NCRA database
7. **Token Generation**: SSO generates access tokens
8. **Callback**: Browser redirects back to original portal with auth code
9. **Token Exchange**: Frontend exchanges auth code for access tokens
10. **Login Complete**: User is authenticated on original portal

---

## 🎨 **User Experience**

### **Seamless Integration:**
- **Single Button**: Every portal shows "Sign in with WanGov"
- **Popup Experience**: Login appears in clean popup window
- **Automatic Return**: User returns to original portal after authentication
- **Consistent Branding**: WanGov branding across all authentication flows

### **Multi-Portal Support:**
- **Provider Branding**: Each portal maintains its own visual identity
- **Shared Authentication**: All portals use the same WanGov credentials
- **Cross-Portal Sessions**: Login once, access all authorized portals

---

## 🔧 **Configuration Files**

### **SSO Server (`/wangov-sso/`):**
- `config/oauth.js` - Universal client configuration
- `server.js` - Main SSO server (port 3010)
- `routes/auth.js` - Authentication endpoints

### **Frontend (`/wangov-id/frontend/src/`):**
- `pages/auth/OAuthCallback.tsx` - Universal callback handler
- `pages/*/Login.tsx` - All login pages use universal client
- `utils/subdomainHandler.ts` - Subdomain detection and routing

---

## 🧪 **Testing the System**

### **1. Test NACSA Portal:**
```bash
# Access NACSA portal
open http://nacsa.localhost:3004

# Click "Sign in with WanGov"
# Should redirect to localhost:3010
# Complete login and return to NACSA portal
```

### **2. Test Universal SSO:**
```bash
# Test SSO health
curl http://localhost:3010/health

# Test universal client validation
curl "http://localhost:3010/?client_id=wangov-universal&redirect_uri=http://nacsa.localhost:3004/auth/callback&response_type=code&scope=profile%20email&state=test123"
```

### **3. Test Multiple Portals:**
- Visit different provider subdomains
- Each should have "Sign in with WanGov" button
- All should redirect to the same SSO server
- All should work without additional configuration

---

## 🚀 **Adding New Organizations**

### **Automatic Process:**
1. **Create Provider**: Use SuperAdmin interface to create new provider
2. **Generate Subdomain**: System automatically creates subdomain
3. **Add to Hosts**: Add subdomain to local hosts file (development)
4. **Ready to Use**: SSO automatically works - no additional configuration needed!

### **Example - Adding "Ministry of Agriculture":**
```bash
# 1. Create provider in SuperAdmin interface
# 2. Add to hosts file
echo "127.0.0.1    agriculture.localhost" | sudo tee -a /etc/hosts

# 3. Access immediately
open http://agriculture.localhost:3004
# "Sign in with WanGov" works automatically!
```

---

## 🔒 **Security Features**

### **Dynamic Validation:**
- ✅ Automatic redirect URI pattern matching
- ✅ State parameter validation
- ✅ CSRF protection
- ✅ Secure token exchange

### **Centralized Authentication:**
- ✅ Single source of truth (NCRA database)
- ✅ Consistent security policies
- ✅ Audit trail for all logins
- ✅ Session management

---

## 📊 **System Status**

### **Current Configuration:**
- **SSO Server**: `localhost:3010` ✅ Running
- **Frontend**: `localhost:3004` ✅ Running
- **Backend**: `localhost:3001` ✅ Running

### **Active Features:**
- ✅ Universal OAuth client
- ✅ Dynamic redirect URI validation
- ✅ Multi-tenant subdomain routing
- ✅ Automatic provider recognition
- ✅ NCRA database integration
- ✅ Token-based authentication

---

## 🎉 **Benefits Achieved**

### **For Developers:**
- **No Hardcoding**: No need to register every subdomain
- **Automatic Scaling**: New providers work immediately
- **Consistent API**: Same authentication flow everywhere
- **Easy Maintenance**: Single SSO configuration

### **For Users:**
- **Unified Experience**: Same login across all portals
- **Single Credentials**: One WanGov account for everything
- **Seamless Navigation**: Login once, access all authorized services
- **Consistent Security**: Same security standards everywhere

### **For Organizations:**
- **Quick Setup**: New portals work immediately
- **Brand Consistency**: WanGov authentication with provider branding
- **Centralized Management**: All users managed through NCRA
- **Scalable Architecture**: Supports unlimited providers

---

## 🔮 **Next Steps**

1. **Production Deployment**: Configure real domains and SSL certificates
2. **Advanced Permissions**: Role-based access control per organization
3. **Analytics Integration**: Track authentication across all portals
4. **Mobile Support**: Extend universal SSO to mobile applications
5. **Third-Party Integration**: Allow external services to use WanGov SSO

---

## ✅ **Summary**

🎯 **The Universal WanGov SSO system is now complete and operational!**

- **No more hardcoded redirect URIs**
- **Automatic support for any subdomain**
- **Single configuration handles all providers**
- **NACSA portal working perfectly**
- **Ready for unlimited scaling**

The system now truly embodies the vision of a **universal, scalable SSO solution** that grows automatically with the WanGov ecosystem! 🚀
