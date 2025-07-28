const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const oauthConfig = require('./config/oauth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3003',
    'http://mbsse.localhost:3003',
    'http://edsa.localhost:3003',
    /\.localhost:3003$/
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'wangov-sso-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'none', // Allow cross-site cookies for OAuth flow
    domain: 'localhost' // Allow sharing across subdomains
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Main SSO page - secured access only via OAuth flow
app.get('/', (req, res) => {
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
  const client = oauthConfig.getClient(client_id);
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
    client_name: client.name,
    client_domain: client.domain
  };

  res.render('login', {
    title: signup === 'true' ? 'WanGov ID - Create Account' : 'WanGov ID - Secure Authentication',
    oauth: req.session.oauth || null,
    error: req.query.error || null,
    message: req.query.message || null,
    signupMode: signup === 'true'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'WanGov SSO', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('SSO Error:', err);
  res.status(500).render('error', {
    title: 'Authentication Error',
    error: process.env.NODE_ENV === 'development' ? err : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    error: 'The requested page could not be found.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(` WanGov SSO Service running on http://localhost:3010`);
  console.log(` Health check: http://localhost:3010/health`);
});
