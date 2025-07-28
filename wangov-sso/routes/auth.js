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

    // Special handling for demo accounts
    const isDemoAccount = email && [
      'john.doe@wangov.sl',
      'mary.kamara@wangov.sl',
      'admin@wangov.sl',
      'any.other.name@wangov.sl' // This matches the demo accounts listed on the login page
    ].includes(email);

    let isValidPassword = false;
    
    if (isDemoAccount && password === 'password123') {
      // Auto-validate password for demo accounts
      isValidPassword = true;
    } else {
      // Verify password for normal accounts
      try {
        isValidPassword = await bcrypt.compare(password, citizen.password_hash);
      } catch (passwordError) {
        console.error('Password verification error:', passwordError);
        // For demo accounts, fallback to default password
        if (process.env.NODE_ENV === 'development' && password === 'password123') {
          isValidPassword = true;
        }
      }
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = uuidv4();
    try {
      await createAuthSession(sessionId, citizen.id, req.session.oauth?.client_id);
    } catch (sessionError) {
      console.warn('Session creation warning (continuing):', sessionError.message);
      // Continue anyway in development mode
    }

    // Store user in session
    req.session.user = {
      id: citizen.id,
      email: citizen.email,
      firstName: citizen.first_name,
      lastName: citizen.last_name,
      nin: citizen.nin,
      sessionId
    };
    
    console.log('=== USER SESSION STORED ===');
    console.log('Stored user in session:', req.session.user);
    console.log('Session ID:', req.sessionID);

    // Handle OAuth redirect
    if (req.session.oauth && req.session.oauth.redirect_uri) {
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

// OAuth authorization endpoint
router.get('/authorize', (req, res) => {
  const { redirect_uri, client_id, state, response_type, scope, signup } = req.query;
  
  // Security: Only allow access with proper OAuth parameters
  if (!redirect_uri || !client_id || !state || !response_type) {
    return res.status(400).render('error', {
      title: 'Invalid Request',
      error: 'Missing required OAuth parameters',
      message: 'This service can only be accessed through authorized applications.',
      details: 'Required parameters: redirect_uri, client_id, state, response_type'
    });
  }

  // Validate client_id and redirect_uri
  const oauthConfig = require('../config/oauth');
  const subdomainMap = require('../config/subdomainMap');
  
  // Check if coming from a known subdomain
  let client = oauthConfig.getClient(client_id);
  let serviceInfo = null;
  
  // Try to detect the originating subdomain from the referrer or redirect_uri
  const referrer = req.get('Referrer');
  let subdomain = null;
  
  console.log('==== OAUTH DEBUG INFO ====');
  console.log('Client ID:', client_id);
  console.log('Redirect URI:', redirect_uri);
  console.log('Referrer:', referrer || 'none');
  
  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname;
      
      console.log('Referrer hostname:', hostname);
      
      // Extract subdomain from hostname (e.g., "edsa" from "edsa.localhost:3004")
      if (hostname.includes('.')) {
        subdomain = hostname.split('.')[0];
        console.log('Detected subdomain from referrer:', subdomain);
        serviceInfo = subdomainMap.getClientInfoBySubdomain(subdomain);
        if (serviceInfo) {
          console.log('Found service info from subdomain:', serviceInfo.name);
        } else {
          console.log('No service info found for subdomain:', subdomain);
        }
      } else {
        console.log('No subdomain found in referrer hostname');
      }
    } catch (error) {
      console.error('Error parsing referrer URL:', error);
    }
  } else {
    console.log('No referrer header found');
  }
  
  // If no subdomain found from referrer, try from redirect_uri
  if (!serviceInfo && redirect_uri) {
    try {
      const redirectUrl = new URL(redirect_uri);
      const hostname = redirectUrl.hostname;
      
      console.log('Redirect URI hostname:', hostname);
      
      if (hostname.includes('.')) {
        subdomain = hostname.split('.')[0];
        console.log('Detected subdomain from redirect URI:', subdomain);
        serviceInfo = subdomainMap.getClientInfoBySubdomain(subdomain);
        if (serviceInfo) {
          console.log('Found service info from redirect URI subdomain:', serviceInfo.name);
        } else {
          console.log('No service info found for redirect URI subdomain:', subdomain);
        }
      } else {
        console.log('No subdomain found in redirect URI hostname');
      }
    } catch (error) {
      console.error('Error parsing redirect URI:', error);
    }
  }
  
  // If we found subdomain info, use it for a better user experience
  if (serviceInfo) {
    console.log(`Detected service: ${serviceInfo.name} (${subdomain})`);
    // We'll still validate the provided client_id, but we'll show the more specific service name
  }
  
  if (!client) {
    return res.status(400).render('error', {
      title: 'Invalid Client',
      error: 'Unauthorized client application',
      message: `Client '${client_id}' is not registered with WanGov SSO.`,
      details: 'Please contact the application developer to register with WanGov SSO.'
    });
  }

  // Validate redirect URI
  if (!oauthConfig.validateRedirectUri(client_id, redirect_uri)) {
    return res.status(400).render('error', {
      title: 'Invalid Redirect URI',
      error: 'Unauthorized redirect URI',
      message: `The redirect URI '${redirect_uri}' is not registered for client '${client.name}'.`,
      details: 'Please contact the application developer to register the correct redirect URI.'
    });
  }

  // Validate requested scopes
  const requestedScopes = scope ? scope.split(' ') : ['profile', 'email'];
  if (!oauthConfig.validateScopes(client_id, requestedScopes)) {
    return res.status(400).render('error', {
      title: 'Invalid Scope',
      error: 'Unauthorized scope requested',
      message: `Some requested scopes are not authorized for client '${client.name}'.`,
      details: `Available scopes: ${client.scopes.join(', ')}` 
    });
  }

  // Store OAuth parameters in session
  req.session.oauth = {
    redirect_uri,
    client_id,
    state,
    response_type,
    scope: requestedScopes.join(' '),
    // Use the more specific service name if available from subdomain detection
    client_name: serviceInfo ? serviceInfo.name : client.name,
    client_domain: serviceInfo ? serviceInfo.domain : client.domain
  };

  // Log which service name we're using
  console.log(`OAuth login request from: ${req.session.oauth.client_name}`);
  
  // **CRITICAL SSO FIX**: Check if user is already authenticated
  // This is what makes it a true SSO - if user is logged in, skip login form
  console.log('=== SSO SESSION CHECK ===');
  console.log('Session exists:', !!req.session);
  console.log('Session user exists:', !!req.session.user);
  console.log('Session user ID:', req.session.user?.id);
  console.log('Full session user:', req.session.user);
  
  if (req.session.user && req.session.user.id) {
    console.log('User already authenticated, skipping login form');
    console.log('Authenticated user:', req.session.user.email);
    
    // Generate authorization code immediately
    const authCode = `wangov_auth_${Date.now()}_${Math.random().toString(36).substr(2, 15)}`;
    
    // Store authorization data for token exchange
    req.session.authCode = {
      code: authCode,
      client_id: client_id,
      redirect_uri: redirect_uri,
      scope: requestedScopes.join(' '),
      user: req.session.user,
      expires: Date.now() + (10 * 60 * 1000) // 10 minutes
    };
    
    // Redirect immediately back to the client with the authorization code
    const redirectUrl = new URL(redirect_uri);
    redirectUrl.searchParams.set('code', authCode);
    redirectUrl.searchParams.set('state', state);
    
    console.log('Redirecting authenticated user back to:', redirectUrl.toString());
    return res.redirect(redirectUrl.toString());
  }
  
  // User is not authenticated, show login form
  console.log('User not authenticated, showing login form');
  res.render('login', {
    title: signup === 'true' ? 'WanGov ID - Create Account' : 'WanGov ID - Secure Authentication',
    oauth: req.session.oauth || null,
    error: req.query.error || null,
    message: req.query.message || null,
    signupMode: signup === 'true'
  });
});

// SSO Logout endpoint
router.post('/logout', (req, res) => {
  console.log('SSO logout requested');
  
  // Clear the user session
  if (req.session.user) {
    console.log('Logging out user:', req.session.user.email);
    delete req.session.user;
  }
  
  // Clear OAuth session data
  delete req.session.oauth;
  delete req.session.authCode;
  
  // Destroy the entire session
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    console.log('SSO session destroyed successfully');
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// SSO Status endpoint - check if user is logged in
router.get('/status', (req, res) => {
  if (req.session.user && req.session.user.id) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.user.id,
        email: req.session.user.email,
        name: `${req.session.user.firstName} ${req.session.user.lastName}`,
        nin: req.session.user.nin
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
