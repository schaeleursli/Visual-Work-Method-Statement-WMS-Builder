import React, { useState } from 'react';
import { InfoIcon, EditIcon } from 'lucide-react';
interface DocumentMeta {
  projectId: number;
  projectName: string;
  docNo: string;
  revision: string;
  title: string;
  createdBy: string;
  approvedBy: string;
  clientApproval: boolean;
  status: string;
}
interface DocumentControlProps {
  documentMeta: DocumentMeta;
  onUpdateMeta: (meta: Partial<DocumentMeta>) => void;
}
export const DocumentControl: React.FC<DocumentControlProps> = ({
  documentMeta,
  onUpdateMeta
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(documentMeta);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSave = () => {
    onUpdateMeta(formData);
    setIsEditing(false);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Draft
          </span>;
      case 'in-review':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            In Review
          </span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Approved
          </span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Rejected
          </span>;
      default:
        return null;
    }
  };
  // Mock engineers for dropdowns
  const engineers = [{
    id: 1,
    name: 'J. Müller'
  }, {
    id: 2,
    name: 'C. Reyes'
  }, {
    id: 3,
    name: 'S. Johnson'
  }, {
    id: 4,
    name: 'A. Silva'
  }, {
    id: 5,
    name: 'M. Zhang'
  }];
  return <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Document Control</h3>
        {!isEditing ? <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 flex items-center">
            <EditIcon size={16} className="mr-1" />
            Edit
          </button> : <div className="flex space-x-3">
            <button onClick={() => setIsEditing(false)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
              Save Changes
            </button>
          </div>}
      </div>
      {isEditing ? <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Number
            </label>
            <input type="text" name="docNo" value={formData.docNo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revision
            </label>
            <input type="text" name="revision" value={formData.revision} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <select name="createdBy" value={formData.createdBy} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Engineer</option>
              {engineers.map(engineer => <option key={engineer.id} value={engineer.name}>
                  {engineer.name}
                </option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="draft">Draft</option>
              <option value="in-review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div> : <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Document Number
            </h4>
            <p className="text-gray-800">{documentMeta.docNo}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Revision</h4>
            <p className="text-gray-800">{documentMeta.revision}</p>
          </div>
          <div className="col-span-2">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Title</h4>
            <p className="text-gray-800">{documentMeta.title}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Project</h4>
            <p className="text-gray-800">{documentMeta.projectName}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <div>{getStatusBadge(documentMeta.status)}</div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Created By
            </h4>
            <p className="text-gray-800">{documentMeta.createdBy}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Approved By
            </h4>
            <p className="text-gray-800">{documentMeta.approvedBy || '—'}</p>
          </div>
        </div>}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <InfoIcon size={16} className="mr-1 text-blue-500" />
          <span>
            Document revisions are tracked automatically. Create a new revision
            to update an approved document.
          </span>
        </div>
      </div>
    </div>;
};