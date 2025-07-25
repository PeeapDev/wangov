import { Router } from 'express';
import { authenticateCitizen } from '../middleware/authMiddleware';
import {
  authorizeRequest,
  generateToken,
  validateToken,
  revokeToken,
  getUserInfo,
  getServiceProviderMetadata,
  initiateLogin,
  handleCallback,
  logoutSso
} from '../controllers/sso.controller';

const router = Router();

// OAuth 2.0 / OpenID Connect endpoints
router.get('/authorize', initiateLogin);
router.post('/token', generateToken);
router.get('/userinfo', authenticateCitizen, getUserInfo);
router.post('/token/revoke', revokeToken);
router.get('/token/validate', validateToken);
router.get('/logout', logoutSso);

// OpenID Connect discovery endpoints
router.get('/.well-known/openid-configuration', (req, res) => {
  res.json({
    issuer: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso`,
    authorization_endpoint: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso/authorize`,
    token_endpoint: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso/token`,
    userinfo_endpoint: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso/userinfo`,
    jwks_uri: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso/.well-known/jwks.json`,
    response_types_supported: ['code', 'token', 'id_token', 'code token', 'code id_token', 'token id_token', 'code token id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid', 'profile', 'email', 'phone', 'address', 'offline_access'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    claims_supported: ['sub', 'iss', 'name', 'given_name', 'family_name', 'email', 'email_verified', 'phone_number', 'phone_number_verified'],
    grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
    service_documentation: `${process.env.BASE_URL || 'http://localhost:3000'}/docs/sso`,
    end_session_endpoint: `${process.env.BASE_URL || 'http://localhost:3000'}/api/sso/logout`
  });
});

// JWKS endpoint for verifying signatures
router.get('/.well-known/jwks.json', (req, res) => {
  // Return public keys for token verification
  // Implementation will be done in the controller
});

// SAML endpoints
router.get('/saml/metadata', getServiceProviderMetadata);
router.post('/saml/acs', handleCallback);
router.get('/saml/slo', logoutSso);

export default router;
