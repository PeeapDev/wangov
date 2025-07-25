const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'wangov-db',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'wangovid',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to WanGov database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

/**
 * Get citizen by email
 */
async function getCitizenByEmail(email) {
  try {
    const query = `
      SELECT id, email, first_name, last_name, nin, password_hash, 
             is_verified, created_at, updated_at
      FROM citizens 
      WHERE email = $1 AND is_active = true
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching citizen by email:', error);
    
    // For development, return mock data if database is not available
    if (process.env.NODE_ENV === 'development') {
      return getMockCitizen(email);
    }
    
    throw error;
  }
}

/**
 * Get citizen by NIN (National Identification Number)
 */
async function getCitizenByNIN(nin) {
  try {
    const query = `
      SELECT id, email, first_name, last_name, nin, password_hash, 
             is_verified, created_at, updated_at
      FROM citizens 
      WHERE nin = $1 AND is_active = true
    `;
    const result = await pool.query(query, [nin]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching citizen by NIN:', error);
    
    // For development, return mock data if database is not available
    if (process.env.NODE_ENV === 'development') {
      return getMockCitizenByNIN(nin);
    }
    
    throw error;
  }
}

/**
 * Get citizen by ID
 */
async function getCitizenById(id) {
  try {
    const query = `
      SELECT id, email, first_name, last_name, nin, 
             is_verified, created_at, updated_at
      FROM citizens 
      WHERE id = $1 AND is_active = true
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching citizen by ID:', error);
    throw error;
  }
}

/**
 * Create authentication session
 */
async function createAuthSession(sessionId, citizenId, clientId) {
  try {
    const query = `
      INSERT INTO auth_sessions (session_id, citizen_id, client_id, created_at, expires_at)
      VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL '24 hours')
      ON CONFLICT (session_id) 
      DO UPDATE SET 
        citizen_id = $2,
        client_id = $3,
        created_at = NOW(),
        expires_at = NOW() + INTERVAL '24 hours'
    `;
    await pool.query(query, [sessionId, citizenId, clientId]);
  } catch (error) {
    console.error('Error creating auth session:', error);
    // Don't throw in development mode
    if (process.env.NODE_ENV !== 'development') {
      throw error;
    }
  }
}

/**
 * Mock data for development when database is not available
 */
function getMockCitizen(email) {
  // Only return mock data for @wangov.sl emails
  if (!email.endsWith('@wangov.sl')) {
    return null;
  }

  const bcrypt = require('bcryptjs');
  
  return {
    id: 'mock_citizen_1',
    email: email,
    first_name: 'John',
    last_name: 'Doe',
    nin: 'SL123456789',
    password_hash: bcrypt.hashSync('password123', 10), // Default password for demo
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date()
  };
}

function getMockCitizenByNIN(nin) {
  if (nin !== 'SL123456789') {
    return null;
  }

  const bcrypt = require('bcryptjs');
  
  return {
    id: 'mock_citizen_1',
    email: 'john.doe@wangov.sl',
    first_name: 'John',
    last_name: 'Doe',
    nin: nin,
    password_hash: bcrypt.hashSync('password123', 10),
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date()
  };
}

module.exports = {
  pool,
  getCitizenByEmail,
  getCitizenByNIN,
  getCitizenById,
  createAuthSession
};
