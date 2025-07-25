# WanGov SSO Service

A custom Single Sign-On (SSO) authentication service for the Sierra Leone Government's WanGov digital identity system. This service provides secure authentication for government provider portals and citizen services.

## 🏛️ Overview

The WanGov SSO service is built as a government-grade authentication system that:

- **Integrates with Citizen Database**: Uses existing WanGov citizen data for authentication
- **OAuth 2.0 Compatible**: Provides OAuth-like flows for provider portals
- **Multi-Method Login**: Supports both email and National ID Number (NIN) authentication
- **Government Branding**: Custom UI designed for Sierra Leone government services
- **Secure Sessions**: Enterprise-grade session management and security

## 🚀 Features

### Authentication Methods
- **Email + Password**: Standard email-based authentication
- **NIN + Password**: National ID Number-based authentication
- **Account Registration**: New citizen account creation (with verification workflow)

### OAuth 2.0 Flow
- Authorization code flow for provider portals
- Secure token exchange
- User info endpoint for profile data
- OpenID Connect compatible endpoints

### Security Features
- Bcrypt password hashing
- Secure session management
- CORS protection
- Input validation and sanitization
- Rate limiting (planned)

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (shared with main WanGov database)
- **Session Store**: Express sessions with secure cookies
- **Frontend**: Server-side rendered EJS templates with Tailwind CSS
- **Authentication**: Custom implementation with OAuth 2.0 compatibility

## 📁 Project Structure

```
wangov-sso/
├── server.js                 # Main Express server
├── routes/
│   ├── auth.js              # Authentication endpoints
│   └── api.js               # OAuth API endpoints
├── services/
│   └── database.js          # Database service layer
├── views/
│   ├── login.ejs            # Login page template
│   └── error.ejs            # Error page template
├── public/
│   └── js/
│       └── auth.js          # Frontend JavaScript
├── config/                  # Configuration files
├── Dockerfile              # Container configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (shared with WanGov main database)
- Docker (optional)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.local .env
   # Edit .env with your database credentials
   ```

3. **Start the Service**
   ```bash
   npm run dev
   ```

4. **Access the Service**
   - SSO Portal: http://sso.localhost:3004
   - Health Check: http://sso.localhost:3004/health

### Docker Deployment

The service is configured to run in Docker as part of the WanGov ecosystem:

```bash
# From the main WanGov directory
docker-compose up wangov-sso
```

## 🔐 Authentication Flow

### Provider Portal Integration

1. **Initiate SSO**: Provider portal redirects to SSO service
   ```
   http://sso.localhost:3004?redirect_url=http://mbsse.localhost:3003/login&client_id=provider_mbsse&state=random_state
   ```

2. **User Authentication**: Citizen logs in with email/NIN and password

3. **Authorization Code**: SSO service redirects back with auth code
   ```
   http://mbsse.localhost:3003/login?code=wangov_auth_code&state=random_state
   ```

4. **Token Exchange**: Provider exchanges code for access token
   ```bash
   POST /auth/token
   {
     "grant_type": "authorization_code",
     "code": "wangov_auth_code",
     "client_id": "provider_mbsse"
   }
   ```

5. **User Info**: Provider fetches user profile
   ```bash
   GET /api/userinfo
   Authorization: Bearer access_token
   ```

## 🌐 API Endpoints

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/token` - OAuth token exchange

### API Endpoints
- `GET /api/userinfo` - Get user profile (OAuth)
- `GET /api/.well-known/openid_configuration` - OpenID configuration
- `GET /api/jwks` - JSON Web Key Set

### Utility Endpoints
- `GET /health` - Service health check
- `GET /` - Main login page

## 🎨 Demo Credentials

For development and testing:

| Method | Credential | Value |
|--------|------------|-------|
| Email | Any email ending with | `@wangov.sl` |
| NIN | National ID Number | `SL123456789` |
| Password | Any password with | `password123` |

## 🔒 Security Considerations

### Production Deployment
- [ ] Use HTTPS/TLS encryption
- [ ] Configure secure session secrets
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable audit logging
- [ ] Configure proper CORS policies
- [ ] Use production database credentials

### Database Security
- [ ] Use connection pooling
- [ ] Implement prepared statements
- [ ] Regular security updates
- [ ] Database access controls

## 🧪 Testing

### Manual Testing
1. Visit http://sso.localhost:3004
2. Try login with demo credentials
3. Test registration flow
4. Verify OAuth redirect flow from provider portals

### Integration Testing
1. Start MBSSE provider portal: http://mbsse.localhost:3003
2. Click "Sign in with WanGov ID"
3. Verify redirect to SSO service
4. Complete authentication
5. Verify redirect back to provider portal

## 📊 Monitoring

### Health Checks
- Service health: `GET /health`
- Database connectivity: Automatic in health check
- Session store: Monitored via Express sessions

### Logging
- Authentication attempts
- OAuth flows
- Database errors
- Security events

## 🤝 Integration with WanGov Ecosystem

### Database Integration
- Connects to main WanGov PostgreSQL database
- Uses existing `citizens` table for authentication
- Shares user data with main application

### Provider Portal Integration
- OAuth 2.0 compatible flows
- Supports multiple provider subdomains
- Centralized authentication for all government services

### Future Enhancements
- [ ] Multi-factor authentication (MFA)
- [ ] Social login providers
- [ ] SAML 2.0 support
- [ ] Advanced audit logging
- [ ] User self-service password reset
- [ ] Account lockout policies

## 📞 Support

For technical support or questions about the WanGov SSO service:

- **Documentation**: See main WanGov project README
- **Issues**: Report via GitHub issues
- **Security**: Contact WanGov security team

---

**© 2025 Government of Sierra Leone - WanGov Digital Identity System**
