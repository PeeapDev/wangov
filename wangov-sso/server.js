const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

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
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

// Main SSO page
app.get('/', (req, res) => {
  const { redirect_url, client_id, state, response_type } = req.query;
  
  // Store OAuth parameters in session
  if (redirect_url) {
    req.session.oauth = {
      redirect_url,
      client_id,
      state,
      response_type
    };
  }

  res.render('login', {
    title: 'WanGov ID - Secure Authentication',
    oauth: req.session.oauth || null,
    error: req.query.error || null,
    message: req.query.message || null
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
  console.log(`🔐 WanGov SSO Service running on http://sso.localhost:${PORT}`);
  console.log(`📊 Health check: http://sso.localhost:${PORT}/health`);
});
