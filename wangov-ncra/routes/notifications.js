const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const router = express.Router();

// Configure email transporter (using mock for development)
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'demo@ncra.gov.sl',
    pass: process.env.SMTP_PASS || 'demo-password'
  }
});

// Configure Twilio (using mock for development)
const twilioClient = process.env.TWILIO_ACCOUNT_SID 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Mock notification history
let notificationHistory = [
  {
    id: 1,
    type: 'email',
    recipient: 'john.doe@example.com',
    subject: 'Appointment Confirmation',
    message: 'Your appointment has been confirmed for January 25, 2025 at 10:00 AM',
    status: 'sent',
    sentAt: '2025-01-20T10:00:00Z',
    applicationId: 1
  },
  {
    id: 2,
    type: 'sms',
    recipient: '+23276123456',
    message: 'Your WanGov ID appointment is confirmed for Jan 25 at 10:00 AM at NCRA Freetown Central. Ref: CIT-1732508403000',
    status: 'sent',
    sentAt: '2025-01-20T10:05:00Z',
    applicationId: 1
  }
];

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Send appointment confirmation
router.post('/appointment-confirmation', requireAuth, async (req, res) => {
  try {
    const { applicationId, email, phone, applicantName, appointmentDate, appointmentTime, center, referenceNumber } = req.body;

    if (!applicationId || !email || !applicantName || !appointmentDate || !appointmentTime || !center) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const results = { email: null, sms: null };

    // Send email confirmation
    try {
      const emailSubject = 'WanGov ID Appointment Confirmation';
      const emailBody = `
Dear ${applicantName},

Your appointment for WanGov ID registration has been confirmed.

Appointment Details:
- Date: ${appointmentDate}
- Time: ${appointmentTime}
- Location: ${center}
- Reference Number: ${referenceNumber}

Please bring the following documents:
- Original birth certificate or proof of citizenship
- Proof of residence (utility bill, rental agreement)
- Two passport-sized photographs
- Valid identification

Important Notes:
- Arrive 15 minutes before your appointment
- Bring original documents for verification
- Processing fee will be collected at the center

If you need to reschedule, please contact us at +232 76 123 456.

Best regards,
National Civil Registration Authority (NCRA)
Government of Sierra Leone
      `;

      if (process.env.NODE_ENV === 'production' && emailTransporter) {
        await emailTransporter.sendMail({
          from: 'NCRA <noreply@ncra.gov.sl>',
          to: email,
          subject: emailSubject,
          text: emailBody
        });
        results.email = 'sent';
      } else {
        console.log('Mock Email Sent:', { to: email, subject: emailSubject });
        results.email = 'sent_mock';
      }

      // Log email notification
      notificationHistory.push({
        id: notificationHistory.length + 1,
        type: 'email',
        recipient: email,
        subject: emailSubject,
        message: emailBody,
        status: results.email,
        sentAt: new Date().toISOString(),
        applicationId,
        sentBy: req.session.user.username
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      results.email = 'failed';
    }

    // Send SMS confirmation
    if (phone) {
      try {
        const smsMessage = `Your WanGov ID appointment is confirmed for ${appointmentDate} at ${appointmentTime} at ${center}. Bring original documents. Ref: ${referenceNumber}`;

        if (process.env.NODE_ENV === 'production' && twilioClient) {
          await twilioClient.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
          });
          results.sms = 'sent';
        } else {
          console.log('Mock SMS Sent:', { to: phone, message: smsMessage });
          results.sms = 'sent_mock';
        }

        // Log SMS notification
        notificationHistory.push({
          id: notificationHistory.length + 1,
          type: 'sms',
          recipient: phone,
          message: smsMessage,
          status: results.sms,
          sentAt: new Date().toISOString(),
          applicationId,
          sentBy: req.session.user.username
        });

      } catch (smsError) {
        console.error('SMS sending error:', smsError);
        results.sms = 'failed';
      }
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Send appointment confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send ID ready notification
router.post('/id-ready', requireAuth, async (req, res) => {
  try {
    const { applicationId, email, phone, applicantName, idNumber, center, referenceNumber } = req.body;

    if (!applicationId || !email || !applicantName || !idNumber || !center) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const results = { email: null, sms: null };

    // Send email notification
    try {
      const emailSubject = 'Your WanGov ID is Ready for Collection';
      const emailBody = `
Dear ${applicantName},

Great news! Your WanGov ID is ready for collection.

ID Details:
- ID Number: ${idNumber}
- Reference Number: ${referenceNumber}
- Collection Location: ${center}

Collection Instructions:
- Visit the center during operating hours (8:00 AM - 5:00 PM)
- Bring a valid form of identification
- Collection must be done in person
- ID cards not collected within 30 days will be returned to central office

Operating Hours: Monday - Friday, 8:00 AM - 5:00 PM

For questions, contact us at +232 76 123 456.

Congratulations on completing your WanGov ID registration!

Best regards,
National Civil Registration Authority (NCRA)
Government of Sierra Leone
      `;

      if (process.env.NODE_ENV === 'production' && emailTransporter) {
        await emailTransporter.sendMail({
          from: 'NCRA <noreply@ncra.gov.sl>',
          to: email,
          subject: emailSubject,
          text: emailBody
        });
        results.email = 'sent';
      } else {
        console.log('Mock Email Sent:', { to: email, subject: emailSubject });
        results.email = 'sent_mock';
      }

      // Log email notification
      notificationHistory.push({
        id: notificationHistory.length + 1,
        type: 'email',
        recipient: email,
        subject: emailSubject,
        message: emailBody,
        status: results.email,
        sentAt: new Date().toISOString(),
        applicationId,
        sentBy: req.session.user.username
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      results.email = 'failed';
    }

    // Send SMS notification
    if (phone) {
      try {
        const smsMessage = `Your WanGov ID (${idNumber}) is ready for collection at ${center}. Visit Mon-Fri 8AM-5PM with valid ID. Ref: ${referenceNumber}`;

        if (process.env.NODE_ENV === 'production' && twilioClient) {
          await twilioClient.messages.create({
            body: smsMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
          });
          results.sms = 'sent';
        } else {
          console.log('Mock SMS Sent:', { to: phone, message: smsMessage });
          results.sms = 'sent_mock';
        }

        // Log SMS notification
        notificationHistory.push({
          id: notificationHistory.length + 1,
          type: 'sms',
          recipient: phone,
          message: smsMessage,
          status: results.sms,
          sentAt: new Date().toISOString(),
          applicationId,
          sentBy: req.session.user.username
        });

      } catch (smsError) {
        console.error('SMS sending error:', smsError);
        results.sms = 'failed';
      }
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Send ID ready notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send custom notification
router.post('/custom', requireAuth, async (req, res) => {
  try {
    const { applicationId, email, phone, subject, message, type } = req.body;

    if (!message || (!email && !phone)) {
      return res.status(400).json({ error: 'Message and at least one contact method required' });
    }

    const results = { email: null, sms: null };

    // Send email if requested and email provided
    if ((type === 'email' || type === 'both') && email) {
      try {
        if (process.env.NODE_ENV === 'production' && emailTransporter) {
          await emailTransporter.sendMail({
            from: 'NCRA <noreply@ncra.gov.sl>',
            to: email,
            subject: subject || 'Message from NCRA',
            text: message
          });
          results.email = 'sent';
        } else {
          console.log('Mock Email Sent:', { to: email, subject, message });
          results.email = 'sent_mock';
        }

        // Log email notification
        notificationHistory.push({
          id: notificationHistory.length + 1,
          type: 'email',
          recipient: email,
          subject: subject || 'Message from NCRA',
          message,
          status: results.email,
          sentAt: new Date().toISOString(),
          applicationId,
          sentBy: req.session.user.username
        });

      } catch (emailError) {
        console.error('Email sending error:', emailError);
        results.email = 'failed';
      }
    }

    // Send SMS if requested and phone provided
    if ((type === 'sms' || type === 'both') && phone) {
      try {
        if (process.env.NODE_ENV === 'production' && twilioClient) {
          await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
          });
          results.sms = 'sent';
        } else {
          console.log('Mock SMS Sent:', { to: phone, message });
          results.sms = 'sent_mock';
        }

        // Log SMS notification
        notificationHistory.push({
          id: notificationHistory.length + 1,
          type: 'sms',
          recipient: phone,
          message,
          status: results.sms,
          sentAt: new Date().toISOString(),
          applicationId,
          sentBy: req.session.user.username
        });

      } catch (smsError) {
        console.error('SMS sending error:', smsError);
        results.sms = 'failed';
      }
    }

    res.json({ success: true, results });

  } catch (error) {
    console.error('Send custom notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notification history
router.get('/history', requireAuth, (req, res) => {
  try {
    const { applicationId, type, page = 1, limit = 20 } = req.query;

    let filteredHistory = [...notificationHistory];

    if (applicationId) {
      filteredHistory = filteredHistory.filter(n => n.applicationId === parseInt(applicationId));
    }
    if (type) {
      filteredHistory = filteredHistory.filter(n => n.type === type);
    }

    // Sort by most recent first
    filteredHistory.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);

    res.json({
      notifications: paginatedHistory,
      total: filteredHistory.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredHistory.length / limit)
    });

  } catch (error) {
    console.error('Get notification history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notification statistics
router.get('/stats', requireAuth, (req, res) => {
  try {
    const stats = {
      total: notificationHistory.length,
      byType: {
        email: notificationHistory.filter(n => n.type === 'email').length,
        sms: notificationHistory.filter(n => n.type === 'sms').length
      },
      byStatus: {
        sent: notificationHistory.filter(n => n.status === 'sent' || n.status === 'sent_mock').length,
        failed: notificationHistory.filter(n => n.status === 'failed').length
      },
      today: notificationHistory.filter(n => {
        const today = new Date().toISOString().split('T')[0];
        return n.sentAt.startsWith(today);
      }).length
    };

    res.json(stats);

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
