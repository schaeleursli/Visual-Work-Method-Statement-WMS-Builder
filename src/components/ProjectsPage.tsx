import React, { useState } from 'react';
import { PlusIcon, SearchIcon, FilterIcon, FolderIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
// Mock data for projects
const mockProjects = [{
  id: 1,
  name: 'Offshore Wind Farm Phase II',
  client: 'WindPower GmbH',
  location: 'North Sea, Germany',
  status: 'in-progress',
  startDate: '2023-10-01',
  endDate: '2024-06-30',
  wmsCount: 5
}, {
  id: 2,
  name: 'Transformer Delivery Project',
  client: 'ElectriCorp Inc.',
  location: 'Rotterdam, Netherlands',
  status: 'planning',
  startDate: '2023-12-15',
  endDate: '2024-03-15',
  wmsCount: 2
}, {
  id: 3,
  name: 'Bridge Section Transport',
  client: 'City of Copenhagen',
  location: 'Copenhagen, Denmark',
  status: 'completed',
  startDate: '2023-05-10',
  endDate: '2023-09-20',
  wmsCount: 7
}, {
  id: 4,
  name: 'Gas Platform Decommissioning',
  client: 'NorthOil AS',
  location: 'Norwegian Sea',
  status: 'in-progress',
  startDate: '2023-08-01',
  endDate: '2024-11-30',
  wmsCount: 12
}];
interface ProjectFormData {
  name: string;
  client: string;
  location: string;
  startDate: string;
  endDate: string;
}
interface ProjectsPageProps {
  onSelectProject?: (projectId: number) => void;
}
export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject
}) => {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    client: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the new project to the database
    console.log('New project:', formData);
    setShowNewProjectForm(false);
    setFormData({
      name: '',
      client: '',
      location: '',
      startDate: '',
      endDate: ''
    });
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon size={18} className="text-green-500" />;
      case 'in-progress':
        return <ClockIcon size={18} className="text-blue-500" />;
      case 'planning':
        return <AlertCircleIcon size={18} className="text-yellow-500" />;
      default:
        return null;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'planning':
        return 'Planning';
      default:
        return status;
    }
  };
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.client.toLowerCase().includes(searchTerm.toLowerCase()) || project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
        <button onClick={() => setShowNewProjectForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <PlusIcon size={18} />
          <span>Create New Project</span>
        </button>
      </div>
      {showNewProjectForm && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Create New Project
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input type="text" name="client" value={formData.client} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowNewProjectForm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create Project
              </button>
            </div>
          </form>
        </div>}
      <div className="flex space-x-4 mb-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search projects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value || null)}>
            <option value="">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FilterIcon size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="w-1/3 font-medium text-gray-700">Project</div>
          <div className="w-1/6 font-medium text-gray-700">Client</div>
          <div className="w-1/6 font-medium text-gray-700">Location</div>
          <div className="w-1/6 font-medium text-gray-700">Status</div>
          <div className="w-1/6 font-medium text-gray-700">Timeline</div>
        </div>
        {filteredProjects.length > 0 ? filteredProjects.map(project => <div key={project.id} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => {
        // Navigate to project detail page
        if (onSelectProject) {
          onSelectProject(project.id);
        }
      }}>
              <div className="w-1/3 flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <FolderIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{project.name}</h4>
                  <p className="text-sm text-gray-500">
                    {project.wmsCount} WMS Documents
                  </p>
                </div>
              </div>
              <div className="w-1/6 text-gray-600">{project.client}</div>
              <div className="w-1/6 text-gray-600">{project.location}</div>
              <div className="w-1/6">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <span className="text-sm text-gray-600">
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>
              <div className="w-1/6 text-sm text-gray-600">
                <div>{new Date(project.startDate).toLocaleDateString()}</div>
                <div>to {new Date(project.endDate).toLocaleDateString()}</div>
              </div>
            </div>) : <div className="px-6 py-8 text-center text-gray-500">
            No projects found matching your criteria
          </div>}
      </div>
    </div>;
};