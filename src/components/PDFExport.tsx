import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, PrinterIcon, SettingsIcon, EyeIcon, CheckCircleIcon, ListIcon, PackageIcon, TruckIcon, AlertTriangleIcon, ClipboardIcon, FileIcon, ChevronRightIcon } from 'lucide-react';
import { Document as DocumentType } from './DocumentManager/DocumentManager';
import { UserMetadata, CompanyMetadata } from './UserProfile/UserProfile';
interface PDFExportProps {
  documentMeta: {
    docNo: string;
    revision: string;
    title: string;
    createdBy: string;
    approvedBy: string;
    projectName: string;
    status: string;
    clientApproval?: boolean;
  };
  steps: any[];
  risks: any[];
  documents: DocumentType[];
  cargoItems?: any[];
  equipment?: any[];
  userMetadata?: UserMetadata;
  companyMetadata?: CompanyMetadata;
  onClose: () => void;
}
export const PDFExport: React.FC<PDFExportProps> = ({
  documentMeta,
  steps,
  risks,
  documents,
  cargoItems = [],
  equipment = [],
  userMetadata,
  companyMetadata,
  onClose
}) => {
  const [showWatermark, setShowWatermark] = useState(true);
  const [includeCoverPage, setIncludeCoverPage] = useState(true);
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true);
  const [includeDocumentRegister, setIncludeDocumentRegister] = useState(true);
  const [includeCargoList, setIncludeCargoList] = useState(true);
  const [includeEquipmentList, setIncludeEquipmentList] = useState(true);
  const [includeRiskAssessment, setIncludeRiskAssessment] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [includeHeaderFooter, setIncludeHeaderFooter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [previewSection, setPreviewSection] = useState<string>('cover');
  const handleGeneratePDF = () => {
    setLoading(true);
    // Simulate PDF generation
    setTimeout(() => {
      setLoading(false);
      setPdfGenerated(true);
    }, 2000);
  };
  const getWatermarkText = () => {
    if (documentMeta.status === 'approved') return 'APPROVED';
    if (documentMeta.status === 'in-review') return 'FOR APPROVAL';
    return `REV ${documentMeta.revision}`;
  };
  const getTotalPages = () => {
    let pages = 0;
    if (includeCoverPage) pages += 1;
    if (includeTableOfContents) pages += 1;
    if (includeDocumentRegister) pages += 1;
    if (includeCargoList && cargoItems.length > 0) pages += 1;
    if (includeEquipmentList && equipment.length > 0) pages += 1;
    pages += Math.ceil(steps.length / 2); // Estimate steps pages
    if (includeRiskAssessment) pages += 1;
    if (includeAttachments) pages += documents.length;
    return pages;
  };
  // Group documents by category
  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentType[]>);
  // Group equipment by type
  const equipmentByType = equipment.reduce((acc, eq) => {
    if (!acc[eq.type]) {
      acc[eq.type] = [];
    }
    acc[eq.type].push(eq);
    return acc;
  }, {} as Record<string, any[]>);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Export Complete WMS Dossier
        </h3>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2 border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Preview</h4>
              {pdfGenerated && <div className="flex space-x-2">
                  <button onClick={() => setPreviewSection('cover')} className={`px-2 py-1 text-xs rounded ${previewSection === 'cover' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Cover
                  </button>
                  <button onClick={() => setPreviewSection('toc')} className={`px-2 py-1 text-xs rounded ${previewSection === 'toc' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Contents
                  </button>
                  <button onClick={() => setPreviewSection('docs')} className={`px-2 py-1 text-xs rounded ${previewSection === 'docs' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Documents
                  </button>
                  <button onClick={() => setPreviewSection('steps')} className={`px-2 py-1 text-xs rounded ${previewSection === 'steps' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Steps
                  </button>
                  <button onClick={() => setPreviewSection('risks')} className={`px-2 py-1 text-xs rounded ${previewSection === 'risks' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Risks
                  </button>
                  <button onClick={() => setPreviewSection('equipment')} className={`px-2 py-1 text-xs rounded ${previewSection === 'equipment' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    Equipment
                  </button>
                </div>}
            </div>
            <div className="p-6 flex flex-col items-center justify-center min-h-[500px]">
              {pdfGenerated ? <div className="relative w-full max-w-md border border-gray-300 rounded-md overflow-hidden shadow-md">
                  {/* Header */}
                  {includeHeaderFooter && <div className="bg-gray-50 border-b border-gray-200 p-2 flex justify-between items-center text-xs text-gray-600">
                      <div className="flex items-center">
                        {companyMetadata?.logo ? <img src={companyMetadata.logo} alt="Company Logo" className="h-4 mr-2" /> : <div className="w-8 h-4 bg-blue-600 mr-2"></div>}
                        <span>
                          {companyMetadata?.name || documentMeta.projectName}
                        </span>
                      </div>
                      <span>Work Method Statement</span>
                    </div>}
                  {/* Cover Page */}
                  {previewSection === 'cover' && <div className="bg-white p-8 text-center relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <div className="mb-8 border-b pb-4">
                        {companyMetadata?.logo ? <img src={companyMetadata.logo} alt="Company Logo" className="max-h-12 mx-auto mb-2" /> : <div className="w-24 h-12 bg-blue-600 mx-auto mb-2"></div>}
                        <p className="text-xs text-gray-500">
                          {companyMetadata?.name || 'Company Logo'}
                        </p>
                      </div>
                      <h1 className="text-xl font-bold mb-2">
                        WORK METHOD STATEMENT
                      </h1>
                      <h2 className="text-lg font-semibold mb-4">
                        {documentMeta.title}
                      </h2>
                      <div className="border border-gray-300 rounded-md p-3 mb-6">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-left">
                            <p className="text-gray-600">Document Number:</p>
                            <p className="font-medium">{documentMeta.docNo}</p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Revision:</p>
                            <p className="font-medium">
                              {documentMeta.revision}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Project:</p>
                            <p className="font-medium">
                              {documentMeta.projectName}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="text-gray-600">Date:</p>
                            <p className="font-medium">
                              {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <p className="text-gray-600 mb-1">Created By:</p>
                          <p className="font-medium">
                            {userMetadata?.name || documentMeta.createdBy}
                          </p>
                          {userMetadata?.email && <p className="text-xs text-gray-500">
                              {userMetadata.email}
                            </p>}
                          {userMetadata?.phone && <p className="text-xs text-gray-500">
                              {userMetadata.phone}
                            </p>}
                          <div className="mt-2 border-t border-gray-300 pt-1">
                            <p className="text-xs text-gray-500">Signature</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-600 mb-1">Approved By:</p>
                          <p className="font-medium">
                            {documentMeta.approvedBy || '—'}
                          </p>
                          <div className="mt-2 border-t border-gray-300 pt-1">
                            <p className="text-xs text-gray-500">Signature</p>
                          </div>
                        </div>
                      </div>
                      {documentMeta.clientApproval && <div className="mt-6 border-t border-gray-300 pt-4">
                          <div className="text-left">
                            <p className="text-gray-600 mb-1">
                              Client Approval:
                            </p>
                            <p className="font-medium">Approved</p>
                            <div className="mt-2 border-t border-gray-300 pt-1">
                              <p className="text-xs text-gray-500">
                                Client Signature
                              </p>
                            </div>
                          </div>
                        </div>}
                      {companyMetadata && <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
                          <p>{companyMetadata.name}</p>
                          {companyMetadata.address && <p>{companyMetadata.address}</p>}
                          {companyMetadata.website && <p>{companyMetadata.website}</p>}
                        </div>}
                    </div>}
                  {/* Table of Contents */}
                  {previewSection === 'toc' && <div className="bg-white p-8 relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <h2 className="text-xl font-bold mb-6 text-center">
                        TABLE OF CONTENTS
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                          <span className="font-medium">1. Introduction</span>
                          <span className="text-gray-600">Page 3</span>
                        </div>
                        {includeDocumentRegister && <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-medium">
                              2. Document Register
                            </span>
                            <span className="text-gray-600">Page 4</span>
                          </div>}
                        {includeCargoList && cargoItems.length > 0 && <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-medium">3. Cargo List</span>
                            <span className="text-gray-600">
                              Page {includeDocumentRegister ? 5 : 4}
                            </span>
                          </div>}
                        {includeEquipmentList && equipment.length > 0 && <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-medium">
                              4. Equipment List
                            </span>
                            <span className="text-gray-600">
                              Page{' '}
                              {includeDocumentRegister && includeCargoList ? 6 : includeDocumentRegister || includeCargoList ? 5 : 4}
                            </span>
                          </div>}
                        <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                          <span className="font-medium">
                            5. Operation Steps
                          </span>
                          <span className="text-gray-600">
                            Page{' '}
                            {includeDocumentRegister && includeCargoList && includeEquipmentList ? 7 : includeDocumentRegister && includeCargoList || includeDocumentRegister && includeEquipmentList || includeCargoList && includeEquipmentList ? 6 : includeDocumentRegister || includeCargoList || includeEquipmentList ? 5 : 4}
                          </span>
                        </div>
                        {includeRiskAssessment && <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-medium">
                              6. Risk Assessment
                            </span>
                            <span className="text-gray-600">
                              Page{' '}
                              {includeDocumentRegister && includeCargoList && includeEquipmentList ? 9 : includeDocumentRegister && includeCargoList || includeDocumentRegister && includeEquipmentList || includeCargoList && includeEquipmentList ? 8 : includeDocumentRegister || includeCargoList || includeEquipmentList ? 7 : 6}
                            </span>
                          </div>}
                        {includeAttachments && documents.length > 0 && <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-medium">7. Attachments</span>
                            <span className="text-gray-600">
                              Page{' '}
                              {includeDocumentRegister && includeCargoList && includeEquipmentList && includeRiskAssessment ? 10 : includeDocumentRegister && includeCargoList && includeEquipmentList || includeDocumentRegister && includeCargoList && includeRiskAssessment || includeDocumentRegister && includeEquipmentList && includeRiskAssessment || includeCargoList && includeEquipmentList && includeRiskAssessment ? 9 : includeDocumentRegister && includeCargoList || includeDocumentRegister && includeEquipmentList || includeDocumentRegister && includeRiskAssessment || includeCargoList && includeEquipmentList || includeCargoList && includeRiskAssessment || includeEquipmentList && includeRiskAssessment ? 8 : includeDocumentRegister || includeCargoList || includeEquipmentList || includeRiskAssessment ? 7 : 6}
                            </span>
                          </div>}
                      </div>
                    </div>}
                  {/* Document Register */}
                  {previewSection === 'docs' && <div className="bg-white p-6 relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <h2 className="text-lg font-bold mb-4">
                        DOCUMENT REGISTER
                      </h2>
                      <table className="min-w-full border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                              No.
                            </th>
                            <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                              Title
                            </th>
                            <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                              Rev
                            </th>
                            <th className="py-2 px-3 border-b border-gray-300 text-left">
                              Category
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {documents.slice(0, 5).map((doc, index) => <tr key={doc.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="py-2 px-3 border-b border-r border-gray-300">
                                {doc.documentNo}
                              </td>
                              <td className="py-2 px-3 border-b border-r border-gray-300">
                                {doc.description}
                              </td>
                              <td className="py-2 px-3 border-b border-r border-gray-300">
                                {doc.revision}
                              </td>
                              <td className="py-2 px-3 border-b border-gray-300">
                                {doc.category}
                              </td>
                            </tr>)}
                          {documents.length > 5 && <tr>
                              <td colSpan={4} className="py-2 px-3 border-b border-gray-300 text-center text-gray-500">
                                + {documents.length - 5} more documents
                              </td>
                            </tr>}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-2">
                        All documents are available in full in the Attachments
                        section.
                      </p>
                    </div>}
                  {/* Equipment List */}
                  {previewSection === 'equipment' && <div className="bg-white p-6 relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <h2 className="text-lg font-bold mb-4">EQUIPMENT LIST</h2>
                      <div className="space-y-4">
                        {/* Vessels */}
                        {equipment.filter(e => e.type === 'Vessel' || e.type === 'Flat-top' || e.category === 'vessel').length > 0 && <div>
                            <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">
                              Vessels
                            </h3>
                            <table className="min-w-full border border-gray-300 text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Name
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Type
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Capacity
                                  </th>
                                  <th className="py-2 px-3 border-b border-gray-300 text-left">
                                    Dimensions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipment.filter(e => e.type === 'Vessel' || e.type === 'Flat-top' || e.category === 'vessel').slice(0, 3).map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.name}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.type}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.capacity || 'N/A'}
                                      </td>
                                      <td className="py-2 px-3 border-b border-gray-300">
                                        {item.dimensions || 'N/A'}
                                      </td>
                                    </tr>)}
                              </tbody>
                            </table>
                          </div>}
                        {/* Cranes */}
                        {equipment.filter(e => e.type === 'Crane' || e.category === 'crane').length > 0 && <div>
                            <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">
                              Cranes
                            </h3>
                            <table className="min-w-full border border-gray-300 text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Name
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Type
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Capacity
                                  </th>
                                  <th className="py-2 px-3 border-b border-gray-300 text-left">
                                    Reach
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipment.filter(e => e.type === 'Crane' || e.category === 'crane').slice(0, 3).map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.name}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.type}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.capacity || 'N/A'}
                                      </td>
                                      <td className="py-2 px-3 border-b border-gray-300">
                                        {item.dimensions || 'N/A'}
                                      </td>
                                    </tr>)}
                              </tbody>
                            </table>
                          </div>}
                        {/* Rigging */}
                        {equipment.filter(e => e.type === 'Sling' || e.category === 'rigging').length > 0 && <div>
                            <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">
                              Rigging Equipment
                            </h3>
                            <table className="min-w-full border border-gray-300 text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Name
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Type
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    WLL
                                  </th>
                                  <th className="py-2 px-3 border-b border-gray-300 text-left">
                                    Dimensions
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipment.filter(e => e.type === 'Sling' || e.category === 'rigging').slice(0, 3).map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.name}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.type}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.capacity || 'N/A'}
                                      </td>
                                      <td className="py-2 px-3 border-b border-gray-300">
                                        {item.dimensions || 'N/A'}
                                      </td>
                                    </tr>)}
                              </tbody>
                            </table>
                          </div>}
                        {/* Transport */}
                        {equipment.filter(e => e.type === 'Transport' || e.category === 'trailer').length > 0 && <div>
                            <h3 className="text-md font-semibold mb-2 border-b border-gray-200 pb-1">
                              Transport Equipment
                            </h3>
                            <table className="min-w-full border border-gray-300 text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Name
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Type
                                  </th>
                                  <th className="py-2 px-3 border-b border-r border-gray-300 text-left">
                                    Capacity
                                  </th>
                                  <th className="py-2 px-3 border-b border-gray-300 text-left">
                                    Specifications
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {equipment.filter(e => e.type === 'Transport' || e.category === 'trailer').slice(0, 3).map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.name}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.type}
                                      </td>
                                      <td className="py-2 px-3 border-b border-r border-gray-300">
                                        {item.capacity || 'N/A'}
                                      </td>
                                      <td className="py-2 px-3 border-b border-gray-300">
                                        {item.dimensions || 'N/A'}
                                      </td>
                                    </tr>)}
                              </tbody>
                            </table>
                          </div>}
                        <p className="text-xs text-gray-500 mt-2">
                          All equipment meets applicable safety standards and
                          has current certification.
                        </p>
                      </div>
                    </div>}
                  {/* Steps */}
                  {previewSection === 'steps' && <div className="bg-white p-6 relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <h2 className="text-lg font-bold mb-4">
                        OPERATION STEPS
                      </h2>
                      <div className="space-y-4">
                        {steps.slice(0, 2).map((step, index) => <div key={step.id} className="border border-gray-300 rounded-md overflow-hidden">
                            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex items-center">
                              <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mr-2">
                                {index + 1}
                              </div>
                              <h3 className="font-medium">{step.title}</h3>
                            </div>
                            <div className="p-3 text-sm">
                              <div className="mb-2">
                                <span className="font-medium text-gray-700">
                                  Equipment:{' '}
                                </span>
                                {step.equipment}
                              </div>
                              {step.additionalEquipment && step.additionalEquipment.length > 0 && <div className="mb-2">
                                    <span className="font-medium text-gray-700">
                                      Additional Equipment:
                                    </span>
                                    <ul className="mt-1 pl-4">
                                      {step.additionalEquipment.slice(0, 2).map((item: string, i: number) => <li key={i} className="flex items-start text-xs">
                                            <ChevronRightIcon size={12} className="mr-1 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                          </li>)}
                                      {step.additionalEquipment.length > 2 && <li className="text-xs text-gray-500 pl-4">
                                          +{' '}
                                          {step.additionalEquipment.length - 2}{' '}
                                          more items
                                        </li>}
                                    </ul>
                                  </div>}
                              {/* Related documents */}
                              {documents.filter(doc => doc.taggedSteps.includes(step.id)).length > 0 && <div className="mt-2 pt-2 border-t border-gray-100">
                                  <span className="font-medium text-gray-700 text-xs">
                                    Related Documents:
                                  </span>
                                  <ul className="mt-1 pl-4">
                                    {documents.filter(doc => doc.taggedSteps.includes(step.id)).slice(0, 2).map(doc => <li key={doc.id} className="flex items-start text-xs">
                                          <FileIcon size={10} className="mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                                          <span>
                                            {doc.description} (Rev{' '}
                                            {doc.revision})
                                          </span>
                                        </li>)}
                                  </ul>
                                </div>}
                            </div>
                          </div>)}
                        {steps.length > 2 && <div className="text-center text-gray-500 text-sm py-2">
                            + {steps.length - 2} more steps in sequence
                          </div>}
                      </div>
                    </div>}
                  {/* Risk Assessment */}
                  {previewSection === 'risks' && <div className="bg-white p-6 relative">
                      {showWatermark && <div className="absolute inset-0 flex items-center justify-center opacity-10 rotate-[-30deg]">
                          <span className="text-red-600 text-6xl font-bold border-4 border-red-600 p-2">
                            {getWatermarkText()}
                          </span>
                        </div>}
                      <h2 className="text-lg font-bold mb-4">
                        RISK ASSESSMENT
                      </h2>
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">
                          Risk Matrix
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">
                              Initial Risk
                            </h4>
                            <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md"></div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">
                              Residual Risk
                            </h4>
                            <div className="w-full h-24 bg-gray-100 border border-gray-300 rounded-md"></div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">
                          Risk Register
                        </h3>
                        <table className="min-w-full border border-gray-300 text-xs">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="py-1 px-2 border-b border-r border-gray-300 text-left">
                                Risk
                              </th>
                              <th className="py-1 px-2 border-b border-r border-gray-300 text-left">
                                Initial
                              </th>
                              <th className="py-1 px-2 border-b border-r border-gray-300 text-left">
                                Mitigation
                              </th>
                              <th className="py-1 px-2 border-b border-gray-300 text-left">
                                Residual
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {risks.slice(0, 3).map((risk, index) => <tr key={risk.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-1 px-2 border-b border-r border-gray-300">
                                  {risk.description}
                                </td>
                                <td className="py-1 px-2 border-b border-r border-gray-300">
                                  <span className={`px-1 rounded-full text-xs ${risk.score > 12 ? 'bg-red-100 text-red-800' : risk.score > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {risk.score}
                                  </span>
                                </td>
                                <td className="py-1 px-2 border-b border-r border-gray-300">
                                  {risk.mitigation}
                                </td>
                                <td className="py-1 px-2 border-b border-gray-300">
                                  <span className={`px-1 rounded-full text-xs ${risk.residualScore > 12 ? 'bg-red-100 text-red-800' : risk.residualScore > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {risk.residualScore}
                                  </span>
                                </td>
                              </tr>)}
                            {risks.length > 3 && <tr>
                                <td colSpan={4} className="py-1 px-2 border-b border-gray-300 text-center text-gray-500">
                                  + {risks.length - 3} more risks
                                </td>
                              </tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>}
                  {/* Footer */}
                  {includeHeaderFooter && <div className="bg-gray-50 border-t border-gray-200 p-2 flex justify-between items-center text-xs text-gray-600">
                      <span>{new Date().toLocaleDateString()}</span>
                      <div className="flex items-center">
                        <span>
                          {documentMeta.docNo} - Rev {documentMeta.revision}
                        </span>
                        <span className="mx-2">|</span>
                        <span>Page 1 of {getTotalPages()}</span>
                      </div>
                    </div>}
                </div> : loading ? <div className="text-center">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating PDF...</p>
                </div> : <div className="text-center">
                  <FileTextIcon size={64} className="text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-700 mb-2">
                    PDF Preview
                  </h4>
                  <p className="text-gray-500 text-sm mb-4">
                    Configure your export options and click "Generate PDF" to
                    see a preview
                  </p>
                  <button onClick={handleGeneratePDF} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                    Generate PDF
                  </button>
                </div>}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Export Options</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Document Structure
                </h5>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeCoverPage} onChange={() => setIncludeCoverPage(!includeCoverPage)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Cover Page
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeTableOfContents} onChange={() => setIncludeTableOfContents(!includeTableOfContents)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Table of Contents
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeDocumentRegister} onChange={() => setIncludeDocumentRegister(!includeDocumentRegister)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Document Register
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeCargoList} onChange={() => setIncludeCargoList(!includeCargoList)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Cargo List
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeEquipmentList} onChange={() => setIncludeEquipmentList(!includeEquipmentList)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Equipment List
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeRiskAssessment} onChange={() => setIncludeRiskAssessment(!includeRiskAssessment)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Risk Assessment
                  </span>
                </label>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeAttachments} onChange={() => setIncludeAttachments(!includeAttachments)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Attachments
                  </span>
                </label>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Formatting
                </h5>
                <label className="flex items-center mb-2">
                  <input type="checkbox" checked={includeHeaderFooter} onChange={() => setIncludeHeaderFooter(!includeHeaderFooter)} className="mr-2" />
                  <span className="text-sm text-gray-700">
                    Include Header & Footer
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" checked={showWatermark} onChange={() => setShowWatermark(!showWatermark)} className="mr-2" />
                  <span className="text-sm text-gray-700">Show Watermark</span>
                </label>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-medium text-sm text-gray-700 mb-2">
                  Document Summary
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Document No:</span>
                    <span className="font-medium">{documentMeta.docNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revision:</span>
                    <span className="font-medium">{documentMeta.revision}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Steps:</span>
                    <span className="font-medium">{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risks:</span>
                    <span className="font-medium">{risks.length || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Documents:</span>
                    <span className="font-medium">
                      {documents.length || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pages:</span>
                    <span className="font-medium">{getTotalPages()}</span>
                  </div>
                </div>
              </div>
            </div>
            {pdfGenerated && <div className="mt-4 space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center">
                  <DownloadIcon size={18} className="mr-2" />
                  Download PDF
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-50">
                  <PrinterIcon size={18} className="mr-2" />
                  Print
                </button>
                <button className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-50">
                  <EyeIcon size={18} className="mr-2" />
                  Full Screen Preview
                </button>
              </div>}
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Close
          </button>
          {pdfGenerated && <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <CheckCircleIcon size={18} className="mr-2" />
              Finalize & Save
            </button>}
        </div>
      </div>
    </div>;
};