import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/apiClient';
import { toast } from 'react-hot-toast';
import ProfilePicture from '../../components/common/ProfilePicture';
import { CameraIcon } from '@heroicons/react/24/outline';

interface Application {
  id: number;
  type: string;
  status: string;
  date: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  status: string;
}

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

interface DashboardData {
  applications: Application[];
  documents: Document[];
  notifications: Notification[];
}

const CitizenDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchCitizenData();
  }, []);

  const fetchCitizenData = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // const response = await apiClient.get('/citizen/profile');
      
      // Mock data for now
      setTimeout(() => {
        setDashboardData({
          applications: [
            { id: 1, type: 'Passport Application', status: 'In Progress', date: '2024-01-15' },
            { id: 2, type: 'Birth Certificate', status: 'Completed', date: '2024-01-10' },
            { id: 3, type: 'Marriage Certificate', status: 'Pending Review', date: '2024-01-20' },
          ],
          documents: [
            { id: 1, name: 'National ID', type: 'Identity', status: 'Valid' },
            { id: 2, name: 'Birth Certificate', type: 'Civil', status: 'Valid' },
            { id: 3, name: 'Passport', type: 'Travel', status: 'Expired' },
          ],
          notifications: [
            { id: 1, message: 'Your passport application has been approved', date: '2024-01-21', read: false },
            { id: 2, message: 'Document verification completed', date: '2024-01-20', read: true },
            { id: 3, message: 'New service available: Online Tax Filing', date: '2024-01-19', read: true },
          ]
        });
        // Mock profile picture
        setProfilePicture('/api/placeholder/100/100');
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch citizen data:', error);
      toast.error('Failed to load profile data');
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleProfilePictureChange = async (file: File) => {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Mock API call - replace with actual endpoint
      // const response = await apiClient.post('/citizen/profile/picture', formData);
      
      // For now, create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <ProfilePicture
                src={profilePicture}
                alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
                size="xl"
                editable={true}
                onImageChange={handleProfilePictureChange}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
                <p className="text-gray-600">Here's an overview of your account and services</p>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={fetchCitizenData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Citizen Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your WanGov-ID dashboard information
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.name || 'John Doe'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">ID Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.id || 'WG-123456'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email || 'user@example.com'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Account status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your recent interactions with government services
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Passport renewal</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Status: Processing</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Driver's license verification</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Status: Completed</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Voter registration</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Status: Verified</dd>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Request Document', icon: 'document' },
                { name: 'Update Profile', icon: 'user' },
                { name: 'Access Services', icon: 'service' }
              ].map((action) => (
                <div key={action.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="text-center">
                      <div className="mt-3">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{action.name}</h3>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
