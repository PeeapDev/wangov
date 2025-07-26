const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:3004',
    'http://sso.localhost:3004',
    'http://ncra.localhost:3003'
  ],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'ncra-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/appointments', require('./routes/appointments'));
// app.use('/api/biometric', require('./routes/biometric'));
app.use('/api/admin', require('./routes/admin'));
// app.use('/api/notifications', require('./routes/notifications'));

// Landing page route (public)
app.get('/', (req, res) => {
  if (req.session.user) {
    // If user is logged in, redirect to dashboard
    return res.redirect('/dashboard');
  }
  // Show public landing page
  res.render('landing-simple', { 
    title: 'NCRA - National Civil Registration Authority' 
  });
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  res.render('dashboard', { 
    user: req.session.user,
    title: 'NCRA Dashboard' 
  });
});

// Login page
app.get('/auth/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { 
    title: 'NCRA Login',
    error: null
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'NCRA Dashboard',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    error: 'The requested page could not be found.',
    statusCode: 404
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('NCRA Error:', err.stack);
  res.status(500).render('error', {
    title: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again later.' 
      : err.message,
    statusCode: 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏛️  NCRA Dashboard running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔐 Admin Login: http://localhost:${PORT}/auth/login`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
