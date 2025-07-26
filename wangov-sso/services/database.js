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
 * Mock NCRA verified citizens database
 */
const mockNCRAVerifiedCitizens = {
  'john.doe@wangov.sl': {
    id: 'ncra_verified_001',
    email: 'john.doe@wangov.sl',
    first_name: 'John',
    last_name: 'Doe',
    nin: 'SL123456789',
    password_hash: null, // Will be set on first login
    is_verified: true,
    ncra_verified: true,
    ncra_verification_date: '2024-01-15',
    birth_date: '1990-05-15',
    place_of_birth: 'Freetown, Sierra Leone',
    created_at: new Date('2024-01-15'),
    updated_at: new Date()
  },
  'mary.kamara@wangov.sl': {
    id: 'ncra_verified_002',
    email: 'mary.kamara@wangov.sl',
    first_name: 'Mary',
    last_name: 'Kamara',
    nin: 'SL987654321',
    password_hash: null,
    is_verified: true,
    ncra_verified: true,
    ncra_verification_date: '2024-02-20',
    birth_date: '1985-08-22',
    place_of_birth: 'Bo, Sierra Leone',
    created_at: new Date('2024-02-20'),
    updated_at: new Date()
  },
  'admin@wangov.sl': {
    id: 'ncra_admin_001',
    email: 'admin@wangov.sl',
    first_name: 'System',
    last_name: 'Administrator',
    nin: 'SL000000001',
    password_hash: null,
    is_verified: true,
    ncra_verified: true,
    ncra_verification_date: '2024-01-01',
    birth_date: '1980-01-01',
    place_of_birth: 'Freetown, Sierra Leone',
    created_at: new Date('2024-01-01'),
    updated_at: new Date()
  }
};

/**
 * Mock data for development when database is not available
 */
function getMockCitizen(email) {
  const bcrypt = require('bcryptjs');
  
  // Check if user exists in NCRA verified database
  const citizen = mockNCRAVerifiedCitizens[email];
  if (citizen) {
    // Set default password if not set
    if (!citizen.password_hash) {
      citizen.password_hash = bcrypt.hashSync('password123', 10);
    }
    return citizen;
  }
  
  // For demo purposes, allow any @wangov.sl email
  if (email.endsWith('@wangov.sl')) {
    return {
      id: `mock_${email.split('@')[0]}`,
      email: email,
      first_name: 'Demo',
      last_name: 'User',
      nin: `SL${Math.random().toString().substr(2, 9)}`,
      password_hash: bcrypt.hashSync('password123', 10),
      is_verified: false, // Not NCRA verified
      ncra_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    };
  }
  
  return null;
}

function getMockCitizenByNIN(nin) {
  const bcrypt = require('bcryptjs');
  
  // Search through NCRA verified citizens by NIN
  for (const email in mockNCRAVerifiedCitizens) {
    const citizen = mockNCRAVerifiedCitizens[email];
    if (citizen.nin === nin) {
      // Set default password if not set
      if (!citizen.password_hash) {
        citizen.password_hash = bcrypt.hashSync('password123', 10);
      }
      return citizen;
    }
  }
  
  return null;
}

/**
 * Create new citizen account (signup)
 */
async function createCitizen(citizenData) {
  try {
    // In production, this would insert into database
    // For development, we'll simulate the process
    
    const { email, password, firstName, lastName, nin, birthDate, placeOfBirth } = citizenData;
    const bcrypt = require('bcryptjs');
    
    // Check if citizen already exists
    if (mockNCRAVerifiedCitizens[email]) {
      throw new Error('Citizen with this email already exists');
    }
    
    // Check if NIN is already registered
    for (const existingEmail in mockNCRAVerifiedCitizens) {
      if (mockNCRAVerifiedCitizens[existingEmail].nin === nin) {
        throw new Error('This NIN is already registered');
      }
    }
    
    // Create new citizen record
    const newCitizen = {
      id: `citizen_${Date.now()}`,
      email,
      first_name: firstName,
      last_name: lastName,
      nin,
      password_hash: bcrypt.hashSync(password, 10),
      is_verified: false, // Requires NCRA verification
      ncra_verified: false,
      birth_date: birthDate,
      place_of_birth: placeOfBirth,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Add to mock database
    mockNCRAVerifiedCitizens[email] = newCitizen;
    
    return newCitizen;
  } catch (error) {
    console.error('Error creating citizen:', error);
    throw error;
  }
}

module.exports = {
  pool,
  getCitizenByEmail,
  getCitizenByNIN,
  getCitizenById,
  createAuthSession,
  createCitizen
};
