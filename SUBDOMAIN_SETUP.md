# WanGov Subdomain Setup Guide

## 🎯 Unified Digital Identity Architecture

The WanGov platform uses a unified subdomain architecture where:
- **Main Portal**: `wangov.sl` - NCRA Digital Identity & SSO
- **Finance Portal**: `finance.wangov.sl` - Tax & Financial Services  
- **Health Portal**: `health.wangov.sl` - Healthcare Services
- **Education Portal**: `education.wangov.sl` - Education Services
- **EDSA Portal**: `edsa.wangov.sl` - Electricity Services
- **NASSIT Portal**: `nassit.wangov.sl` - Social Security

## 🚀 Production Subdomain Setup Options

### Option 1: Custom Domain + Wildcard DNS (Recommended)

#### Step 1: Get a Custom Domain
- Register `wangov.sl` or `wangov.gov.sl` 
- Or use any domain you own (e.g., `wangov.com`)

#### Step 2: Configure DNS
Add these DNS records:
```
Type    Name        Value
A       @           [Railway IP]
CNAME   *           wangov.sl
```

#### Step 3: Configure Railway
```bash
# Add custom domain in Railway dashboard
railway domain add wangov.sl
railway domain add *.wangov.sl
```

### Option 2: Cloudflare Tunnel (Quick Setup)

#### Step 1: Install Cloudflare Tunnel
```bash
# Install cloudflared
brew install cloudflared
# or
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
```

#### Step 2: Create Tunnel
```bash
cloudflared tunnel login
cloudflared tunnel create wangov
```

#### Step 3: Configure Subdomains
Create `config.yml`:
```yaml
tunnel: wangov
credentials-file: ~/.cloudflared/wangov.json

ingress:
  - hostname: wangov.sl
    service: https://wangov-production.up.railway.app
  - hostname: finance.wangov.sl  
    service: https://wangov-production.up.railway.app
  - hostname: health.wangov.sl
    service: https://wangov-production.up.railway.app
  - hostname: education.wangov.sl
    service: https://wangov-production.up.railway.app
  - hostname: edsa.wangov.sl
    service: https://wangov-production.up.railway.app
  - hostname: nassit.wangov.sl
    service: https://wangov-production.up.railway.app
  - service: http_status:404
```

#### Step 4: Run Tunnel
```bash
cloudflared tunnel --config config.yml run wangov
```

### Option 3: Multiple Railway Services

Deploy each subdomain as a separate Railway service:
```bash
# Deploy finance portal
cd wangov-finance
railway up

# Deploy health portal  
cd wangov-health
railway up

# etc.
```

## 🔧 Backend Subdomain Detection

The backend already supports subdomain detection:

```typescript
// In subdomainHandler.ts
export const getSubdomain = (): string | null => {
  const { hostname } = window.location;
  
  // Production: finance.wangov.sl → "finance"
  // Development: finance.localhost → "finance"
  
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0] === 'www' ? null : parts[0];
  }
  return null;
};
```

## 🎨 Provider Portal Features

Each subdomain provides:
- **Unified SSO** with main NCRA system
- **Provider-specific branding** and themes
- **Service-specific dashboards** and tools
- **Integrated payment** and transaction systems
- **Citizen service** access and management

## 📱 Mobile App Integration

The subdomain architecture also supports:
- **Deep linking** to specific services
- **Cross-service navigation** with maintained authentication
- **Provider-specific** mobile app experiences

## 🔐 Security & Authentication Flow

1. **Citizen logs in** at main portal (`wangov.sl`)
2. **SSO token** is issued by NCRA system
3. **Citizen visits** service portal (`finance.wangov.sl`)
4. **Token is validated** against central NCRA system
5. **Service-specific** permissions are applied
6. **Seamless experience** across all government services

## 🚀 Next Steps

1. Choose your preferred subdomain setup option
2. Configure DNS/tunneling as needed
3. Test subdomain routing and SSO integration
4. Deploy provider-specific services
5. Configure custom domains for production

## 📞 Support

For subdomain setup assistance:
- Check Railway documentation for custom domains
- Contact your DNS provider for wildcard support
- Use Cloudflare for advanced routing needs
