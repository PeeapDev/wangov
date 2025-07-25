import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Globe, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';

const RegistrationChoice: React.FC = () => {
  const navigate = useNavigate();

  const handleCitizenRegistration = () => {
    navigate('/register/citizen');
  };

  const handleResidentPermitRegistration = () => {
    navigate('/register/resident-permit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WanGov Registration Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your registration type to begin your journey with Sierra Leone's digital identity system
          </p>
        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Citizen Registration */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-600 p-6 text-center">
              <User className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Citizen Registration</h2>
              <p className="text-green-100 mt-2">For Sierra Leone nationals</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">National ID Card</h4>
                    <p className="text-gray-600 text-sm">Get your official Sierra Leone National ID</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Digital Identity</h4>
                    <p className="text-gray-600 text-sm">Access all government services online</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Voting Rights</h4>
                    <p className="text-gray-600 text-sm">Participate in democratic processes</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Birth certificate or proof of citizenship</li>
                  <li>• Proof of residence</li>
                  <li>• Biometric data capture</li>
                </ul>
              </div>

              <button
                onClick={handleCitizenRegistration}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Register as Citizen</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Resident Permit Registration */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-600 p-6 text-center">
              <Globe className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white">Resident Permit</h2>
              <p className="text-blue-100 mt-2">For foreign nationals</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Residence Permit</h4>
                    <p className="text-gray-600 text-sm">Legal authorization to live in Sierra Leone</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Work Authorization</h4>
                    <p className="text-gray-600 text-sm">Permission to work and conduct business</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Government Services</h4>
                    <p className="text-gray-600 text-sm">Access to essential public services</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Valid passport</li>
                  <li>• Visa or entry permit</li>
                  <li>• Proof of purpose (work, study, family)</li>
                  <li>• Biometric data capture</li>
                </ul>
              </div>

              <button
                onClick={handleResidentPermitRegistration}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Apply for Resident Permit</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Process Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Registration Process</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Online Application</h4>
              <p className="text-gray-600 text-sm">Complete your registration form online</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Appointment Booking</h4>
              <p className="text-gray-600 text-sm">Schedule your biometric capture appointment</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Visit NCRA Center</h4>
              <p className="text-gray-600 text-sm">Complete biometric registration in person</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Receive ID</h4>
              <p className="text-gray-600 text-sm">Get your digital and physical ID</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Need help? Contact NCRA Support at{' '}
            <a href="tel:+23276123456" className="text-green-600 hover:underline">
              +232 76 123 456
            </a>{' '}
            or{' '}
            <a href="mailto:support@ncra.gov.sl" className="text-green-600 hover:underline">
              support@ncra.gov.sl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationChoice;
