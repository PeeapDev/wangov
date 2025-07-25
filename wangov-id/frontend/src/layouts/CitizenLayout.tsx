import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CitizenSidebar from '../components/navigation/CitizenSidebar';
import CitizenHeader from '../components/navigation/CitizenHeader';

const CitizenLayout: React.FC = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for navigation */}
      <CitizenSidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <CitizenHeader openSidebar={() => setSidebarOpen(true)} user={user} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;
