const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getCitizenByEmail, getCitizenByNIN, createAuthSession, createCitizen } = require('../services/database');

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
      
      // Store the authorization code temporarily (in production, use Redis or database)
      req.session.authCode = {
        code: authCode,
        user: {
          id: citizen.id,
          email: citizen.email,
          name: `${citizen.first_name} ${citizen.last_name}`,
          nin: citizen.nin,
          phone: citizen.phone_number,
          isVerified: citizen.is_ncra_verified
        },
        client_id: req.session.oauth?.client_id,
        scope: req.session.oauth?.scope
      };

      res.json({
        success: true,
        message: 'Login successful',
        authCode: authCode,
        redirectUrl: req.session.oauth?.redirect_uri,
        state: req.session.oauth?.state,
        user: {
          id: citizen.id,
          email: citizen.email,
          name: `${citizen.first_name} ${citizen.last_name}`,
          nin: citizen.nin,
          phone: citizen.phone_number,
          isVerified: citizen.is_ncra_verified
        }
      });
    } else {
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
    }

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

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, nin, password, confirmPassword, birthDate, placeOfBirth } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !nin || !password || !confirmPassword || !birthDate || !placeOfBirth) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate NIN format (Sierra Leone format: SL followed by 9 digits)
    const ninRegex = /^SL\d{9}$/;
    if (!ninRegex.test(nin)) {
      return res.status(400).json({ error: 'Invalid NIN format. Must be SL followed by 9 digits' });
    }

    // Create new citizen
    const newCitizen = await createCitizen({
      firstName,
      lastName,
      email,
      nin,
      password,
      birthDate,
      placeOfBirth
    });

    // Create session for the new user
    const sessionId = uuidv4();
    await createAuthSession(sessionId, newCitizen.id, req.session.oauth?.client_id);

    // Store user in session
    req.session.user = {
      id: newCitizen.id,
      email: newCitizen.email,
      firstName: newCitizen.first_name,
      lastName: newCitizen.last_name,
      nin: newCitizen.nin,
      ncraVerified: newCitizen.ncra_verified,
      sessionId
    };

    // Generate authorization code for OAuth flow
    const authCode = `wangov_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
    req.session.authCode = authCode;

    res.json({
      success: true,
      message: 'Account created successfully! Please note: Your account requires NCRA verification for full access.',
      user: {
        id: newCitizen.id,
        email: newCitizen.email,
        firstName: newCitizen.first_name,
        lastName: newCitizen.last_name,
        ncraVerified: newCitizen.ncra_verified
      },
      authCode,
      redirectUrl: req.session.oauth?.redirect_url
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message.includes('already exists') || error.message.includes('already registered')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// OAuth token exchange endpoint
router.post('/token', async (req, res) => {
  try {
    const { code, client_id, grant_type } = req.body;

    if (grant_type !== 'authorization_code') {
      return res.status(400).json({ 
        error: 'unsupported_grant_type',
        error_description: 'Only authorization_code grant type is supported'
      });
    }

    if (!client_id) {
      return res.status(400).json({ 
        error: 'invalid_client',
        error_description: 'Client ID is required'
      });
    }

    // Find the stored authorization code in session
    // In production, this would be stored in Redis or database
    const storedAuth = req.session.authCode;
    if (!storedAuth || storedAuth.code !== code) {
      return res.status(400).json({ 
        error: 'invalid_grant',
        error_description: 'Invalid or expired authorization code'
      });
    }

    // Validate client_id matches
    if (storedAuth.client_id !== client_id) {
      return res.status(400).json({ 
        error: 'invalid_client',
        error_description: 'Client ID mismatch'
      });
    }

    // Generate tokens
    const accessToken = `wangov_access_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
    const refreshToken = `wangov_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;

    // Clear the used authorization code
    delete req.session.authCode;

    // Return tokens and user data
    res.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: storedAuth.scope || 'profile email',
      user: storedAuth.user
    });

  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

module.exports = router;
