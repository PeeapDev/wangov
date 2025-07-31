import React from 'react';
import { Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const WordPressIntegration: React.FC = () => {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold text-lg">WP</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">WanGov ID WordPress Plugin</h3>
          <p className="text-sm text-gray-600">Ready-to-use plugin with admin settings</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-6">
        Complete WordPress integration with login/logout, user sync, and admin configuration.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Installation:</strong> The plugin is already available in your project at /wangov-wordpress/wangov-id/
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            Upload the plugin to your WordPress site
          </h4>
          <p className="text-sm text-gray-600 mb-3 ml-8">
            Download and install the WanGov ID WordPress plugin from your organization dashboard.
          </p>
          <div className="ml-8">
            <button 
              onClick={handleDownloadWordPressPlugin}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download WordPress Plugin
            </button>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            Activate the plugin in WordPress admin
          </h4>
          <p className="text-sm text-gray-600 ml-8">
            Go to Plugins → Installed Plugins and activate the WanGov ID plugin.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
            Go to Settings → WanGov ID
          </h4>
          <p className="text-sm text-gray-600 ml-8">
            Configure the plugin with your OAuth client credentials.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">4</span>
            Enter your Client ID and Client Secret
          </h4>
          <p className="text-sm text-gray-600 ml-8">
            Use the credentials from your OAuth client configuration above.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">5</span>
            Save settings and test login
          </h4>
          <p className="text-sm text-gray-600 ml-8">
            Visit your WordPress login page to see the "Login with WanGov ID" button.
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <h5 className="font-medium text-green-900 mb-2">🎉 Plugin Features</h5>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• OAuth 2.0 login integration</li>
          <li>• User registration and profile sync</li>
          <li>• Admin settings page</li>
          <li>• Login/logout shortcodes</li>
          <li>• AJAX-powered user interface</li>
        </ul>
      </div>
    </div>
  );
};

export default WordPressIntegration;
