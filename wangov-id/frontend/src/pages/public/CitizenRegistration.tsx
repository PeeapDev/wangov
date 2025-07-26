import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  UserIcon, 
  MapPinIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  placeOfBirth: string;
  nationality: string;
  phoneNumber: string;
  email: string;
}

interface AddressInfo {
  currentAddress: string;
  district: string;
  chiefdom: string;
  ward: string;
  permanentAddress: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface DocumentInfo {
  birthCertificate: File | null;
  proofOfResidence: File | null;
  parentIdCopy: File | null;
  additionalDocs: File[];
}

interface AppointmentInfo {
  preferredDate: string;
  preferredTime: string;
  ncraCenter: string;
  specialRequirements: string;
}

const CitizenRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    placeOfBirth: '',
    nationality: 'Sierra Leone',
    phoneNumber: '',
    email: ''
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    currentAddress: '',
    district: '',
    chiefdom: '',
    ward: '',
    permanentAddress: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({
    birthCertificate: null,
    proofOfResidence: null,
    parentIdCopy: null,
    additionalDocs: []
  });

  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo>({
    preferredDate: '',
    preferredTime: '',
    ncraCenter: '',
    specialRequirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Personal Information', icon: UserIcon },
    { number: 2, title: 'Address Details', icon: MapPinIcon },
    { number: 3, title: 'Document Upload', icon: DocumentTextIcon },
    { number: 4, title: 'Appointment Booking', icon: CalendarIcon }
  ];

  const districts = [
    'Western Area', 'Bo', 'Kenema', 'Kailahun', 'Kono', 'Bombali', 'Tonkolili',
    'Port Loko', 'Kambia', 'Koinadugu', 'Falaba', 'Karene', 'Moyamba', 'Bonthe', 'Pujehun'
  ];

  const ncraCenters = [
    'NCRA Freetown Central',
    'NCRA Bo Regional Office',
    'NCRA Kenema Regional Office',
    'NCRA Makeni Regional Office',
    'NCRA Koidu Regional Office'
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Navigate to confirmation page
    navigate('/register/confirmation', {
      state: {
        type: 'citizen',
        referenceNumber: 'CIT-' + Date.now(),
        appointmentDate: appointmentInfo.preferredDate,
        center: appointmentInfo.ncraCenter
      }
    });
  };

  const handleFileUpload = (field: keyof DocumentInfo, file: File | null) => {
    setDocumentInfo(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                value={personalInfo.middleName}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, middleName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={personalInfo.gender}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place of Birth *
              </label>
              <input
                type="text"
                value={personalInfo.placeOfBirth}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, placeOfBirth: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="City, District, Sierra Leone"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={personalInfo.phoneNumber}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+232 XX XXX XXXX"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Address Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address *
              </label>
              <textarea
                value={addressInfo.currentAddress}
                onChange={(e) => setAddressInfo(prev => ({ ...prev, currentAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="House number, street name, area"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <select
                  value={addressInfo.district}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, district: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiefdom
                </label>
                <input
                  type="text"
                  value={addressInfo.chiefdom}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, chiefdom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ward
                </label>
                <input
                  type="text"
                  value={addressInfo.ward}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, ward: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permanent Address (if different from current)
              </label>
              <textarea
                value={addressInfo.permanentAddress}
                onChange={(e) => setAddressInfo(prev => ({ ...prev, permanentAddress: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Leave blank if same as current address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  value={addressInfo.emergencyContact}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  value={addressInfo.emergencyPhone}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+232 XX XXX XXXX"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Required Documents:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Birth Certificate (original or certified copy)</li>
                <li>• Proof of residence (utility bill, rental agreement)</li>
                <li>• Parent/Guardian ID copy (for minors)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Certificate *
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload('birthCertificate', e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG (Max 5MB)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proof of Residence *
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload('proofOfResidence', e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Utility bill, rental agreement, or property deed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian ID Copy (if applicable)
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload('parentIdCopy', e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">Required for applicants under 18 years</p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Booking</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-900 mb-2">Biometric Capture Appointment</h4>
              <p className="text-green-800 text-sm">
                You must visit an NCRA center in person to complete your biometric registration 
                (fingerprints, photograph, and signature capture).
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  value={appointmentInfo.preferredDate}
                  onChange={(e) => setAppointmentInfo(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time *
                </label>
                <select
                  value={appointmentInfo.preferredTime}
                  onChange={(e) => setAppointmentInfo(prev => ({ ...prev, preferredTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NCRA Center *
              </label>
              <select
                value={appointmentInfo.ncraCenter}
                onChange={(e) => setAppointmentInfo(prev => ({ ...prev, ncraCenter: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select NCRA Center</option>
                {ncraCenters.map(center => (
                  <option key={center} value={center}>{center}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requirements or Accessibility Needs
              </label>
              <textarea
                value={appointmentInfo.specialRequirements}
                onChange={(e) => setAppointmentInfo(prev => ({ ...prev, specialRequirements: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                placeholder="Please describe any special assistance you may need"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Citizen Registration</h1>
          <p className="text-gray-600">Complete your Sierra Leone National ID registration</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isActive 
                        ? 'border-green-600 text-green-600 bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Options</span>
          </button>

          <div className="flex space-x-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Previous</span>
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>Next</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <ClockIcon className="h-5 w-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <CheckCircleIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenRegistration;
