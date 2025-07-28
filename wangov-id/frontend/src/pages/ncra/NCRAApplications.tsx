import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import SearchBar from '../../components/search/SearchBar';

/**
 * NCRAApplications Component
 * Provides tabbed navigation for the NCRA Applications section
 * Uses nested routes via Outlet to display application lists based on status
 */
const NCRAApplications: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Citizen Applications</h1>
        <p className="text-slate-500 mt-2">
          Manage and process citizen applications in the system
        </p>
      </div>
      
      {/* Prominent Search Bar */}
      <div className="mb-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar 
            variant="ncra" 
            role="ncra" 
            placeholder="Search applications by name, reference number, status..." 
            className="shadow-lg py-3" 
            onSearch={(query) => console.log('Searching for:', query)}
          />
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="mb-8 border-b border-slate-200">
        <ul className="flex flex-wrap text-sm font-medium">
          <li className="mr-1">
            <NavLink 
              to="/ncra/applications" 
              end
              className={({ isActive }) => 
                `inline-block px-4 py-2 rounded-t-lg ${
                  isActive 
                  ? 'active bg-white text-primary-700 border-b-2 border-primary-700'
                  : 'hover:text-primary-700 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center">
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                <span>All Applications</span>
              </div>
            </NavLink>
          </li>
          <li className="mr-1">
            <NavLink 
              to="/ncra/applications/processing" 
              className={({ isActive }) => 
                `inline-block px-4 py-2 rounded-t-lg ${
                  isActive 
                  ? 'active bg-white text-primary-700 border-b-2 border-primary-700'
                  : 'hover:text-primary-700 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center">
                <ClipboardDocumentCheckIcon className="w-4 h-4 mr-2" />
                <span>Processing</span>
              </div>
            </NavLink>
          </li>
          <li className="mr-1">
            <NavLink 
              to="/ncra/applications/pending" 
              className={({ isActive }) => 
                `inline-block px-4 py-2 rounded-t-lg ${
                  isActive 
                  ? 'active bg-white text-primary-700 border-b-2 border-primary-700'
                  : 'hover:text-primary-700 hover:bg-slate-50'
                }`
              }
            >
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2" />
                <span>Pending</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
      
      {/* Content area for child routes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
};

export default NCRAApplications;
