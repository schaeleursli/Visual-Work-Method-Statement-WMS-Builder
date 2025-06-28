import React, { useState } from 'react';
import { HeaderForm } from './HeaderForm';
import { StepChain } from './StepChain';
import { SmartStepChain } from './SmartStepChain';
import { EquipmentSelector } from '../EquipmentSelector';
import { AttachmentsPanel } from './AttachmentsPanel';
import { RiskAssessment } from './RiskAssessment';
import { DocumentControl } from './DocumentControl';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { PDFExport } from '../PDFExport';
import { DocumentManager, Document as DocumentType } from '../DocumentManager/DocumentManager';
import { ArrowLeftIcon, SaveIcon, FileTextIcon, EyeIcon, AlertTriangleIcon, UsersIcon, CheckCircleIcon, MenuIcon, ClipboardIcon, UserIcon, SettingsIcon } from 'lucide-react';
// Mock initial step
const initialStep = {
  id: 1,
  title: 'Load on Barge',
  description: 'Loading cargo onto the barge using shore crane',
  equipment: 'Barge ABC-21',
  additionalEquipment: ['Crane: LTM 11200', 'Rigging: 4-leg chain sling (8t)'],
  attachments: []
};
// Mock cargo items
const initialCargoItems = [{
  id: '1',
  description: 'Transformer Unit',
  length: '6.5',
  width: '3.2',
  height: '3.8',
  weight: '85',
  weightUnit: 'tonnes',
  hazmat: false,
  readyDate: '2023-12-15'
}];
// Mock equipment
const initialEquipment = [{
  id: '1',
  name: 'Barge ABC-21',
  type: 'Vessel',
  capacity: '120 tonnes',
  dimensions: '30m x 12m'
}, {
  id: '2',
  name: 'LTM 11200 Mobile Crane',
  type: 'Crane',
  capacity: '200 tonnes',
  reach: '60m'
}, {
  id: '3',
  name: '4-leg chain sling (8t)',
  type: 'Rigging',
  capacity: '32 tonnes',
  certification: 'LOLER 2023-06'
}];
// Initial user metadata
const initialUserMetadata: UserMetadata = {
  name: 'John Müller',
  phone: '+1 305 555 1000',
  whatsapp: '+1 305 555 1000',
  email: 'john@transportlogix.com',
  address: '312 Freight Blvd, Houston, TX'
};
// Initial company metadata
const initialCompanyMetadata: CompanyMetadata = {
  name: 'TransportLogix USA',
  address: '312 Freight Blvd, Houston, TX',
  website: 'www.transportlogix.com',
  logo: ''
};
export const WMSBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState('steps');
  const [steps, setSteps] = useState([initialStep]);
  const [selectedStep, setSelectedStep] = useState<number | null>(1);
  const [showExport, setShowExport] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [cargoItems, setCargoItems] = useState(initialCargoItems);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [userMetadata, setUserMetadata] = useState<UserMetadata>(initialUserMetadata);
  const [companyMetadata, setCompanyMetadata] = useState<CompanyMetadata>(initialCompanyMetadata);
  // Document metadata state
  const [documentMeta, setDocumentMeta] = useState({
    projectId: 1,
    projectName: 'Offshore Wind Farm Phase II',
    docNo: 'WMS-001',
    revision: '01',
    title: 'Transport to Site A',
    createdBy: 'J. Müller',
    approvedBy: '',
    clientApproval: false,
    status: 'draft'
  });
  const addNewStep = () => {
    const newStep = {
      id: steps.length + 1,
      title: 'New Step',
      description: '',
      equipment: '',
      additionalEquipment: [],
      attachments: []
    };
    setSteps([...steps, newStep]);
    setSelectedStep(newStep.id);
  };
  const updateStep = (updatedStep: any) => {
    setSteps(steps.map(step => step.id === updatedStep.id ? updatedStep : step));
  };
  const removeStep = (stepId: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter(step => step.id !== stepId));
      if (selectedStep === stepId) {
        setSelectedStep(steps[0].id);
      }
    }
  };
  // Collect all risks from all steps
  const getAllRisks = () => {
    return steps.flatMap(step => step.risks || []);
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <button className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {documentMeta.title}
            </h2>
            <p className="text-gray-600">
              {documentMeta.docNo} • Rev {documentMeta.revision} •{' '}
              {documentMeta.projectName}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50">
            <SaveIcon size={18} />
            <span>Save Draft</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2" onClick={() => setShowExport(true)}>
            <FileTextIcon size={18} />
            <span>Generate PDF</span>
          </button>
        </div>
      </div>
      {/* Progress indicator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 py-3 px-4">
        <div className="flex items-center">
          <div className={`flex items-center ${activeTab === 'project' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'project' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              1
            </span>
            Project
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'document' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'document' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              2
            </span>
            Document Info
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'steps' || activeTab === 'equipment' || activeTab === 'attachments' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'steps' || activeTab === 'equipment' || activeTab === 'attachments' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              3
            </span>
            Operations
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'risks' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'risks' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              4
            </span>
            Risks
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'documents' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'documents' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              5
            </span>
            Documents
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'review' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'review' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              6
            </span>
            Review
          </div>
          <div className="w-12 h-0.5 bg-gray-200 mx-2"></div>
          <div className={`flex items-center ${activeTab === 'approval' ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-sm ${activeTab === 'approval' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              7
            </span>
            Approval
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <DocumentControl documentMeta={documentMeta} onUpdateMeta={meta => setDocumentMeta({
        ...documentMeta,
        ...meta
      })} />
      </div>
      <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'steps' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('steps')}>
          Step Builder
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'smart_steps' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('smart_steps')}>
          Smart Workflow
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'risks' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('risks')}>
          <div className="flex items-center space-x-1">
            <AlertTriangleIcon size={16} />
            <span>Risk Assessment</span>
          </div>
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'equipment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('equipment')}>
          Equipment Library
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'attachments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('attachments')}>
          Attachments
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'documents' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('documents')}>
          <div className="flex items-center space-x-1">
            <ClipboardIcon size={16} />
            <span>Documents</span>
          </div>
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'approval' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('approval')}>
          <div className="flex items-center space-x-1">
            <CheckCircleIcon size={16} />
            <span>Approval</span>
          </div>
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'profile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('profile')}>
          <div className="flex items-center space-x-1">
            <UserIcon size={16} />
            <span>User Profile</span>
          </div>
        </button>
        <button className={`py-2 px-4 font-medium rounded-md ${activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('preview')}>
          <div className="flex items-center space-x-1">
            <EyeIcon size={16} />
            <span>Preview</span>
          </div>
        </button>
      </div>
      {activeTab === 'steps' && <StepChain steps={steps} selectedStep={selectedStep} onSelectStep={setSelectedStep} onAddStep={addNewStep} onUpdateStep={updateStep} />}
      {activeTab === 'smart_steps' && <SmartStepChain steps={steps} onUpdateStep={updateStep} onAddStep={addNewStep} onRemoveStep={removeStep} />}
      {activeTab === 'risks' && <RiskAssessment steps={steps} onUpdateStep={updateStep} />}
      {activeTab === 'equipment' && <EquipmentSelector onSelectEquipment={equipment => {
      if (selectedStep) {
        const step = steps.find(s => s.id === selectedStep);
        if (step) {
          const updatedStep = {
            ...step,
            additionalEquipment: [...step.additionalEquipment, equipment]
          };
          updateStep(updatedStep);
        }
      }
    }} />}
      {activeTab === 'attachments' && <AttachmentsPanel steps={steps} selectedStep={selectedStep} onUpdateStep={updateStep} />}
      {activeTab === 'documents' && <DocumentManager documents={documents} onDocumentsChange={setDocuments} steps={steps} risks={getAllRisks()} projectId={documentMeta.projectId} />}
      {activeTab === 'approval' && <ApprovalWorkflow documentMeta={documentMeta} onUpdateMeta={meta => setDocumentMeta({
      ...documentMeta,
      ...meta
    })} />}
      {activeTab === 'profile' && <UserProfile userMetadata={userMetadata} companyMetadata={companyMetadata} onUpdateUserMetadata={setUserMetadata} onUpdateCompanyMetadata={setCompanyMetadata} />}
      {activeTab === 'preview' && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center py-10">
            <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              WMS Preview
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              This will show a preview of how your Work Method Statement will
              appear when generated as a PDF.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md" onClick={() => setShowExport(true)}>
              Generate PDF Preview
            </button>
          </div>
        </div>}
      {showExport && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <PDFExport documentMeta={documentMeta} steps={steps} risks={getAllRisks()} documents={documents} cargoItems={cargoItems} equipment={equipment} userMetadata={userMetadata} companyMetadata={companyMetadata} onClose={() => setShowExport(false)} />
          </div>
        </div>}
    </div>;
};