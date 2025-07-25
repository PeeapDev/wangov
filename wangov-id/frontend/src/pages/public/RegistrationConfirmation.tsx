import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, FileText, Phone, Mail, Download, Home } from 'lucide-react';

const RegistrationConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { type, referenceNumber, appointmentDate, center } = location.state || {};

  const isCitizen = type === 'citizen';
  const isResidentPermit = type === 'resident-permit';

  const handleDownloadReceipt = () => {
    // Simulate PDF download
    const element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
WanGov Registration Receipt
Reference Number: ${referenceNumber}
Type: ${isCitizen ? 'Citizen Registration' : 'Resident Permit Application'}
Appointment Date: ${appointmentDate}
Center: ${center}
Status: Pending Appointment
    `);
    element.download = `WanGov_Receipt_${referenceNumber}.txt`;
    element.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Your {isCitizen ? 'citizen registration' : 'resident permit application'} has been received
          </p>
        </div>

        {/* Reference Number Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reference Number</h2>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <span className="text-3xl font-mono font-bold text-green-600">{referenceNumber}</span>
            </div>
            <p className="text-gray-600 mb-4">
              Please save this reference number. You will need it to track your application status.
            </p>
            <button
              onClick={handleDownloadReceipt}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Receipt</span>
            </button>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-3 text-blue-600" />
            Appointment Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Date & Time</h4>
                <p className="text-gray-600">{appointmentDate} at 10:00 AM</p>
                <p className="text-sm text-yellow-600 mt-1">⚠️ Pending confirmation from NCRA</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Location</h4>
                <p className="text-gray-600">{center}</p>
                <p className="text-sm text-gray-500">15 Siaka Stevens Street, Freetown</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• You will receive an email/SMS confirmation within 2-3 business days</li>
              <li>• Bring all original documents for verification</li>
              <li>• Arrive 15 minutes before your scheduled appointment</li>
              <li>• Processing fee will be collected at the center</li>
            </ul>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Appointment Confirmation</h4>
                <p className="text-gray-600 text-sm">
                  NCRA staff will review your application and confirm your appointment within 2-3 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Visit NCRA Center</h4>
                <p className="text-gray-600 text-sm">
                  Attend your appointment for biometric capture (fingerprints, photograph, signature).
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Document Verification</h4>
                <p className="text-gray-600 text-sm">
                  NCRA staff will verify your documents and process your application.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {isCitizen ? 'Receive National ID' : 'Receive Resident Permit'}
                </h4>
                <p className="text-gray-600 text-sm">
                  Your {isCitizen ? 'National ID card' : 'resident permit'} will be ready for collection within 10-15 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents Reminder */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-orange-600" />
            Documents to Bring
          </h3>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-3">Required Original Documents:</h4>
            {isCitizen ? (
              <ul className="text-orange-800 text-sm space-y-1">
                <li>• Birth certificate (original or certified copy)</li>
                <li>• Proof of residence (utility bill, rental agreement)</li>
                <li>• Parent/Guardian ID (for minors under 18)</li>
                <li>• Two passport-sized photographs</li>
              </ul>
            ) : (
              <ul className="text-orange-800 text-sm space-y-1">
                <li>• Valid passport with current visa</li>
                <li>• Sponsor letter or employment contract</li>
                <li>• Medical certificate (not older than 3 months)</li>
                <li>• Police clearance certificate from home country</li>
                <li>• Two passport-sized photographs</li>
              </ul>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Need Help?</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Call Us</h4>
                <p className="text-gray-600">+232 76 123 456</p>
                <p className="text-sm text-gray-500">Monday - Friday, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Email Us</h4>
                <p className="text-gray-600">support@ncra.gov.sl</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-sm">
              <strong>Track Your Application:</strong> Visit{' '}
              <a href="#" className="text-green-600 hover:underline">
                www.ncra.gov.sl/track
              </a>{' '}
              and enter your reference number to check the status of your application.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Return to Home</span>
          </button>
          
          <button
            onClick={() => navigate('/register')}
            className="flex items-center justify-center space-x-2 px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <span>Register Another Person</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            This is an official government service provided by the National Civil Registration Authority (NCRA)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationConfirmation;
