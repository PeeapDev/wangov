import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getProviderDetails, ProviderDetails } from '../utils/subdomainHandler';
import { toast } from 'react-hot-toast';

// Using the ProviderDetails interface from subdomainHandler.ts

const ProviderLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const providerDetails = await getProviderDetails();
        setProvider(providerDetails);
        // Set document title
        document.title = `${providerDetails.name} Dashboard | WanGov ID`;
      } catch (error) {
        console.error('Error fetching provider details:', error);
        toast.error('Unable to load provider information');
        
        // If no valid provider is found, redirect to main site after a short delay
        setTimeout(() => {
          window.location.href = window.location.protocol + '//' + 
            window.location.host.replace(/^[^.]+\./, '');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [navigate]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Staff Management', path: '/dashboard/staff', icon: UserGroupIcon },
    { name: 'Services', path: '/dashboard/services', icon: DocumentChartBarIcon },
    { name: 'Invoice Management', path: '/dashboard/invoices', icon: DocumentTextIcon },
    { name: 'Reports', path: '/dashboard/reports', icon: ChartBarIcon },
    { name: 'Settings', path: '/dashboard/settings', icon: CogIcon },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Define custom styles based on provider branding
  const headerStyle = provider ? { 
    backgroundColor: provider.primaryColor 
  } : { 
    backgroundColor: '#1f2937' 
  };

  const sidebarStyle = provider ? {
    backgroundColor: provider.secondaryColor
  } : {
    backgroundColor: '#111827'
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Provider Portal</h1>
        <p className="text-gray-600 mb-6">This provider does not exist or has been deactivated.</p>
        <button 
          onClick={() => window.location.href = 'http://localhost:3000'} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Main Site
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transition duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
        style={sidebarStyle}
      >
        <div className="flex items-center justify-between h-16 px-6 text-white">
          <div className="flex items-center">
            {provider.logo ? (
              <img src={provider.logo} alt={provider.name} className="h-8 w-auto mr-2" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
            <span className="text-lg font-semibold truncate">{provider.name}</span>
          </div>
          <button 
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5">
          <div className="px-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-white bg-opacity-10 text-white' 
                      : 'text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                >
                  <link.icon
                    className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`}
                    aria-hidden="true"
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header 
          className="flex items-center justify-between h-16 px-6 shadow"
          style={headerStyle}
        >
          <div className="flex items-center lg:hidden">
            <button 
              className="text-white"
              onClick={toggleSidebar}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <div className="text-xl font-semibold text-white hidden md:block">
            {provider.name} Portal
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-white">
              <BellIcon className="h-6 w-6" />
            </button>

            <div className="relative">
              <button className="flex items-center text-white">
                <UserIcon className="h-6 w-6" />
                <span className="ml-2 hidden md:block">Provider Admin</span>
              </button>
            </div>

            <button className="text-white hover:text-gray-200">
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
