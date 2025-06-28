import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { WMSBuilder } from './components/WMSBuilder/WMSBuilder';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectDetail } from './components/ProjectDetail';
import { LayoutDashboardIcon, FileTextIcon, SettingsIcon, FolderIcon } from 'lucide-react';
import { UserProfile } from './components/UserProfile/UserProfile';
export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeWmsId, setActiveWmsId] = useState<number | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  // Initial user metadata
  const [userMetadata, setUserMetadata] = useState({
    name: 'John Müller',
    position: 'Transport Engineer',
    phone: '+1 305 555 1000',
    whatsapp: '+1 305 555 1000',
    email: 'john@transportlogix.com',
    address: '312 Freight Blvd, Houston, TX'
  });
  // Initial company metadata
  const [companyMetadata, setCompanyMetadata] = useState({
    name: 'TransportLogix USA',
    address: '312 Freight Blvd, Houston, TX',
    website: 'https://www.transportlogix.com',
    logo: '',
    taxId: 'TX-998456789'
  });
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <Dashboard onCreateNew={() => setActiveTab('builder')} />;
    } else if (activeTab === 'projects') {
      if (activeProjectId) {
        if (activeWmsId) {
          return <WMSBuilder />;
        } else {
          return <ProjectDetail projectId={activeProjectId} onBack={() => setActiveProjectId(null)} />;
        }
      } else {
        return <ProjectsPage onSelectProject={projectId => setActiveProjectId(projectId)} />;
      }
    } else if (activeTab === 'builder') {
      return <WMSBuilder />;
    }
    return null;
  };
  return <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1 rounded">
              <FileTextIcon size={24} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              WMS Generator
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100" onClick={() => setShowUserProfile(true)}>
                <SettingsIcon size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  Equipment Library
                </button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  User Settings
                </button>
                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  Company Settings
                </button>
              </div>
            </div>
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
              JM
            </div>
          </div>
        </div>
      </header>
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <button className={`py-3 px-4 font-medium flex items-center space-x-2 border-b-2 ${activeTab === 'dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`} onClick={() => {
            setActiveTab('dashboard');
            setActiveProjectId(null);
            setActiveWmsId(null);
          }}>
              <LayoutDashboardIcon size={18} />
              <span>Dashboard</span>
            </button>
            <button className={`py-3 px-4 font-medium flex items-center space-x-2 border-b-2 ${activeTab === 'projects' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`} onClick={() => {
            setActiveTab('projects');
            setActiveWmsId(null);
          }}>
              <FolderIcon size={18} />
              <span>Projects</span>
            </button>
            <button className={`py-3 px-4 font-medium flex items-center space-x-2 border-b-2 ${activeTab === 'builder' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`} onClick={() => {
            setActiveTab('builder');
            setActiveProjectId(null);
            setActiveWmsId(null);
          }}>
              <FileTextIcon size={18} />
              <span>WMS Builder</span>
            </button>
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          WMS Generator v1.0 — Streamlining logistics documentation
        </div>
      </footer>
      {/* User Profile Modal */}
      {showUserProfile && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                User Settings
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowUserProfile(false)}>
                ✕
              </button>
            </div>
            <div className="p-6">
              <UserProfile userMetadata={userMetadata} companyMetadata={companyMetadata} onUpdateUserMetadata={setUserMetadata} onUpdateCompanyMetadata={setCompanyMetadata} />
            </div>
          </div>
        </div>}
    </div>;
}