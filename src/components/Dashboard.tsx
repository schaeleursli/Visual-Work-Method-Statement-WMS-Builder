import React, { useState, Component } from 'react';
import { PlusIcon, CopyIcon, CheckCircleIcon, ClockIcon, AlertCircleIcon, ChartPieIcon, BarChart3Icon, ClipboardListIcon, AlertTriangleIcon } from 'lucide-react';
// Mock data for workflows
const mockWorkflows = [{
  id: 1,
  name: 'Transformer Transport to Site A',
  status: 'approved',
  date: '2023-11-15',
  steps: 5,
  project: 'Offshore Wind Farm Phase II'
}, {
  id: 2,
  name: 'Wind Turbine Components - Project B',
  status: 'review',
  date: '2023-11-10',
  steps: 7,
  project: 'Offshore Wind Farm Phase II'
}, {
  id: 3,
  name: 'Heavy Machinery Relocation',
  status: 'draft',
  date: '2023-11-05',
  steps: 4,
  project: 'Transformer Delivery Project'
}, {
  id: 4,
  name: 'Bridge Section Transport',
  status: 'draft',
  date: '2023-10-28',
  steps: 6,
  project: 'Bridge Section Transport'
}];
// Mock data for dashboard widgets
const statusData = {
  approved: 4,
  review: 3,
  draft: 7
};
const riskData = {
  high: 2,
  medium: 5,
  low: 12
};
const recentRevisions = [{
  id: 1,
  doc: 'WMS-001',
  rev: '02',
  date: '2023-11-15',
  author: 'J. Müller',
  project: 'Offshore Wind Farm Phase II'
}, {
  id: 2,
  doc: 'WMS-003',
  rev: '01',
  date: '2023-11-14',
  author: 'C. Reyes',
  project: 'Transformer Delivery Project'
}, {
  id: 3,
  doc: 'WMS-005',
  rev: '03',
  date: '2023-11-12',
  author: 'S. Johnson',
  project: 'Bridge Section Transport'
}];
const pendingApprovals = [{
  id: 1,
  doc: 'WMS-002',
  title: 'Wind Turbine Components',
  project: 'Offshore Wind Farm Phase II',
  daysOpen: 3
}, {
  id: 2,
  doc: 'WMS-007',
  title: 'Cable Laying Operations',
  project: 'Offshore Wind Farm Phase II',
  daysOpen: 1
}];
interface DashboardProps {
  onCreateNew: () => void;
}
export const Dashboard: React.FC<DashboardProps> = ({
  onCreateNew
}) => {
  const [activeTab, setActiveTab] = useState('recent');
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon size={18} className="text-green-500" />;
      case 'review':
        return <ClockIcon size={18} className="text-yellow-500" />;
      case 'draft':
        return <AlertCircleIcon size={18} className="text-gray-400" />;
      default:
        return null;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'review':
        return 'Under Review';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        <div className="flex space-x-3">
          <button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
            <PlusIcon size={18} />
            <span>Create New WMS</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50">
            <CopyIcon size={18} />
            <span>Duplicate Existing</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Status Widget */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <ChartPieIcon size={20} className="text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-800">WMS by Status</h3>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <span className="text-xl font-semibold text-gray-500">
                  {statusData.draft}
                </span>
              </div>
              <span className="text-sm text-gray-600">Draft</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <span className="text-xl font-semibold text-yellow-600">
                  {statusData.review}
                </span>
              </div>
              <span className="text-sm text-gray-600">Review</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-xl font-semibold text-green-600">
                  {statusData.approved}
                </span>
              </div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
          </div>
        </div>
        {/* Risk Status Widget */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <BarChart3Icon size={20} className="text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-800">Risk Status</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">High Risk</span>
                <span className="text-sm font-medium text-red-600">
                  {riskData.high}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{
                width: `${riskData.high / (riskData.high + riskData.medium + riskData.low) * 100}%`
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Medium Risk</span>
                <span className="text-sm font-medium text-yellow-600">
                  {riskData.medium}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{
                width: `${riskData.medium / (riskData.high + riskData.medium + riskData.low) * 100}%`
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">ALARP</span>
                <span className="text-sm font-medium text-green-600">
                  {riskData.low}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                width: `${riskData.low / (riskData.high + riskData.medium + riskData.low) * 100}%`
              }}></div>
              </div>
            </div>
          </div>
        </div>
        {/* Alerts Widget */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center mb-4">
            <AlertTriangleIcon size={20} className="text-blue-500 mr-2" />
            <h3 className="font-medium text-gray-800">Pending Approvals</h3>
          </div>
          {pendingApprovals.length > 0 ? <div className="space-y-3">
              {pendingApprovals.map(item => <div key={item.id} className="flex items-start p-3 border border-yellow-200 rounded-md bg-yellow-50">
                  <AlertCircleIcon size={18} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.doc}: {item.title}
                    </p>
                    <p className="text-xs text-gray-600">{item.project}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Awaiting approval for {item.daysOpen}{' '}
                      {item.daysOpen === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>)}
            </div> : <div className="text-center py-6 text-gray-500">
              <p>No pending approvals</p>
            </div>}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button className={`px-4 py-3 font-medium text-sm ${activeTab === 'recent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('recent')}>
              Recent WMS
            </button>
            <button className={`px-4 py-3 font-medium text-sm ${activeTab === 'revisions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('revisions')}>
              Recent Revisions
            </button>
          </div>
        </div>
        {activeTab === 'recent' && <>
            <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="w-1/2 font-medium text-gray-700">Name</div>
              <div className="w-1/6 font-medium text-gray-700">Status</div>
              <div className="w-1/6 font-medium text-gray-700">
                Last Updated
              </div>
              <div className="w-1/6 font-medium text-gray-700">Steps</div>
            </div>
            {mockWorkflows.map(workflow => <div key={workflow.id} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <div className="w-1/2">
                  <div className="font-medium text-gray-800">
                    {workflow.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {workflow.project}
                  </div>
                </div>
                <div className="w-1/6 flex items-center space-x-2">
                  {getStatusIcon(workflow.status)}
                  <span className="text-sm text-gray-600">
                    {getStatusText(workflow.status)}
                  </span>
                </div>
                <div className="w-1/6 text-sm text-gray-600">
                  {workflow.date}
                </div>
                <div className="w-1/6 text-sm text-gray-600">
                  {workflow.steps} steps
                </div>
              </div>)}
          </>}
        {activeTab === 'revisions' && <>
            <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3">
              <div className="w-1/6 font-medium text-gray-700">Doc No.</div>
              <div className="w-1/6 font-medium text-gray-700">Revision</div>
              <div className="w-1/6 font-medium text-gray-700">Date</div>
              <div className="w-1/6 font-medium text-gray-700">Author</div>
              <div className="w-2/6 font-medium text-gray-700">Project</div>
            </div>
            {recentRevisions.map(revision => <div key={revision.id} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <div className="w-1/6 font-medium text-gray-800">
                  {revision.doc}
                </div>
                <div className="w-1/6 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Rev {revision.rev}
                  </span>
                </div>
                <div className="w-1/6 text-sm text-gray-600">
                  {revision.date}
                </div>
                <div className="w-1/6 text-sm text-gray-600">
                  {revision.author}
                </div>
                <div className="w-2/6 text-sm text-gray-600">
                  {revision.project}
                </div>
              </div>)}
          </>}
      </div>
    </div>;
};