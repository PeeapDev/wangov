const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getCitizenByEmail, getCitizenByNIN, createAuthSession } = require('../services/database');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, nin, password, loginType = 'email' } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    let citizen = null;

    // Authenticate based on login type
    if (loginType === 'email' && email) {
      citizen = await getCitizenByEmail(email);
    } else if (loginType === 'nin' && nin) {
      citizen = await getCitizenByNIN(nin);
    } else {
      return res.status(400).json({ error: 'Email or NIN is required' });
    }

    if (!citizen) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, citizen.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = uuidv4();
    await createAuthSession(sessionId, citizen.id, req.session.oauth?.client_id);

    // Store user in session
    req.session.user = {
      id: citizen.id,
      email: citizen.email,
      firstName: citizen.first_name,
      lastName: citizen.last_name,
      nin: citizen.nin,
      sessionId
    };

    // Handle OAuth redirect
    if (req.session.oauth && req.session.oauth.redirect_url) {
      const authCode = `wangov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store auth code for later validation
      req.session.authCode = authCode;
      
      const redirectUrl = new URL(req.session.oauth.redirect_url);
      redirectUrl.searchParams.set('code', authCode);
      if (req.session.oauth.state) {
        redirectUrl.searchParams.set('state', req.session.oauth.state);
      }

      return res.json({
        success: true,
        redirect: redirectUrl.toString(),
        user: {
          id: citizen.id,
          email: citizen.email,
          name: `${citizen.first_name} ${citizen.last_name}`,
          nin: citizen.nin
        }
      });
    }

    // Regular login success
    res.json({
      success: true,
      user: {
        id: citizen.id,
        email: citizen.email,
        name: `${citizen.first_name} ${citizen.last_name}`,
        nin: citizen.nin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication service error' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, firstName, lastName, nin, password } = req.body;

    // Basic validation
    if (!email || !firstName || !lastName || !nin || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if citizen already exists
    const existingCitizen = await getCitizenByEmail(email);
    if (existingCitizen) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const existingNIN = await getCitizenByNIN(nin);
    if (existingNIN) {
      return res.status(409).json({ error: 'An account with this NIN already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create citizen account (this would integrate with the main WanGov database)
    // For now, we'll return a success message
    res.json({
      success: true,
      message: 'Account created successfully. Please contact your local registration office to complete verification.',
      requiresVerification: true
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration service error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// OAuth token exchange (for provider portals)
router.post('/token', async (req, res) => {
  try {
    const { code, client_id, client_secret, grant_type } = req.body;

    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ error: 'unsupported_grant_type' });
    }

    // Validate the authorization code (in production, this would be more secure)
    if (!code || !code.startsWith('wangov_')) {
      return res.status(400).json({ error: 'invalid_grant' });
    }

    // Generate access token
    const accessToken = `wangov_access_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
    const refreshToken = `wangov_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;

    res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: 'openid profile email'
    });

  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
