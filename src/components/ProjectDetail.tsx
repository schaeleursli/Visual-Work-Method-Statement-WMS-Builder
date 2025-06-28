import React, { useState, createElement } from 'react';
import { PlusIcon, SearchIcon, FilterIcon, FileTextIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ArrowLeftIcon, CopyIcon, DownloadIcon, EyeIcon, EditIcon, XIcon } from 'lucide-react';
// Mock data for project
const mockProject = {
  id: 1,
  name: 'Offshore Wind Farm Phase II',
  client: 'WindPower GmbH',
  location: 'North Sea, Germany',
  status: 'in-progress',
  startDate: '2023-10-01',
  endDate: '2024-06-30'
};
// Mock data for WMS documents
const mockWMSDocuments = [{
  id: 1,
  docNo: 'WMS-001',
  title: 'Transport to Site A',
  revision: '01',
  status: 'in-review',
  createdBy: 'J. Müller',
  approvedBy: 'A. Silva',
  clientSignOff: false,
  lastUpdated: '2023-11-10',
  content: 'This document details the transport procedures to Site A...'
}, {
  id: 2,
  docNo: 'WMS-002',
  title: 'Barge Offload Holmaneset',
  revision: '00',
  status: 'draft',
  createdBy: 'C. Reyes',
  approvedBy: '',
  clientSignOff: false,
  lastUpdated: '2023-11-05',
  content: 'Procedures for offloading equipment from barges at Holmaneset...'
}, {
  id: 3,
  docNo: 'WMS-003',
  title: 'Crane Lift - Nacelle Installation',
  revision: '02',
  status: 'approved',
  createdBy: 'J. Müller',
  approvedBy: 'A. Silva',
  clientSignOff: true,
  lastUpdated: '2023-10-28',
  content: 'Safety procedures and technical specifications for nacelle installation using cranes...'
}, {
  id: 4,
  docNo: 'WMS-004',
  title: 'Cable Laying Operations',
  revision: '01',
  status: 'approved',
  createdBy: 'S. Johnson',
  approvedBy: 'A. Silva',
  clientSignOff: true,
  lastUpdated: '2023-10-15',
  content: 'Guidelines for subsea cable laying operations for the wind farm...'
}, {
  id: 5,
  docNo: 'WMS-005',
  title: 'Foundation Installation',
  revision: '03',
  status: 'in-review',
  createdBy: 'C. Reyes',
  approvedBy: '',
  clientSignOff: false,
  lastUpdated: '2023-11-12',
  content: 'Procedures for installing wind turbine foundations in offshore conditions...'
}];
interface ProjectDetailProps {
  projectId?: number;
  onBack?: () => void;
}
export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  projectId = 1,
  onBack = () => console.log('Go back')
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);
  // New state variables for document actions
  const [viewDocument, setViewDocument] = useState<any | null>(null);
  const [editDocument, setEditDocument] = useState<any | null>(null);
  const [showNewRevisionModal, setShowNewRevisionModal] = useState(false);
  const [documentForRevision, setDocumentForRevision] = useState<any | null>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [documentForDuplicate, setDocumentForDuplicate] = useState<any | null>(null);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon size={18} className="text-green-500" />;
      case 'in-review':
        return <ClockIcon size={18} className="text-yellow-500" />;
      case 'draft':
        return <FileTextIcon size={18} className="text-gray-400" />;
      case 'rejected':
        return <XCircleIcon size={18} className="text-red-500" />;
      default:
        return null;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'in-review':
        return 'In Review';
      case 'draft':
        return 'Draft';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };
  const filteredDocuments = mockWMSDocuments.filter(doc => {
    const matchesSearch = doc.docNo.toLowerCase().includes(searchTerm.toLowerCase()) || doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? doc.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  // Handler for viewing a document
  const handleViewDocument = (doc: any) => {
    setViewDocument(doc);
    setShowActionMenu(null);
  };
  // Handler for editing a document
  const handleEditDocument = (doc: any) => {
    setEditDocument(doc);
    setShowActionMenu(null);
    // In a real app, you would navigate to the WMS Builder with this document loaded
    alert(`Navigating to WMS Builder to edit ${doc.docNo}`);
  };
  // Handler for creating a new revision
  const handleNewRevision = (doc: any) => {
    setDocumentForRevision(doc);
    setShowNewRevisionModal(true);
    setShowActionMenu(null);
  };
  // Handler for duplicating a document
  const handleDuplicate = (doc: any) => {
    setDocumentForDuplicate(doc);
    setShowDuplicateModal(true);
    setShowActionMenu(null);
  };
  // Handler for downloading a PDF
  const handleDownloadPDF = (doc: any) => {
    // In a real app, this would trigger an actual download
    // For now, we'll simulate it with an alert
    alert(`Downloading PDF for ${doc.docNo} - ${doc.title}`);
    setShowActionMenu(null);
    // Create a simulated download delay
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([`WMS Document: ${doc.docNo}\nTitle: ${doc.title}\nContent: ${doc.content}`], {
        type: 'text/plain'
      });
      element.href = URL.createObjectURL(file);
      element.download = `${doc.docNo}_${doc.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  // Handler for creating a new revision
  const createNewRevision = () => {
    if (!documentForRevision) return;
    const currentRevision = parseInt(documentForRevision.revision, 10) || 0;
    const newRevision = (currentRevision + 1).toString().padStart(2, '0');
    alert(`Created new revision ${newRevision} of document ${documentForRevision.docNo}`);
    setShowNewRevisionModal(false);
    setDocumentForRevision(null);
  };
  // Handler for duplicating a document
  const createDuplicate = () => {
    if (!documentForDuplicate) return;
    const newDocNo = `${documentForDuplicate.docNo}-COPY`;
    alert(`Created duplicate of ${documentForDuplicate.docNo} with new document number ${newDocNo}`);
    setShowDuplicateModal(false);
    setDocumentForDuplicate(null);
  };
  return <div>
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {mockProject.name}
          </h2>
          <p className="text-gray-600">
            {mockProject.client} • {mockProject.location}
          </p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Work Method Statements
        </h3>
        <button onClick={() => console.log('Create new WMS')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2">
          <PlusIcon size={18} />
          <span>Create New WMS</span>
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search WMS documents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value || null)}>
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in-review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FilterIcon size={18} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="w-1/6 font-medium text-gray-700">Doc No.</div>
          <div className="w-1/4 font-medium text-gray-700">Title</div>
          <div className="w-1/12 font-medium text-gray-700">Rev</div>
          <div className="w-1/6 font-medium text-gray-700">Status</div>
          <div className="w-1/6 font-medium text-gray-700">Created By</div>
          <div className="w-1/6 font-medium text-gray-700">Approved By</div>
          <div className="w-1/12 font-medium text-gray-700"></div>
        </div>
        {filteredDocuments.length > 0 ? filteredDocuments.map(doc => <div key={doc.id} className="flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
              <div className="w-1/6 font-medium text-gray-800">{doc.docNo}</div>
              <div className="w-1/4 text-gray-800">{doc.title}</div>
              <div className="w-1/12 text-gray-600">{doc.revision}</div>
              <div className="w-1/6">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(doc.status)}
                  <span className="text-sm text-gray-600">
                    {getStatusText(doc.status)}
                  </span>
                </div>
              </div>
              <div className="w-1/6 text-gray-600">{doc.createdBy}</div>
              <div className="w-1/6 text-gray-600">
                {doc.approvedBy || '—'}
                {doc.clientSignOff && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Client Approved
                  </span>}
              </div>
              <div className="w-1/12 relative">
                <button onClick={() => setShowActionMenu(showActionMenu === doc.id ? null : doc.id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
                {showActionMenu === doc.id && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button onClick={() => handleViewDocument(doc)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <EyeIcon size={16} className="mr-2" />
                        View
                      </button>
                      <button onClick={() => handleEditDocument(doc)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <EditIcon size={16} className="mr-2" />
                        Edit
                      </button>
                      <button onClick={() => handleNewRevision(doc)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <FileTextIcon size={16} className="mr-2" />
                        New Revision
                      </button>
                      <button onClick={() => handleDuplicate(doc)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <CopyIcon size={16} className="mr-2" />
                        Duplicate
                      </button>
                      <button onClick={() => handleDownloadPDF(doc)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <DownloadIcon size={16} className="mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>}
              </div>
            </div>) : <div className="px-6 py-8 text-center text-gray-500">
            No WMS documents found matching your criteria
          </div>}
      </div>
      {/* View Document Modal */}
      {viewDocument && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {viewDocument.docNo}: {viewDocument.title}
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setViewDocument(null)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Document Number</p>
                  <p className="font-medium">{viewDocument.docNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Revision</p>
                  <p className="font-medium">{viewDocument.revision}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(viewDocument.status)}
                    <span>{getStatusText(viewDocument.status)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{viewDocument.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="font-medium">{viewDocument.createdBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved By</p>
                  <p className="font-medium">
                    {viewDocument.approvedBy || '—'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Content</p>
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                  <p>{viewDocument.content}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => handleDownloadPDF(viewDocument)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                  <DownloadIcon size={16} className="mr-2" />
                  Download PDF
                </button>
                <button onClick={() => {
              setViewDocument(null);
              handleEditDocument(viewDocument);
            }} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center">
                  <EditIcon size={16} className="mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* New Revision Modal */}
      {showNewRevisionModal && documentForRevision && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Create New Revision
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowNewRevisionModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                You are creating a new revision of document{' '}
                <span className="font-medium">{documentForRevision.docNo}</span>
                : {documentForRevision.title}
              </p>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Current Revision</p>
                <p className="font-medium">{documentForRevision.revision}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">New Revision</p>
                <p className="font-medium">
                  {(parseInt(documentForRevision.revision, 10) + 1).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowNewRevisionModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={createNewRevision} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create New Revision
                </button>
              </div>
            </div>
          </div>
        </div>}
      {/* Duplicate Document Modal */}
      {showDuplicateModal && documentForDuplicate && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Duplicate Document
              </h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowDuplicateModal(false)}>
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                You are creating a duplicate of document{' '}
                <span className="font-medium">
                  {documentForDuplicate.docNo}
                </span>
                : {documentForDuplicate.title}
              </p>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Original Document</p>
                <p className="font-medium">{documentForDuplicate.docNo}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  New Document Number
                </p>
                <p className="font-medium">{documentForDuplicate.docNo}-COPY</p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowDuplicateModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={createDuplicate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Create Duplicate
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};