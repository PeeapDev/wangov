const express = require('express');
const router = express.Router();

// Mock applications data
let mockApplications = [
  {
    id: 1,
    referenceNumber: 'CIT-1732508403000',
    type: 'citizen',
    status: 'pending_appointment',
    applicantName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+232 76 123 456',
    dateOfBirth: '1990-05-15',
    submittedAt: '2025-01-20T10:30:00Z',
    appointmentDate: '2025-01-25',
    appointmentTime: '10:00',
    center: 'NCRA Freetown Central',
    documents: {
      birthCertificate: 'uploaded',
      proofOfResidence: 'uploaded',
      parentIdCopy: null
    },
    notes: []
  },
  {
    id: 2,
    referenceNumber: 'RP-1732508404000',
    type: 'resident-permit',
    status: 'appointment_confirmed',
    applicantName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+232 77 987 654',
    nationality: 'Nigerian',
    submittedAt: '2025-01-19T14:20:00Z',
    appointmentDate: '2025-01-24',
    appointmentTime: '14:00',
    center: 'NCRA Freetown Central',
    documents: {
      passport: 'uploaded',
      visa: 'uploaded',
      medicalCertificate: 'uploaded',
      policeClearance: 'uploaded'
    },
    notes: [
      { text: 'Appointment confirmed via email', timestamp: '2025-01-20T09:00:00Z', staff: 'staff1' }
    ]
  }
];

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get all applications
router.get('/', requireAuth, (req, res) => {
  try {
    const { status, type, center, page = 1, limit = 10 } = req.query;
    
    let filteredApplications = [...mockApplications];

    // Apply filters
    if (status) {
      filteredApplications = filteredApplications.filter(app => app.status === status);
    }
    if (type) {
      filteredApplications = filteredApplications.filter(app => app.type === type);
    }
    if (center) {
      filteredApplications = filteredApplications.filter(app => app.center === center);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    res.json({
      applications: paginatedApplications,
      total: filteredApplications.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredApplications.length / limit)
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const application = mockApplications.find(app => app.id === parseInt(req.params.id));
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status
router.patch('/:id/status', requireAuth, (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = mockApplications.find(app => app.id === parseInt(req.params.id));
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const validStatuses = [
      'pending_appointment',
      'appointment_confirmed',
      'biometric_captured',
      'under_review',
      'approved',
      'rejected',
      'id_ready',
      'completed'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    application.status = status;
    application.updatedAt = new Date().toISOString();

    if (notes) {
      application.notes.push({
        text: notes,
        timestamp: new Date().toISOString(),
        staff: req.session.user.username
      });
    }

    res.json({ success: true, application });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Confirm appointment
router.post('/:id/confirm-appointment', requireAuth, (req, res) => {
  try {
    const { appointmentDate, appointmentTime, center } = req.body;
    const application = mockApplications.find(app => app.id === parseInt(req.params.id));
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.appointmentDate = appointmentDate;
    application.appointmentTime = appointmentTime;
    application.center = center;
    application.status = 'appointment_confirmed';
    application.updatedAt = new Date().toISOString();

    application.notes.push({
      text: `Appointment confirmed for ${appointmentDate} at ${appointmentTime}`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    // In production, send email/SMS notification here

    res.json({ success: true, application });

  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add notes to application
router.post('/:id/notes', requireAuth, (req, res) => {
  try {
    const { text } = req.body;
    const application = mockApplications.find(app => app.id === parseInt(req.params.id));
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Note text is required' });
    }

    const note = {
      text: text.trim(),
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    };

    application.notes.push(note);
    application.updatedAt = new Date().toISOString();

    res.json({ success: true, note });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get application statistics
router.get('/stats/overview', requireAuth, (req, res) => {
  try {
    const stats = {
      total: mockApplications.length,
      pending: mockApplications.filter(app => app.status === 'pending_appointment').length,
      confirmed: mockApplications.filter(app => app.status === 'appointment_confirmed').length,
      biometricCaptured: mockApplications.filter(app => app.status === 'biometric_captured').length,
      underReview: mockApplications.filter(app => app.status === 'under_review').length,
      approved: mockApplications.filter(app => app.status === 'approved').length,
      completed: mockApplications.filter(app => app.status === 'completed').length,
      rejected: mockApplications.filter(app => app.status === 'rejected').length,
      byType: {
        citizen: mockApplications.filter(app => app.type === 'citizen').length,
        residentPermit: mockApplications.filter(app => app.type === 'resident-permit').length
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
