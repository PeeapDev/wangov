const express = require('express');
const router = express.Router();

// Mock data for admin functions
let mockCenters = [
  {
    id: 1,
    name: 'NCRA Freetown Central',
    address: '15 Siaka Stevens Street, Freetown',
    phone: '+232 22 123 456',
    email: 'freetown@ncra.gov.sl',
    manager: 'John Manager',
    capacity: 50,
    operatingHours: '08:00-17:00',
    status: 'active'
  },
  {
    id: 2,
    name: 'NCRA Bo Regional Office',
    address: 'Bo Town Center, Bo District',
    phone: '+232 32 123 456',
    email: 'bo@ncra.gov.sl',
    manager: 'Mary Supervisor',
    capacity: 30,
    operatingHours: '08:00-16:00',
    status: 'active'
  }
];

let mockStaff = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ncra.gov.sl',
    name: 'NCRA Administrator',
    role: 'admin',
    center: 'NCRA Freetown Central',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'staff1',
    email: 'staff1@ncra.gov.sl',
    name: 'Registration Officer',
    role: 'staff',
    center: 'NCRA Freetown Central',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  }
];

let mockIdCards = [
  {
    id: 1,
    applicationId: 1,
    referenceNumber: 'CIT-1732508403000',
    applicantName: 'John Doe',
    idNumber: 'SL123456789',
    type: 'citizen',
    status: 'design_approved',
    designedBy: 'admin',
    designedAt: '2025-01-26T10:00:00Z',
    printStatus: 'pending',
    issuedAt: null,
    expiryDate: '2030-01-26'
  }
];

