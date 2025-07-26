const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/biometric/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
  }
});

// Mock biometric records
let mockBiometricRecords = [
  {
    id: 1,
    applicationId: 1,
    referenceNumber: 'CIT-1732508403000',
    applicantName: 'John Doe',
    captureDate: '2025-01-25T10:30:00Z',
    capturedBy: 'staff1',
    fingerprints: {
      leftThumb: 'captured',
      rightThumb: 'captured',
      leftIndex: 'captured',
      rightIndex: 'captured',
      quality: 'excellent'
    },
    photograph: {
      filename: 'photo-john-doe.jpg',
      quality: 'good',
      retakes: 0
    },
    signature: {
      filename: 'signature-john-doe.png',
      quality: 'excellent'
    },
    status: 'completed',
    verificationStatus: 'pending',
    notes: []
  }
];

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Start biometric capture session
router.post('/start-capture/:applicationId', requireAuth, (req, res) => {
  try {
    const { applicationId } = req.params;
    const { applicantName, referenceNumber } = req.body;

    // Check if biometric record already exists
    const existingRecord = mockBiometricRecords.find(record => 
      record.applicationId === parseInt(applicationId)
    );

    if (existingRecord) {
      return res.status(400).json({ error: 'Biometric capture already started for this application' });
    }

    const biometricRecord = {
      id: mockBiometricRecords.length + 1,
      applicationId: parseInt(applicationId),
      referenceNumber,
      applicantName,
      captureDate: new Date().toISOString(),
      capturedBy: req.session.user.username,
      fingerprints: {
        leftThumb: 'pending',
        rightThumb: 'pending',
        leftIndex: 'pending',
        rightIndex: 'pending',
        quality: null
      },
      photograph: {
        filename: null,
        quality: null,
        retakes: 0
      },
      signature: {
        filename: null,
        quality: null
      },
      status: 'in_progress',
      verificationStatus: 'pending',
      notes: []
    };

    mockBiometricRecords.push(biometricRecord);

    res.json({ success: true, biometricRecord });

  } catch (error) {
    console.error('Start biometric capture error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Capture fingerprints
router.post('/:id/fingerprints', requireAuth, (req, res) => {
  try {
    const { fingerprintData, quality } = req.body;
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    if (record.status === 'completed') {
      return res.status(400).json({ error: 'Biometric capture already completed' });
    }

    // Update fingerprint data
    record.fingerprints = {
      ...fingerprintData,
      quality: quality || 'good',
      capturedAt: new Date().toISOString()
    };

    record.notes.push({
      text: `Fingerprints captured with ${quality || 'good'} quality`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, fingerprints: record.fingerprints });

  } catch (error) {
    console.error('Capture fingerprints error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload photograph
router.post('/:id/photograph', requireAuth, upload.single('photograph'), (req, res) => {
  try {
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No photograph file uploaded' });
    }

    const { quality } = req.body;

    record.photograph = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      quality: quality || 'good',
      retakes: record.photograph.retakes || 0,
      uploadedAt: new Date().toISOString()
    };

    record.notes.push({
      text: `Photograph uploaded: ${req.file.originalname}`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, photograph: record.photograph });

  } catch (error) {
    console.error('Upload photograph error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload signature
router.post('/:id/signature', requireAuth, upload.single('signature'), (req, res) => {
  try {
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No signature file uploaded' });
    }

    const { quality } = req.body;

    record.signature = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      quality: quality || 'good',
      uploadedAt: new Date().toISOString()
    };

    record.notes.push({
      text: `Signature uploaded: ${req.file.originalname}`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, signature: record.signature });

  } catch (error) {
    console.error('Upload signature error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete biometric capture
router.post('/:id/complete', requireAuth, (req, res) => {
  try {
    const { notes } = req.body;
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    // Validate all biometric data is captured
    const hasFingerprints = record.fingerprints.quality !== null;
    const hasPhotograph = record.photograph.filename !== null;
    const hasSignature = record.signature.filename !== null;

    if (!hasFingerprints || !hasPhotograph || !hasSignature) {
      return res.status(400).json({ 
        error: 'All biometric data must be captured before completion',
        missing: {
          fingerprints: !hasFingerprints,
          photograph: !hasPhotograph,
          signature: !hasSignature
        }
      });
    }

    record.status = 'completed';
    record.completedAt = new Date().toISOString();
    record.completedBy = req.session.user.username;

    if (notes) {
      record.notes.push({
        text: notes,
        timestamp: new Date().toISOString(),
        staff: req.session.user.username
      });
    }

    record.notes.push({
      text: 'Biometric capture completed successfully',
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, biometricRecord: record });

  } catch (error) {
    console.error('Complete biometric capture error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get biometric record
router.get('/:id', requireAuth, (req, res) => {
  try {
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    res.json(record);

  } catch (error) {
    console.error('Get biometric record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get biometric record by application ID
router.get('/application/:applicationId', requireAuth, (req, res) => {
  try {
    const record = mockBiometricRecords.find(r => 
      r.applicationId === parseInt(req.params.applicationId)
    );

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found for this application' });
    }

    res.json(record);

  } catch (error) {
    console.error('Get biometric record by application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify biometric data
router.post('/:id/verify', requireAuth, (req, res) => {
  try {
    const { verificationStatus, verifierNotes } = req.body;
    const record = mockBiometricRecords.find(r => r.id === parseInt(req.params.id));

    if (!record) {
      return res.status(404).json({ error: 'Biometric record not found' });
    }

    if (record.status !== 'completed') {
      return res.status(400).json({ error: 'Biometric capture must be completed before verification' });
    }

    const validStatuses = ['approved', 'rejected', 'requires_recapture'];
    if (!validStatuses.includes(verificationStatus)) {
      return res.status(400).json({ error: 'Invalid verification status' });
    }

    record.verificationStatus = verificationStatus;
    record.verifiedAt = new Date().toISOString();
    record.verifiedBy = req.session.user.username;

    if (verifierNotes) {
      record.notes.push({
        text: `Verification: ${verifierNotes}`,
        timestamp: new Date().toISOString(),
        staff: req.session.user.username
      });
    }

    res.json({ success: true, biometricRecord: record });

  } catch (error) {
    console.error('Verify biometric data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
