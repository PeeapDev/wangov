import React from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const WordPressDownload: React.FC = () => {
  const handleDownloadWordPressPlugin = async () => {
    try {
      const response = await fetch('/api/auth/wordpress-plugin');
      
      if (!response.ok) {
        throw new Error('Failed to download plugin');
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'wangov-wordpress-plugin.zip';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('WordPress plugin downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download WordPress plugin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              WanGov WordPress Plugin Download
            </h1>
            <p className="text-lg text-gray-600">
              Download the official WanGov WordPress plugin for easy SSO integration
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <Download className="h-5 w-5 mr-2" />
              WordPress Plugin Integration
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  1. Download the WanGov ID Plugin
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Download and install the WanGov ID WordPress plugin from your organization dashboard.
                </p>
                <button 
                  onClick={handleDownloadWordPressPlugin}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download WordPress Plugin
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  2. Install the Plugin
                </h3>
                <p className="text-sm text-blue-700">
                  Upload the downloaded zip file to your WordPress site via Plugins → Add New → Upload Plugin.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  3. Configure Settings
                </h3>
                <p className="text-sm text-blue-700">
                  In WordPress Admin → Settings → WanGov ID, enter your Client ID and Client Secret.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-blue-800 mb-2">
                  4. Test Integration
                </h3>
                <p className="text-sm text-blue-700">
                  Visit your WordPress login page to see the "Login with WanGov ID" button.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              🎉 Plugin Features
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• OAuth 2.0 login integration</li>
              <li>• User registration and profile sync</li>
              <li>• Admin settings page</li>
              <li>• Login/logout shortcodes</li>
              <li>• AJAX-powered user interface</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressDownload;
