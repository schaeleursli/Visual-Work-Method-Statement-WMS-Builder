import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, PlusIcon, XIcon, FileIcon, AlertTriangleIcon, PackageIcon, ImageIcon, MessageSquareIcon } from 'lucide-react';
interface Risk {
  id: string;
  description: string;
  severity: number;
  likelihood: number;
  score: number;
  mitigation: string;
  mitigationType: 'Engineering' | 'Operational' | 'Routing' | 'Communication';
  residualLikelihood: number;
  residualScore: number;
  isCustom?: boolean;
}
interface Step {
  id: number;
  title: string;
  description?: string;
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
  risks?: Risk[];
  photos?: {
    id: string;
    url: string;
    caption: string;
  }[];
  comments?: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}
interface SmartStepBlockProps {
  step: Step;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStep: (step: Step) => void;
  onRemoveStep?: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}
export const SmartStepBlock: React.FC<SmartStepBlockProps> = ({
  step,
  index,
  isExpanded,
  onToggleExpand,
  onUpdateStep,
  onRemoveStep,
  isEditing,
  onToggleEdit
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'equipment' | 'risks' | 'photos' | 'comments'>('details');
  const [newEquipment, setNewEquipment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    description: '',
    severity: 3,
    likelihood: 3,
    mitigation: '',
    mitigationType: 'Operational',
    residualLikelihood: 2,
    isCustom: true
  });
  // Risk assessment utilities
  const getRiskLevel = (score: number) => {
    if (score > 12) return 'high';
    if (score > 5) return 'medium';
    return 'low';
  };
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };
  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdateStep({
      ...step,
      [e.target.name]: e.target.value
    });
  };
  const handleAddEquipment = () => {
    if (newEquipment.trim()) {
      onUpdateStep({
        ...step,
        additionalEquipment: [...step.additionalEquipment, newEquipment.trim()]
      });
      setNewEquipment('');
    }
  };
  const handleRemoveEquipment = (index: number) => {
    const newEquipment = [...step.additionalEquipment];
    newEquipment.splice(index, 1);
    onUpdateStep({
      ...step,
      additionalEquipment: newEquipment
    });
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
  };
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // In a real app, you would upload the file to a server and get a URL
      // For this demo, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      const newPhotos = [...(step.photos || [])];
      newPhotos.push({
        id: Math.random().toString(36).substring(2, 11),
        url: fakeUrl,
        caption: ''
      });
      onUpdateStep({
        ...step,
        photos: newPhotos
      });
    }
  };
  const handleUpdatePhotoCaption = (id: string, caption: string) => {
    if (!step.photos) return;
    const newPhotos = step.photos.map(photo => photo.id === id ? {
      ...photo,
      caption
    } : photo);
    onUpdateStep({
      ...step,
      photos: newPhotos
    });
  };
  const handleRemovePhoto = (id: string) => {
    if (!step.photos) return;
    onUpdateStep({
      ...step,
      photos: step.photos.filter(photo => photo.id !== id)
    });
  };
  const handleAddComment = () => {
    if (newComment.trim()) {
      const newComments = [...(step.comments || [])];
      newComments.push({
        id: Math.random().toString(36).substring(2, 11),
        author: 'J. Müller',
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      });
      onUpdateStep({
        ...step,
        comments: newComments
      });
      setNewComment('');
    }
  };
  const handleAddRisk = () => {
    setIsAddingRisk(true);
    setNewRisk({
      description: '',
      severity: 3,
      likelihood: 3,
      mitigation: '',
      mitigationType: 'Operational',
      residualLikelihood: 2,
      isCustom: true
    });
  };
  const handleSaveNewRisk = () => {
    if (newRisk.description) {
      const severity = newRisk.severity || 3;
      const likelihood = newRisk.likelihood || 3;
      const residualLikelihood = newRisk.residualLikelihood || 2;
      const risk: Risk = {
        id: Math.random().toString(36).substring(2, 11),
        description: newRisk.description,
        severity,
        likelihood,
        score: severity * likelihood,
        mitigation: newRisk.mitigation || '',
        mitigationType: newRisk.mitigationType || 'Operational',
        residualLikelihood,
        residualScore: severity * residualLikelihood,
        isCustom: true
      };
      onUpdateStep({
        ...step,
        risks: [...(step.risks || []), risk]
      });
      setIsAddingRisk(false);
    }
  };
  const handleUpdateRisk = (riskId: string, field: keyof Risk, value: any) => {
    if (!step.risks) return;
    const updatedRisks = step.risks.map(risk => {
      if (risk.id === riskId) {
        const updatedRisk = {
          ...risk,
          [field]: value
        };
        // Recalculate scores if needed
        if (field === 'severity' || field === 'likelihood') {
          updatedRisk.score = updatedRisk.severity * updatedRisk.likelihood;
        }
        if (field === 'severity' || field === 'residualLikelihood') {
          updatedRisk.residualScore = updatedRisk.severity * updatedRisk.residualLikelihood;
        }
        return updatedRisk;
      }
      return risk;
    });
    onUpdateStep({
      ...step,
      risks: updatedRisks
    });
  };
  const handleDeleteRisk = (riskId: string) => {
    if (!step.risks) return;
    onUpdateStep({
      ...step,
      risks: step.risks.filter(risk => risk.id !== riskId)
    });
  };
  // Calculate ALARP status
  const calculateAlarpStatus = (risks: Risk[] | undefined) => {
    if (!risks || risks.length === 0) return {
      percentage: 0,
      isCompliant: false
    };
    const totalRisks = risks.length;
    const highRisksRemaining = risks.filter(risk => risk.residualScore > 12).length;
    const mediumRisksRemaining = risks.filter(risk => risk.residualScore > 5 && risk.residualScore <= 12).length;
    const lowRisks = risks.filter(risk => risk.residualScore <= 5).length;
    // ALARP compliance means no high risks and medium risks are justified
    const isCompliant = highRisksRemaining === 0;
    // Calculate percentage based on risk reduction
    const percentage = Math.round(lowRisks / totalRisks * 100);
    return {
      percentage,
      isCompliant
    };
  };
  const alarpStatus = calculateAlarpStatus(step.risks);
  return <div className="border border-gray-200 rounded-md overflow-hidden mb-4">
      {/* Header */}
      <div className={`p-3 border-b border-gray-200 flex justify-between items-center cursor-pointer ${isExpanded ? 'bg-blue-50' : 'bg-gray-50'}`} onClick={onToggleExpand}>
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          <h4 className="font-medium text-gray-800">{step.title}</h4>
          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {step.equipment && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Equipment
              </div>}
            {step.risks && step.risks.length > 0 && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {step.risks.length} Risks
              </div>}
            {step.photos && step.photos.length > 0 && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {step.photos.length} Photos
              </div>}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* ALARP status */}
          {step.risks && step.risks.length > 0 && <div className="flex items-center mr-2">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                <div className={`h-2 rounded-full ${alarpStatus.isCompliant ? 'bg-green-500' : 'bg-yellow-500'}`} style={{
              width: `${alarpStatus.percentage}%`
            }}></div>
              </div>
              <span className="text-xs text-gray-600">
                {alarpStatus.percentage}% ALARP
              </span>
            </div>}
          {/* Edit button */}
          <button onClick={e => {
          e.stopPropagation();
          onToggleEdit();
        }} className="text-gray-500 hover:text-blue-600 text-sm">
            {isEditing ? 'Done' : 'Edit'}
          </button>
          {/* Expand/collapse icon */}
          {isExpanded ? <ChevronDownIcon size={20} className="text-gray-500" /> : <ChevronRightIcon size={20} className="text-gray-500" />}
        </div>
      </div>
      {/* Expanded content */}
      {isExpanded && <div className="p-4">
          {/* Tabs */}
          <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
            <button className={`py-1.5 px-3 text-sm font-medium rounded-md ${activeTab === 'details' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('details')}>
              Details
            </button>
            <button className={`py-1.5 px-3 text-sm font-medium rounded-md ${activeTab === 'equipment' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('equipment')}>
              <div className="flex items-center space-x-1">
                <PackageIcon size={14} />
                <span>Equipment</span>
              </div>
            </button>
            <button className={`py-1.5 px-3 text-sm font-medium rounded-md ${activeTab === 'risks' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('risks')}>
              <div className="flex items-center space-x-1">
                <AlertTriangleIcon size={14} />
                <span>Risks</span>
              </div>
            </button>
            <button className={`py-1.5 px-3 text-sm font-medium rounded-md ${activeTab === 'photos' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('photos')}>
              <div className="flex items-center space-x-1">
                <ImageIcon size={14} />
                <span>Photos</span>
              </div>
            </button>
            <button className={`py-1.5 px-3 text-sm font-medium rounded-md ${activeTab === 'comments' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} onClick={() => setActiveTab('comments')}>
              <div className="flex items-center space-x-1">
                <MessageSquareIcon size={14} />
                <span>Comments</span>
                {step.comments && step.comments.length > 0 && <span className="ml-1 w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center">
                    {step.comments.length}
                  </span>}
              </div>
            </button>
          </div>
          {/* Tab content */}
          <div className="bg-white border border-gray-200 rounded-md">
            {/* Details tab */}
            {activeTab === 'details' && <div className="p-4">
                {isEditing ? <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Step Title
                      </label>
                      <input type="text" name="title" value={step.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Step Description
                      </label>
                      <textarea name="description" value={step.description || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the operation in detail..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Equipment
                      </label>
                      <input type="text" name="equipment" value={step.equipment} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Barge ABC-21, Crane LTM 11200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attachments
                      </label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                        <div className="text-center">
                          <FileIcon size={24} className="mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload PDF documents for this step
                          </p>
                          <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                            Select Files
                            <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                          </label>
                        </div>
                      </div>
                      {step.attachments.length > 0 && <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Files:
                          </p>
                          <ul className="space-y-1">
                            {step.attachments.map((file, index) => <li key={index} className="text-sm flex items-center space-x-2 text-gray-600">
                                <FileIcon size={14} />
                                <span>{file.name}</span>
                              </li>)}
                          </ul>
                        </div>}
                    </div>
                  </div> : <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-800 mb-1">
                        {step.title}
                      </h4>
                      <p className="text-gray-600">
                        Step {index + 1} in the transport chain
                      </p>
                    </div>
                    {step.description && <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">
                          Description
                        </h5>
                        <p className="text-gray-800">{step.description}</p>
                      </div>}
                    {step.equipment && <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">
                          Primary Equipment
                        </h5>
                        <p className="text-gray-800">{step.equipment}</p>
                      </div>}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Attachments
                      </h5>
                      {step.attachments.length > 0 ? <ul className="space-y-1">
                          {step.attachments.map((file, index) => <li key={index} className="text-sm flex items-center space-x-2 text-gray-600">
                              <FileIcon size={14} />
                              <span>{file.name}</span>
                            </li>)}
                        </ul> : <p className="text-gray-500 text-sm">
                          No attachments added
                        </p>}
                    </div>
                  </div>}
              </div>}
            {/* Equipment tab */}
            {activeTab === 'equipment' && <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  Equipment for this Step
                </h4>
                {step.equipment && <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      Primary Equipment
                    </h5>
                    <p className="text-gray-800 font-medium">
                      {step.equipment}
                    </p>
                  </div>}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      Additional Equipment
                    </h5>
                    {isEditing && <button onClick={() => {
                const el = document.getElementById('add-equipment-input');
                if (el) el.focus();
              }} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                        <PlusIcon size={14} className="mr-1" />
                        Add Item
                      </button>}
                  </div>
                  {step.additionalEquipment.length > 0 ? <ul className="space-y-2 mb-3">
                      {step.additionalEquipment.map((item, index) => <li key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
                          <div className="flex items-start">
                            <ChevronRightIcon size={16} className="mr-2 mt-0.5 text-gray-400" />
                            <span>{item}</span>
                          </div>
                          {isEditing && <button onClick={() => handleRemoveEquipment(index)} className="text-gray-400 hover:text-red-500">
                              <XIcon size={16} />
                            </button>}
                        </li>)}
                    </ul> : <p className="text-gray-500 text-sm mb-3">
                      No additional equipment added
                    </p>}
                  {isEditing && <div className="mt-3 flex items-center space-x-2">
                      <input id="add-equipment-input" type="text" value={newEquipment} onChange={e => setNewEquipment(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Rigging: 4-leg chain sling (8t)" onKeyPress={e => {
                if (e.key === 'Enter') handleAddEquipment();
              }} />
                      <button onClick={handleAddEquipment} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Add
                      </button>
                    </div>}
                </div>
              </div>}
            {/* Risks tab */}
            {activeTab === 'risks' && <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Risk Assessment</h4>
                  {isEditing && !isAddingRisk && <button onClick={handleAddRisk} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
                      <PlusIcon size={14} />
                      <span>Add Risk</span>
                    </button>}
                </div>
                {/* Risk matrix legend */}
                <div className="flex items-center space-x-4 mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">High (&gt;12)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600">Medium (6-12)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Low (≤5)</span>
                  </div>
                </div>
                {/* ALARP status */}
                {step.risks && step.risks.length > 0 && <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-700">
                        ALARP Status
                      </h5>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className={`h-2.5 rounded-full ${alarpStatus.isCompliant ? 'bg-green-500' : 'bg-yellow-500'}`} style={{
                    width: `${alarpStatus.percentage}%`
                  }}></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {alarpStatus.percentage}% ALARP
                        </span>
                      </div>
                    </div>
                  </div>}
                {/* Risk list */}
                {step.risks && step.risks.length > 0 ? <div className="space-y-4">
                    {step.risks.map(risk => <div key={risk.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="bg-gray-50 p-3 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium text-gray-800">
                              {risk.description}
                            </h5>
                            {isEditing && risk.isCustom && <button onClick={() => handleDeleteRisk(risk.id)} className="text-gray-400 hover:text-red-500">
                                <XIcon size={16} />
                              </button>}
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <h6 className="text-xs font-medium text-gray-500 mb-1">
                                Initial Risk
                              </h6>
                              <div className="flex items-center space-x-2">
                                <div className={`px-2 py-1 rounded-md text-sm font-medium ${getRiskLevelColor(getRiskLevel(risk.score))}`}>
                                  {risk.score} -{' '}
                                  {getRiskLevelText(getRiskLevel(risk.score))}
                                </div>
                                {isEditing && <div className="text-xs text-gray-500">
                                    (S:{risk.severity} × L:{risk.likelihood})
                                  </div>}
                              </div>
                            </div>
                            <div>
                              <h6 className="text-xs font-medium text-gray-500 mb-1">
                                Residual Risk
                              </h6>
                              <div className="flex items-center space-x-2">
                                <div className={`px-2 py-1 rounded-md text-sm font-medium ${getRiskLevelColor(getRiskLevel(risk.residualScore))}`}>
                                  {risk.residualScore} -{' '}
                                  {getRiskLevelText(getRiskLevel(risk.residualScore))}
                                </div>
                                {isEditing && <div className="text-xs text-gray-500">
                                    (S:{risk.severity} × L:
                                    {risk.residualLikelihood})
                                  </div>}
                              </div>
                            </div>
                          </div>
                          <div className="mb-2">
                            <h6 className="text-xs font-medium text-gray-500 mb-1">
                              Mitigation
                            </h6>
                            {isEditing ? <textarea value={risk.mitigation} onChange={e => handleUpdateRisk(risk.id, 'mitigation', e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" rows={2} /> : <p className="text-sm text-gray-800">
                                {risk.mitigation}
                              </p>}
                          </div>
                          {isEditing && <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Severity
                                </label>
                                <select value={risk.severity} onChange={e => handleUpdateRisk(risk.id, 'severity', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value={1}>1 - Minimal</option>
                                  <option value={2}>2 - Minor</option>
                                  <option value={3}>3 - Moderate</option>
                                  <option value={4}>4 - Major</option>
                                  <option value={5}>5 - Catastrophic</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Initial Likelihood
                                </label>
                                <select value={risk.likelihood} onChange={e => handleUpdateRisk(risk.id, 'likelihood', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value={1}>1 - Rare</option>
                                  <option value={2}>2 - Unlikely</option>
                                  <option value={3}>3 - Possible</option>
                                  <option value={4}>4 - Likely</option>
                                  <option value={5}>5 - Almost Certain</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">
                                  Residual Likelihood
                                </label>
                                <select value={risk.residualLikelihood} onChange={e => handleUpdateRisk(risk.id, 'residualLikelihood', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value={1}>1 - Rare</option>
                                  <option value={2}>2 - Unlikely</option>
                                  <option value={3}>3 - Possible</option>
                                  <option value={4}>4 - Likely</option>
                                  <option value={5}>5 - Almost Certain</option>
                                </select>
                              </div>
                            </div>}
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-md">
                    <AlertTriangleIcon size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      No risks identified for this step yet
                    </p>
                    {isEditing && <button onClick={handleAddRisk} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                        Add Risk
                      </button>}
                  </div>}
                {/* Add new risk form */}
                {isAddingRisk && <div className="mt-4 border border-blue-200 rounded-md p-4 bg-blue-50">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Add New Risk
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Risk Description
                        </label>
                        <input type="text" value={newRisk.description} onChange={e => setNewRisk({
                  ...newRisk,
                  description: e.target.value
                })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Describe the risk..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Assessment
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Severity
                              </label>
                              <select value={newRisk.severity} onChange={e => setNewRisk({
                        ...newRisk,
                        severity: parseInt(e.target.value)
                      })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value={1}>1 - Minimal</option>
                                <option value={2}>2 - Minor</option>
                                <option value={3}>3 - Moderate</option>
                                <option value={4}>4 - Major</option>
                                <option value={5}>5 - Catastrophic</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Likelihood
                              </label>
                              <select value={newRisk.likelihood} onChange={e => setNewRisk({
                        ...newRisk,
                        likelihood: parseInt(e.target.value)
                      })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value={1}>1 - Rare</option>
                                <option value={2}>2 - Unlikely</option>
                                <option value={3}>3 - Possible</option>
                                <option value={4}>4 - Likely</option>
                                <option value={5}>5 - Almost Certain</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mitigation
                          </label>
                          <textarea value={newRisk.mitigation} onChange={e => setNewRisk({
                    ...newRisk,
                    mitigation: e.target.value
                  })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="How will this risk be mitigated?" rows={1} />
                          <div className="mt-1">
                            <select value={newRisk.mitigationType} onChange={e => setNewRisk({
                      ...newRisk,
                      mitigationType: e.target.value as any
                    })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value="Engineering">Engineering</option>
                              <option value="Operational">Operational</option>
                              <option value="Routing">Routing</option>
                              <option value="Communication">
                                Communication
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Residual Likelihood
                        </label>
                        <select value={newRisk.residualLikelihood} onChange={e => setNewRisk({
                  ...newRisk,
                  residualLikelihood: parseInt(e.target.value)
                })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value={1}>1 - Rare</option>
                          <option value={2}>2 - Unlikely</option>
                          <option value={3}>3 - Possible</option>
                          <option value={4}>4 - Likely</option>
                          <option value={5}>5 - Almost Certain</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 mt-2">
                        <button onClick={() => setIsAddingRisk(false)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                          Cancel
                        </button>
                        <button onClick={handleSaveNewRisk} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" disabled={!newRisk.description}>
                          Save Risk
                        </button>
                      </div>
                    </div>
                  </div>}
              </div>}
            {/* Photos tab */}
            {activeTab === 'photos' && <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">
                    Photos & Diagrams
                  </h4>
                  {isEditing && <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm cursor-pointer">
                      <PlusIcon size={14} />
                      <span>Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>}
                </div>
                {step.photos && step.photos.length > 0 ? <div className="grid grid-cols-2 gap-4">
                    {step.photos.map(photo => <div key={photo.id} className="border border-gray-200 rounded-md overflow-hidden">
                        <div className="relative h-48 bg-gray-100">
                          <img src={photo.url} alt={photo.caption || 'Operation photo'} className="w-full h-full object-cover" />
                          {isEditing && <button onClick={() => handleRemovePhoto(photo.id)} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm text-red-500 hover:text-red-700">
                              <XIcon size={16} />
                            </button>}
                        </div>
                        <div className="p-3">
                          {isEditing ? <input type="text" value={photo.caption} onChange={e => handleUpdatePhotoCaption(photo.id, e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Add a caption..." /> : <p className="text-sm text-gray-600">
                              {photo.caption || 'No caption provided'}
                            </p>}
                        </div>
                      </div>)}
                  </div> : <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-md">
                    <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">
                      No photos added for this step yet
                    </p>
                    {isEditing && <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm inline-block cursor-pointer">
                        Upload Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                      </label>}
                  </div>}
              </div>}
            {/* Comments tab */}
            {activeTab === 'comments' && <div className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  Comments & Notes
                </h4>
                <div className="space-y-4 mb-4">
                  {step.comments && step.comments.length > 0 ? step.comments.map(comment => <div key={comment.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-800">
                            {comment.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>) : <div className="text-center py-4 bg-gray-50 border border-gray-200 rounded-md">
                      <MessageSquareIcon size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">No comments yet</p>
                    </div>}
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Comment
                  </label>
                  <div className="flex space-x-2">
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Add a comment or note..." rows={2} />
                    <button onClick={handleAddComment} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 self-end" disabled={!newComment.trim()}>
                      Post
                    </button>
                  </div>
                </div>
              </div>}
          </div>
        </div>}
    </div>;
};