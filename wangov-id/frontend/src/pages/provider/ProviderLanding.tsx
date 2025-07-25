import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProviderDetails } from '../../utils/subdomainHandler';
import { 
  UserIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

type ProviderDetails = {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  type: string;
};

const ProviderLanding: React.FC = () => {
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const providerData = await getProviderDetails();
        setProvider(providerData);
        document.title = `${providerData.name} Portal | WanGov ID`;
      } catch (err) {
        console.error('Error loading provider details:', err);
        setError('Unable to load provider information');
        toast.error('Unable to load provider information');
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading provider portal...</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-600 mb-2">Provider Portal Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load provider information'}</p>
          <p className="text-gray-600">This may indicate an invalid subdomain or a technical issue.</p>
          <div className="mt-6">
            <a 
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Return to main site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Generate a lighter shade of the primary color for the gradient
  const lighterPrimary = provider.primaryColor.replace('rgb', 'rgba').replace(')', ', 0.8)');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 shadow-md" style={{ background: provider.primaryColor }}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {provider.logo && (
              <img 
                src={provider.logo} 
                alt={`${provider.name} Logo`} 
                className="h-10"
              />
            )}
            <h1 className="text-2xl font-bold text-white">{provider.name}</h1>
          </div>
          <div>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="py-16 px-6"
        style={{ background: `linear-gradient(135deg, ${provider.primaryColor} 0%, ${lighterPrimary} 100%)` }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to {provider.name} Portal
          </h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto mb-10">
            Access government services, manage staff, and monitor service delivery efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-gray-800 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Provider Login
            </Link>
            <a
              href="/"
              className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-white/10 transition-colors"
            >
              Citizen Services
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: provider.primaryColor }}>
            Provider Portal Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Staff Management" 
              description="Efficiently manage staff access and roles within your organization."
              icon={<UserIcon className="h-8 w-8" />}
              color={provider.primaryColor}
            />
            <FeatureCard 
              title="Service Management" 
              description="Create, update, and manage services offered to citizens."
              icon={<ShieldCheckIcon className="h-8 w-8" />}
              color={provider.primaryColor}
            />
            <FeatureCard 
              title="Reports & Analytics" 
              description="Access detailed reports on service delivery and performance."
              icon={<ChartBarIcon className="h-8 w-8" />}
              color={provider.primaryColor}
            />
            <FeatureCard 
              title="Documentation" 
              description="Access and manage important documents and forms."
              icon={<DocumentTextIcon className="h-8 w-8" />}
              color={provider.primaryColor}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: provider.primaryColor }}>
              About Our Provider Portal
            </h2>
            <p className="text-gray-600 mb-8">
              As part of WanGov's commitment to modernizing government services, we've developed 
              dedicated provider portals for each government agency. This allows for streamlined 
              service delivery, improved staff management, and better citizen engagement.
            </p>
            <p className="text-gray-600">
              The {provider.name} portal enables administrators to manage their services, 
              staff, and communications all in one centralized platform, customized to the 
              specific needs of {provider.name}.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 mt-auto" style={{ background: provider.primaryColor }}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white opacity-90 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} {provider.name} - Powered by WanGov ID
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white opacity-90 hover:opacity-100">Terms</a>
              <a href="#" className="text-white opacity-90 hover:opacity-100">Privacy</a>
              <a href="#" className="text-white opacity-90 hover:opacity-100">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, color }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="mb-4" style={{ color }}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ProviderLanding;
