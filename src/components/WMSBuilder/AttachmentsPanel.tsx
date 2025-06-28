import React from 'react';
import { FileIcon, FileTextIcon, ImageIcon, FileSpreadsheetIcon, XIcon } from 'lucide-react';
interface Step {
  id: number;
  title: string;
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
}
interface AttachmentsPanelProps {
  steps: Step[];
  selectedStep: number | null;
  onUpdateStep: (step: Step) => void;
}
export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({
  steps,
  selectedStep,
  onUpdateStep
}) => {
  // Get all attachments from all steps
  const allAttachments = steps.flatMap(step => step.attachments.map(attachment => ({
    ...attachment,
    stepId: step.id,
    stepTitle: step.title
  })));
  // Mock file upload for a specific step
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, stepId: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const step = steps.find(s => s.id === stepId);
      if (step) {
        const newAttachments = [...step.attachments];
        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files[i];
          newAttachments.push({
            name: file.name,
            type: file.type,
            size: file.size
          });
        }
        onUpdateStep({
          ...step,
          attachments: newAttachments
        });
      }
    }
  };
  // Get the file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileTextIcon size={18} className="text-red-500" />;
    if (fileType.includes('image')) return <ImageIcon size={18} className="text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileSpreadsheetIcon size={18} className="text-green-500" />;
    return <FileIcon size={18} className="text-gray-500" />;
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Attachments</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Upload Documents</h4>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h5 className="font-medium text-gray-700">
                  Select Transport Step
                </h5>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {steps.map(step => <div key={step.id} className={`mb-3 p-3 border rounded-md ${selectedStep === step.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.id}
                        </div>
                        <h6 className="font-medium text-gray-800">
                          {step.title}
                        </h6>
                      </div>
                      <span className="text-sm text-gray-500">
                        {step.attachments.length} files
                      </span>
                    </div>
                    {step.attachments.length > 0 && <ul className="mb-3 space-y-1">
                        {step.attachments.slice(0, 2).map((file, index) => <li key={index} className="text-sm flex items-center space-x-2 text-gray-600">
                            {getFileIcon(file.type || '')}
                            <span className="truncate">{file.name}</span>
                          </li>)}
                        {step.attachments.length > 2 && <li className="text-sm text-gray-500">
                            + {step.attachments.length - 2} more files
                          </li>}
                      </ul>}
                    <div className="flex justify-end">
                      <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                        Upload Files
                        <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx" onChange={e => handleFileUpload(e, step.id)} />
                      </label>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">All Attachments</h4>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h5 className="font-medium text-gray-700">
                  Documents ({allAttachments.length})
                </h5>
                <div className="relative">
                  <input type="text" className="block w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search files..." />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <SearchIcon size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {allAttachments.length > 0 ? <div className="space-y-3">
                    {allAttachments.map((file, index) => <div key={index} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div className="mr-3 mt-1">
                          {getFileIcon(file.type || '')}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h6 className="font-medium text-gray-800 truncate">
                            {file.name}
                          </h6>
                          <p className="text-sm text-gray-500">
                            Step {file.stepId}: {file.stepTitle}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 ml-2">
                          <XIcon size={18} />
                        </button>
                      </div>)}
                  </div> : <div className="text-center py-8">
                    <FileTextIcon size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No attachments yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload files to the transport steps
                    </p>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Helper icon component for search
const SearchIcon: React.FC<{
  size: number;
  className?: string;
}> = ({
  size,
  className
}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>;