// Middleware to check authentication and admin role
const requireAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.session.user.role !== 'admin' && req.session.user.role !== 'supervisor') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get all centers
router.get('/centers', requireAdmin, (req, res) => {
  try {
    res.json(mockCenters);
  } catch (error) {
    console.error('Get centers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new center
router.post('/centers', requireAdmin, (req, res) => {
  try {
    const { name, address, phone, email, manager, capacity, operatingHours } = req.body;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Required fields: name, address, phone, email' });
    }

    const newCenter = {
      id: mockCenters.length + 1,
      name,
      address,
      phone,
      email,
      manager: manager || '',
      capacity: capacity || 30,
      operatingHours: operatingHours || '08:00-17:00',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.session.user.username
    };

    mockCenters.push(newCenter);

    res.json({ success: true, center: newCenter });

  } catch (error) {
    console.error('Create center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update center
router.patch('/centers/:id', requireAdmin, (req, res) => {
  try {
    const center = mockCenters.find(c => c.id === parseInt(req.params.id));

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    const { name, address, phone, email, manager, capacity, operatingHours, status } = req.body;

    if (name) center.name = name;
    if (address) center.address = address;
    if (phone) center.phone = phone;
    if (email) center.email = email;
    if (manager) center.manager = manager;
    if (capacity) center.capacity = capacity;
    if (operatingHours) center.operatingHours = operatingHours;
    if (status) center.status = status;

    center.updatedAt = new Date().toISOString();
    center.updatedBy = req.session.user.username;

    res.json({ success: true, center });

  } catch (error) {
    console.error('Update center error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all staff
router.get('/staff', requireAdmin, (req, res) => {
  try {
    const { center, role, status } = req.query;
    let filteredStaff = [...mockStaff];

    if (center) {
      filteredStaff = filteredStaff.filter(s => s.center === center);
    }
    if (role) {
      filteredStaff = filteredStaff.filter(s => s.role === role);
    }
    if (status) {
      filteredStaff = filteredStaff.filter(s => s.status === status);
    }

    res.json(filteredStaff);

  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new staff member
router.post('/staff', requireAdmin, (req, res) => {
  try {
    const { username, email, name, role, center } = req.body;

    if (!username || !email || !name || !role || !center) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username or email already exists
    const existingStaff = mockStaff.find(s => s.username === username || s.email === email);
    if (existingStaff) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const newStaff = {
      id: mockStaff.length + 1,
      username,
      email,
      name,
      role,
      center,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: req.session.user.username
    };

    mockStaff.push(newStaff);

    res.json({ success: true, staff: newStaff });

  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update staff member
router.patch('/staff/:id', requireAdmin, (req, res) => {
  try {
    const staff = mockStaff.find(s => s.id === parseInt(req.params.id));

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const { name, role, center, status } = req.body;

    if (name) staff.name = name;
    if (role) staff.role = role;
    if (center) staff.center = center;
    if (status) staff.status = status;

    staff.updatedAt = new Date().toISOString();
    staff.updatedBy = req.session.user.username;

    res.json({ success: true, staff });

  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ID cards for approval
router.get('/id-cards', requireAdmin, (req, res) => {
  try {
    const { status, type } = req.query;
    let filteredCards = [...mockIdCards];

    if (status) {
      filteredCards = filteredCards.filter(card => card.status === status);
    }
    if (type) {
      filteredCards = filteredCards.filter(card => card.type === type);
    }

    res.json(filteredCards);

  } catch (error) {
    console.error('Get ID cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Approve ID card design
router.post('/id-cards/:id/approve', requireAdmin, (req, res) => {
  try {
    const { notes } = req.body;
    const idCard = mockIdCards.find(card => card.id === parseInt(req.params.id));

    if (!idCard) {
      return res.status(404).json({ error: 'ID card not found' });
    }

    idCard.status = 'approved';
    idCard.approvedAt = new Date().toISOString();
    idCard.approvedBy = req.session.user.username;
    idCard.printStatus = 'queued';

    if (notes) {
      idCard.approvalNotes = notes;
    }

    res.json({ success: true, idCard });

  } catch (error) {
    console.error('Approve ID card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reject ID card design
router.post('/id-cards/:id/reject', requireAdmin, (req, res) => {
  try {
    const { reason } = req.body;
    const idCard = mockIdCards.find(card => card.id === parseInt(req.params.id));

    if (!idCard) {
      return res.status(404).json({ error: 'ID card not found' });
    }

    if (!reason) {
      return res.status(400).json({ error: 'Rejection reason is required' });
    }

    idCard.status = 'rejected';
    idCard.rejectedAt = new Date().toISOString();
    idCard.rejectedBy = req.session.user.username;
    idCard.rejectionReason = reason;

    res.json({ success: true, idCard });

  } catch (error) {
    console.error('Reject ID card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark ID card as printed
router.post('/id-cards/:id/printed', requireAdmin, (req, res) => {
  try {
    const { batchNumber } = req.body;
    const idCard = mockIdCards.find(card => card.id === parseInt(req.params.id));

    if (!idCard) {
      return res.status(404).json({ error: 'ID card not found' });
    }

    if (idCard.status !== 'approved') {
      return res.status(400).json({ error: 'ID card must be approved before printing' });
    }

    idCard.printStatus = 'printed';
    idCard.printedAt = new Date().toISOString();
    idCard.printedBy = req.session.user.username;
    idCard.batchNumber = batchNumber;

    res.json({ success: true, idCard });

  } catch (error) {
    console.error('Mark ID card printed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Issue ID card to citizen
router.post('/id-cards/:id/issue', requireAdmin, (req, res) => {
  try {
    const { recipientSignature, notes } = req.body;
    const idCard = mockIdCards.find(card => card.id === parseInt(req.params.id));

    if (!idCard) {
      return res.status(404).json({ error: 'ID card not found' });
    }

    if (idCard.printStatus !== 'printed') {
      return res.status(400).json({ error: 'ID card must be printed before issuing' });
    }

    idCard.status = 'issued';
    idCard.issuedAt = new Date().toISOString();
    idCard.issuedBy = req.session.user.username;
    idCard.recipientSignature = recipientSignature;
    idCard.issuanceNotes = notes;

    res.json({ success: true, idCard });

  } catch (error) {
    console.error('Issue ID card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system statistics
router.get('/stats/system', requireAdmin, (req, res) => {
  try {
    const stats = {
      centers: {
        total: mockCenters.length,
        active: mockCenters.filter(c => c.status === 'active').length
      },
      staff: {
        total: mockStaff.length,
        active: mockStaff.filter(s => s.status === 'active').length,
        byRole: {
          admin: mockStaff.filter(s => s.role === 'admin').length,
          supervisor: mockStaff.filter(s => s.role === 'supervisor').length,
          staff: mockStaff.filter(s => s.role === 'staff').length
        }
      },
      idCards: {
        total: mockIdCards.length,
        pending: mockIdCards.filter(c => c.status === 'design_approved').length,
        approved: mockIdCards.filter(c => c.status === 'approved').length,
        printed: mockIdCards.filter(c => c.printStatus === 'printed').length,
        issued: mockIdCards.filter(c => c.status === 'issued').length
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
