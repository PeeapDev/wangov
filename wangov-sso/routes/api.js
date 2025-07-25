const express = require('express');
const { getCitizenById } = require('../services/database');

const router = express.Router();

// Get user info endpoint (for OAuth userinfo)
router.get('/userinfo', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const token = authHeader.substring(7);
    
    // Validate token (in production, this would be more sophisticated)
    if (!token.startsWith('wangov_access_')) {
      return res.status(401).json({ error: 'invalid_token' });
    }

    // For demo purposes, return mock user data
    // In production, you'd decode the token and fetch real user data
    const mockUser = {
      sub: 'citizen_123',
      email: 'john.doe@example.com',
      given_name: 'John',
      family_name: 'Doe',
      name: 'John Doe',
      preferred_username: 'john.doe',
      nin: 'SL123456789'
    };

    res.json(mockUser);

  } catch (error) {
    console.error('Userinfo error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

// Well-known OpenID configuration
router.get('/.well-known/openid_configuration', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/auth/authorize`,
    token_endpoint: `${baseUrl}/auth/token`,
    userinfo_endpoint: `${baseUrl}/api/userinfo`,
    jwks_uri: `${baseUrl}/api/jwks`,
    scopes_supported: ['openid', 'profile', 'email'],
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256']
  });
});

// JWKS endpoint (JSON Web Key Set)
router.get('/jwks', (req, res) => {
  // In production, this would return actual public keys
  res.json({
    keys: []
  });
});

module.exports = router;
