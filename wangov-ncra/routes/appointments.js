const express = require('express');
const router = express.Router();

// Mock appointments data
let mockAppointments = [
  {
    id: 1,
    applicationId: 1,
    referenceNumber: 'CIT-1732508403000',
    applicantName: 'John Doe',
    type: 'citizen',
    date: '2025-01-25',
    time: '10:00',
    center: 'NCRA Freetown Central',
    status: 'scheduled',
    staffAssigned: null,
    checkInTime: null,
    completedTime: null,
    notes: []
  },
  {
    id: 2,
    applicationId: 2,
    referenceNumber: 'RP-1732508404000',
    applicantName: 'Jane Smith',
    type: 'resident-permit',
    date: '2025-01-24',
    time: '14:00',
    center: 'NCRA Freetown Central',
    status: 'confirmed',
    staffAssigned: 'staff1',
    checkInTime: null,
    completedTime: null,
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

// Get appointments for a specific date
router.get('/date/:date', requireAuth, (req, res) => {
  try {
    const { date } = req.params;
    const { center } = req.query;

    let appointments = mockAppointments.filter(apt => apt.date === date);

    if (center) {
      appointments = appointments.filter(apt => apt.center === center);
    }

    // Sort by time
    appointments.sort((a, b) => a.time.localeCompare(b.time));

    res.json(appointments);

  } catch (error) {
    console.error('Get appointments by date error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment by ID
router.get('/:id', requireAuth, (req, res) => {
  try {
    const appointment = mockAppointments.find(apt => apt.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);

  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check in appointment
router.post('/:id/checkin', requireAuth, (req, res) => {
  try {
    const appointment = mockAppointments.find(apt => apt.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'checked_in') {
      return res.status(400).json({ error: 'Appointment already checked in' });
    }

    appointment.status = 'checked_in';
    appointment.checkInTime = new Date().toISOString();
    appointment.staffAssigned = req.session.user.username;

    appointment.notes.push({
      text: 'Applicant checked in',
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, appointment });

  } catch (error) {
    console.error('Check in appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete biometric capture
router.post('/:id/complete-biometric', requireAuth, (req, res) => {
  try {
    const { biometricData } = req.body;
    const appointment = mockAppointments.find(apt => apt.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status !== 'checked_in') {
      return res.status(400).json({ error: 'Appointment must be checked in first' });
    }

    appointment.status = 'biometric_completed';
    appointment.completedTime = new Date().toISOString();
    appointment.biometricData = {
      fingerprints: biometricData?.fingerprints || 'captured',
      photograph: biometricData?.photograph || 'captured',
      signature: biometricData?.signature || 'captured',
      capturedBy: req.session.user.username,
      capturedAt: new Date().toISOString()
    };

    appointment.notes.push({
      text: 'Biometric data captured successfully',
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, appointment });

  } catch (error) {
    console.error('Complete biometric error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reschedule appointment
router.patch('/:id/reschedule', requireAuth, (req, res) => {
  try {
    const { date, time, reason } = req.body;
    const appointment = mockAppointments.find(apt => apt.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ error: 'Cannot reschedule completed appointment' });
    }

    const oldDate = appointment.date;
    const oldTime = appointment.time;

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'rescheduled';

    appointment.notes.push({
      text: `Appointment rescheduled from ${oldDate} ${oldTime} to ${date} ${time}. Reason: ${reason || 'Not specified'}`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, appointment });

  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel appointment
router.patch('/:id/cancel', requireAuth, (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = mockAppointments.find(apt => apt.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed appointment' });
    }

    appointment.status = 'cancelled';
    appointment.cancelledAt = new Date().toISOString();
    appointment.cancelledBy = req.session.user.username;

    appointment.notes.push({
      text: `Appointment cancelled. Reason: ${reason || 'Not specified'}`,
      timestamp: new Date().toISOString(),
      staff: req.session.user.username
    });

    res.json({ success: true, appointment });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available time slots for a date
router.get('/availability/:date', requireAuth, (req, res) => {
  try {
    const { date } = req.params;
    const { center } = req.query;

    // Standard time slots
    const standardSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];

    // Get booked slots for the date and center
    const bookedSlots = mockAppointments
      .filter(apt => 
        apt.date === date && 
        apt.center === center && 
        apt.status !== 'cancelled'
      )
      .map(apt => apt.time);

    // Return available slots
    const availableSlots = standardSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date,
      center,
      availableSlots,
      bookedSlots,
      totalSlots: standardSlots.length
    });

  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get appointment statistics
router.get('/stats/overview', requireAuth, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      today: {
        total: mockAppointments.filter(apt => apt.date === today).length,
        scheduled: mockAppointments.filter(apt => apt.date === today && apt.status === 'scheduled').length,
        checkedIn: mockAppointments.filter(apt => apt.date === today && apt.status === 'checked_in').length,
        completed: mockAppointments.filter(apt => apt.date === today && apt.status === 'biometric_completed').length
      },
      overall: {
        total: mockAppointments.length,
        scheduled: mockAppointments.filter(apt => apt.status === 'scheduled').length,
        confirmed: mockAppointments.filter(apt => apt.status === 'confirmed').length,
        completed: mockAppointments.filter(apt => apt.status === 'biometric_completed').length,
        cancelled: mockAppointments.filter(apt => apt.status === 'cancelled').length
      }
    };

    res.json(stats);

  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
