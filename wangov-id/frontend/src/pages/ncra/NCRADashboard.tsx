import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  FingerPrintIcon,
  CreditCardIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Stats {
  totalApplications: number;
  todayAppointments: number;
  biometricCaptures: number;
  idsReady: number;
}

interface Application {
  id: number;
  referenceNumber: string;
  applicantName: string;
  type: string;
  status: string;
  submittedAt: string;
}

interface Appointment {
  id: number;
  applicantName: string;
  time: string;
  type: string;
  status: string;
}

const NCRADashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    todayAppointments: 0,
    biometricCaptures: 0,
    idsReady: 0
  });
  
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with actual API calls
      setStats({
        totalApplications: 1247,
        todayAppointments: 23,
        biometricCaptures: 156,
        idsReady: 89
      });

      setRecentApplications([
        {
          id: 1,
          referenceNumber: 'CIT-2025-001',
          applicantName: 'John Doe',
          type: 'Citizen Registration',
          status: 'submitted',
          submittedAt: '2025-01-25T10:30:00Z'
        },
        {
          id: 2,
          referenceNumber: 'RP-2025-002',
          applicantName: 'Jane Smith',
          type: 'Resident Permit',
          status: 'under_review',
          submittedAt: '2025-01-25T09:15:00Z'
        },
        {
          id: 3,
          referenceNumber: 'CIT-2025-003',
          applicantName: 'Mohamed Kaba',
          type: 'Citizen Registration',
          status: 'approved',
          submittedAt: '2025-01-24T16:45:00Z'
        }
      ]);

      setTodaySchedule([
        {
          id: 1,
          applicantName: 'John Doe',
          time: '10:00',
          type: 'Biometric Capture',
          status: 'scheduled'
        },
        {
          id: 2,
          applicantName: 'Sarah Johnson',
          time: '14:30',
          type: 'Document Verification',
          status: 'confirmed'
        },
        {
          id: 3,
          applicantName: 'Ahmed Hassan',
          time: '16:00',
          type: 'ID Collection',
          status: 'checked_in'
        }
      ]);

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under_review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'scheduled': 'bg-purple-100 text-purple-800',
      'confirmed': 'bg-green-100 text-green-800',
      'checked_in': 'bg-indigo-100 text-indigo-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: React.ComponentType<any>;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{loading ? '-' : value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">NCRA Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                National Civil Registration Authority - Administrative Portal
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last updated: {lastUpdated}
              </span>
              <button
                onClick={loadDashboardData}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DocumentTextIcon}
            title="Total Applications"
            value={stats.totalApplications}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            icon={CalendarIcon}
            title="Today's Appointments"
            value={stats.todayAppointments}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            icon={FingerPrintIcon}
            title="Biometric Captures"
            value={stats.biometricCaptures}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            icon={CreditCardIcon}
            title="IDs Ready"
            value={stats.idsReady}
            color="bg-yellow-100 text-yellow-600"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  <ArrowPathIcon className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  Loading applications...
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{app.applicantName}</p>
                        <p className="text-sm text-gray-500">{app.referenceNumber} • {app.type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <a href="/ncra/applications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all applications →
                </a>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  <ArrowPathIcon className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  Loading schedule...
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySchedule.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{apt.applicantName}</p>
                        <p className="text-sm text-gray-500">{apt.time} • {apt.type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <a href="/ncra/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View all appointments →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/ncra/applications/new"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-600" />
                New Application
              </a>
              <a
                href="/ncra/appointments/today"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-600" />
                Today's Appointments
              </a>
              <a
                href="/ncra/biometric/capture"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FingerPrintIcon className="h-5 w-5 mr-2 text-gray-600" />
                Start Biometric Capture
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCRADashboard;
