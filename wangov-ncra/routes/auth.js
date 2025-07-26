const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Mock NCRA staff data (in production, this would come from database)
const mockStaff = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ncra.gov.sl',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    name: 'NCRA Administrator',
    center: 'NCRA Freetown Central'
  },
  {
    id: 2,
    username: 'staff1',
    email: 'staff1@ncra.gov.sl',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'staff',
    name: 'Registration Officer',
    center: 'NCRA Freetown Central'
  },
  {
    id: 3,
    username: 'supervisor',
    email: 'supervisor@ncra.gov.sl',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'supervisor',
    name: 'Registration Supervisor',
    center: 'NCRA Bo Regional Office'
  }
];

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = mockStaff.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      center: user.center
    };

    res.json({ 
      success: true, 
      user: req.session.user,
      redirect: '/'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ success: true, redirect: '/auth/login' });
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user: req.session.user });
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Find user
    const user = mockStaff.find(u => u.id === req.session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // In production, update password in database
    user.password = hashedPassword;

    res.json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
