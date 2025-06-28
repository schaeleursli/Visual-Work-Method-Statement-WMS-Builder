import React, { useState, useRef, memo } from 'react';
import { FileTextIcon, UploadIcon, XIcon, SearchIcon, EyeIcon, TrashIcon, TagIcon, FilterIcon, SortAscIcon, PlusIcon, ExternalLinkIcon, FileIcon, ClipboardCheckIcon, MapIcon, ShieldIcon, TruckIcon, CalculatorIcon } from 'lucide-react';
// Document types and interfaces
export interface Document {
  id: string;
  documentNo: string;
  description: string;
  revision: string;
  category: DocumentCategory;
  file: File | null;
  uploadDate: string;
  taggedSteps: number[];
  taggedRisks: string[];
  previewUrl?: string;
}
export type DocumentCategory = 'Permit' | 'Survey' | 'Engineering' | 'Insurance' | 'Transport Plan' | 'Risk Matrix';
interface DocumentManagerProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
  steps?: any[];
  risks?: any[];
  projectId?: number;
}
export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onDocumentsChange,
  steps = [],
  risks = [],
  projectId
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'documentNo' | 'uploadDate' | 'category'>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentDocumentForTagging, setCurrentDocumentForTagging] = useState<string | null>(null);
  // For new document upload
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    documentNo: '',
    description: '',
    revision: '00',
    category: 'Engineering',
    taggedSteps: [],
    taggedRisks: []
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Auto-generate document number
  const generateDocumentNumber = () => {
    const prefix = 'WMS-DOC-';
    const existingNumbers = documents.map(doc => doc.documentNo).filter(no => no.startsWith(prefix)).map(no => parseInt(no.replace(prefix, ''), 10)).filter(no => !isNaN(no));
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  };
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setNewDocument({
        ...newDocument,
        file,
        previewUrl,
        uploadDate: new Date().toISOString()
      });
    }
  };
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };
  // Handle document upload
  const handleUploadDocument = () => {
    if (!newDocument.description || !newDocument.file) {
      return; // Validation failed
    }
    const documentNo = newDocument.documentNo || generateDocumentNumber();
    const newDoc: Document = {
      id: Math.random().toString(36).substring(2, 11),
      documentNo,
      description: newDocument.description,
      revision: newDocument.revision || '00',
      category: newDocument.category as DocumentCategory,
      file: newDocument.file,
      uploadDate: newDocument.uploadDate || new Date().toISOString(),
      taggedSteps: newDocument.taggedSteps || [],
      taggedRisks: newDocument.taggedRisks || [],
      previewUrl: newDocument.previewUrl
    };
    onDocumentsChange([...documents, newDoc]);
    // Reset form
    setNewDocument({
      documentNo: '',
      description: '',
      revision: '00',
      category: 'Engineering',
      taggedSteps: [],
      taggedRisks: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveTab('list');
  };
  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    // Revoke object URL to prevent memory leaks
    const docToDelete = documents.find(doc => doc.id === id);
    if (docToDelete?.previewUrl) {
      URL.revokeObjectURL(docToDelete.previewUrl);
    }
    onDocumentsChange(documents.filter(doc => doc.id !== id));
    if (selectedDocument === id) {
      setSelectedDocument(null);
    }
  };
  // Open tag modal for a document
  const openTagModal = (documentId: string) => {
    setCurrentDocumentForTagging(documentId);
    setShowTagModal(true);
  };
  // Handle document tagging
  const handleTagDocument = (documentId: string, stepId: number, isTagged: boolean) => {
    onDocumentsChange(documents.map(doc => {
      if (doc.id === documentId) {
        const taggedSteps = isTagged ? [...doc.taggedSteps, stepId] : doc.taggedSteps.filter(id => id !== stepId);
        return {
          ...doc,
          taggedSteps
        };
      }
      return doc;
    }));
  };
  // Handle risk tagging
  const handleTagRisk = (documentId: string, riskId: string, isTagged: boolean) => {
    onDocumentsChange(documents.map(doc => {
      if (doc.id === documentId) {
        const taggedRisks = isTagged ? [...doc.taggedRisks, riskId] : doc.taggedRisks.filter(id => id !== riskId);
        return {
          ...doc,
          taggedRisks
        };
      }
      return doc;
    }));
  };
  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.documentNo.toLowerCase().includes(searchTerm.toLowerCase()) || doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'documentNo') {
      comparison = a.documentNo.localeCompare(b.documentNo);
    } else if (sortBy === 'uploadDate') {
      comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  // Get category icon
  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case 'Permit':
        return <ClipboardCheckIcon size={16} className="text-green-500" />;
      case 'Survey':
        return <MapIcon size={16} className="text-blue-500" />;
      case 'Engineering':
        return <CalculatorIcon size={16} className="text-purple-500" />;
      case 'Insurance':
        return <ShieldIcon size={16} className="text-indigo-500" />;
      case 'Transport Plan':
        return <TruckIcon size={16} className="text-orange-500" />;
      case 'Risk Matrix':
        return <FileTextIcon size={16} className="text-red-500" />;
      default:
        return <FileIcon size={16} className="text-gray-500" />;
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex">
          <button className={`px-4 py-3 font-medium text-sm ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('list')}>
            Document Library
          </button>
          <button className={`px-4 py-3 font-medium text-sm ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-800'}`} onClick={() => setActiveTab('upload')}>
            Upload New Document
          </button>
        </div>
      </div>
      {activeTab === 'list' && <div className="p-6">
          <div className="flex space-x-4 mb-4">
            {/* Search */}
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-400" />
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search documents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            {/* Category Filter */}
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as any)}>
                <option value="All">All Categories</option>
                <option value="Permit">Permit</option>
                <option value="Survey">Survey</option>
                <option value="Engineering">Engineering</option>
                <option value="Insurance">Insurance</option>
                <option value="Transport Plan">Transport Plan</option>
                <option value="Risk Matrix">Risk Matrix</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FilterIcon size={18} className="text-gray-400" />
              </div>
            </div>
            {/* Sort */}
            <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50" onClick={() => {
          if (sortBy === 'uploadDate') {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
          } else {
            setSortBy('uploadDate');
            setSortDirection('desc');
          }
        }}>
              <SortAscIcon size={18} className="text-gray-500" />
              <span className="text-sm text-gray-700">
                {sortBy === 'uploadDate' ? `Date ${sortDirection === 'asc' ? '↑' : '↓'}` : 'Sort by Date'}
              </span>
            </button>
          </div>
          {filteredDocuments.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map(doc => <div key={doc.id} className={`border rounded-md overflow-hidden hover:shadow-md transition-shadow ${selectedDocument === doc.id ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}`} onClick={() => setSelectedDocument(doc.id === selectedDocument ? null : doc.id)}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(doc.category)}
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {doc.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button onClick={e => {
                  e.stopPropagation();
                  openTagModal(doc.id);
                }} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100" title="Tag to steps/risks">
                          <TagIcon size={16} />
                        </button>
                        <button onClick={e => {
                  e.stopPropagation();
                  handleDeleteDocument(doc.id);
                }} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100" title="Delete document">
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      {doc.description}
                    </h4>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                      <span>{doc.documentNo}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Rev {doc.revision}
                      </span>
                    </div>
                    {doc.previewUrl && <div className="relative h-32 bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                          <button onClick={e => {
                  e.stopPropagation();
                  window.open(doc.previewUrl, '_blank');
                }} className="p-2 bg-white rounded-full">
                            <EyeIcon size={20} className="text-gray-800" />
                          </button>
                        </div>
                        <FileTextIcon size={36} className="text-gray-400" />
                        <span className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-0.5 rounded">
                          PDF
                        </span>
                      </div>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.taggedSteps.length > 0 && <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                          {doc.taggedSteps.length} step
                          {doc.taggedSteps.length > 1 ? 's' : ''}
                        </span>}
                      {doc.taggedRisks.length > 0 && <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                          {doc.taggedRisks.length} risk
                          {doc.taggedRisks.length > 1 ? 's' : ''}
                        </span>}
                    </div>
                  </div>
                </div>)}
            </div> : <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <FileTextIcon size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No documents found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'All' ? 'Try adjusting your search or filters' : 'Upload your first document to get started'}
              </p>
              <button onClick={() => setActiveTab('upload')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center">
                <UploadIcon size={18} className="mr-2" />
                Upload Document
              </button>
            </div>}
        </div>}
      {activeTab === 'upload' && <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Upload New Document
            </h3>
            <p className="text-gray-600">
              Add supporting documentation to your Work Method Statement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Number
                </label>
                <div className="flex">
                  <input type="text" name="documentNo" value={newDocument.documentNo} onChange={handleInputChange} placeholder={generateDocumentNumber()} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" onClick={() => setNewDocument({
                ...newDocument,
                documentNo: generateDocumentNumber()
              })} className="ml-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200" title="Generate number">
                    <PlusIcon size={18} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank for auto-generated number
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input type="text" name="description" value={newDocument.description} onChange={handleInputChange} placeholder="e.g., Lift Plan - Module A" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Revision
                  </label>
                  <select name="revision" value={newDocument.revision} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="00">Rev 00</option>
                    <option value="01">Rev 01</option>
                    <option value="02">Rev 02</option>
                    <option value="03">Rev 03</option>
                    <option value="04">Rev 04</option>
                    <option value="05">Rev 05</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select name="category" value={newDocument.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="Permit">Permit</option>
                    <option value="Survey">Survey</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Transport Plan">Transport Plan</option>
                    <option value="Risk Matrix">Risk Matrix</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF Document
              </label>
              <div className={`border-2 border-dashed rounded-md p-6 text-center ${newDocument.file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`} onClick={() => fileInputRef.current?.click()}>
                {newDocument.file ? <div>
                    <div className="flex items-center justify-center mb-2">
                      <FileTextIcon size={36} className="text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {newDocument.file.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      {(newDocument.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button type="button" onClick={e => {
                e.stopPropagation();
                setNewDocument({
                  ...newDocument,
                  file: null,
                  previewUrl: undefined
                });
                if (fileInputRef.current) fileInputRef.current.value = '';
              }} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-200">
                      Change File
                    </button>
                    {newDocument.previewUrl && <button type="button" onClick={e => {
                e.stopPropagation();
                window.open(newDocument.previewUrl, '_blank');
              }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm ml-2 hover:bg-blue-700">
                        Preview
                      </button>}
                  </div> : <div>
                    <div className="flex items-center justify-center mb-2">
                      <UploadIcon size={36} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF files only (max 10MB)
                    </p>
                  </div>}
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button onClick={() => setActiveTab('list')} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleUploadDocument} disabled={!newDocument.description || !newDocument.file} className={`px-4 py-2 rounded-md flex items-center ${!newDocument.description || !newDocument.file ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              <UploadIcon size={18} className="mr-2" />
              Upload Document
            </button>
          </div>
        </div>}
      {/* Tag Modal */}
      {showTagModal && currentDocumentForTagging && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Tag Document to Steps & Risks
                </h3>
                <button onClick={() => setShowTagModal(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="mb-6">
                {steps.length > 0 && <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Tag to Steps
                    </h4>
                    <div className="space-y-2">
                      {steps.map(step => {
                  const doc = documents.find(d => d.id === currentDocumentForTagging);
                  const isTagged = doc?.taggedSteps.includes(step.id) || false;
                  return <div key={step.id} className="flex items-center">
                            <input type="checkbox" id={`step-${step.id}`} checked={isTagged} onChange={e => handleTagDocument(currentDocumentForTagging, step.id, e.target.checked)} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor={`step-${step.id}`} className="text-gray-800">
                              {step.id}. {step.title}
                            </label>
                          </div>;
                })}
                    </div>
                  </div>}
                {risks && risks.length > 0 && <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      Tag to Risks
                    </h4>
                    <div className="space-y-2">
                      {risks.map(risk => {
                  const doc = documents.find(d => d.id === currentDocumentForTagging);
                  const isTagged = doc?.taggedRisks.includes(risk.id) || false;
                  return <div key={risk.id} className="flex items-center">
                            <input type="checkbox" id={`risk-${risk.id}`} checked={isTagged} onChange={e => handleTagRisk(currentDocumentForTagging, risk.id, e.target.checked)} className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label htmlFor={`risk-${risk.id}`} className="text-gray-800">
                              {risk.description}
                            </label>
                          </div>;
                })}
                    </div>
                  </div>}
              </div>
              <div className="flex justify-end">
                <button onClick={() => setShowTagModal(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};