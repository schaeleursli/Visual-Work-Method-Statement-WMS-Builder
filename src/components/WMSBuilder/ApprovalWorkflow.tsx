import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, UserIcon, FileTextIcon, MessageSquareIcon, UploadIcon, InfoIcon } from 'lucide-react';
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
interface ApprovalWorkflowProps {
  documentMeta: DocumentMeta;
  onUpdateMeta: (meta: Partial<DocumentMeta>) => void;
}
// Mock revision history
const revisionHistory = [{
  revision: '00',
  date: '2023-10-15',
  author: 'J. Müller',
  description: 'Initial document creation',
  status: 'approved'
}, {
  revision: '01',
  date: '2023-11-10',
  author: 'J. Müller',
  description: 'Updated transport route and added additional risk mitigation measures',
  status: 'in-review'
}];
export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  documentMeta,
  onUpdateMeta
}) => {
  const [comment, setComment] = useState('');
  const [clientSignature, setClientSignature] = useState<File | null>(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  // Mock approvers for dropdown
  const approvers = [{
    id: 1,
    name: 'A. Silva',
    role: 'Operations Manager'
  }, {
    id: 2,
    name: 'M. Zhang',
    role: 'Project Manager'
  }, {
    id: 3,
    name: 'E. Johnson',
    role: 'HSE Manager'
  }];
  const handleClientSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setClientSignature(e.target.files[0]);
    }
  };
  const handleApprove = () => {
    onUpdateMeta({
      status: 'approved',
      approvedBy: 'A. Silva'
    });
    setShowApproveConfirm(false);
  };
  const handleReject = () => {
    onUpdateMeta({
      status: 'rejected',
      approvedBy: ''
    });
    setShowRejectConfirm(false);
  };
  const canApprove = documentMeta.status === 'in-review';
  const isApproved = documentMeta.status === 'approved';
  const isRejected = documentMeta.status === 'rejected';
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Approval Workflow
        </h3>
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="col-span-2">
            <h4 className="font-medium text-gray-700 mb-3">Revision History</h4>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="flex bg-gray-50 border-b border-gray-200 px-4 py-2">
                <div className="w-1/6 font-medium text-gray-700 text-sm">
                  Rev
                </div>
                <div className="w-1/5 font-medium text-gray-700 text-sm">
                  Date
                </div>
                <div className="w-1/5 font-medium text-gray-700 text-sm">
                  Author
                </div>
                <div className="w-2/5 font-medium text-gray-700 text-sm">
                  Description
                </div>
              </div>
              {revisionHistory.map((rev, index) => <div key={index} className="flex items-center px-4 py-3 border-b border-gray-100">
                  <div className="w-1/6 font-medium text-gray-800">
                    {rev.revision}
                  </div>
                  <div className="w-1/5 text-gray-600 text-sm">{rev.date}</div>
                  <div className="w-1/5 text-gray-600 text-sm">
                    {rev.author}
                  </div>
                  <div className="w-2/5 text-gray-600 text-sm">
                    {rev.description}
                  </div>
                </div>)}
              <div className={`flex items-center px-4 py-3 ${documentMeta.revision === '01' ? 'bg-blue-50' : ''}`}>
                <div className="w-1/6 font-medium text-gray-800">
                  {documentMeta.revision}
                </div>
                <div className="w-1/5 text-gray-600 text-sm">
                  {new Date().toISOString().split('T')[0]}
                </div>
                <div className="w-1/5 text-gray-600 text-sm">
                  {documentMeta.createdBy}
                </div>
                <div className="w-2/5 text-gray-600 text-sm">
                  Current working revision
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Document Status</h4>
            <div className="border border-gray-200 rounded-md p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Current Status</div>
                <div className="flex items-center">
                  {documentMeta.status === 'approved' ? <CheckCircleIcon size={20} className="text-green-500 mr-2" /> : documentMeta.status === 'rejected' ? <XCircleIcon size={20} className="text-red-500 mr-2" /> : documentMeta.status === 'in-review' ? <FileTextIcon size={20} className="text-yellow-500 mr-2" /> : <FileTextIcon size={20} className="text-gray-400 mr-2" />}
                  <span className="font-medium">
                    {documentMeta.status === 'approved' ? 'Approved' : documentMeta.status === 'rejected' ? 'Rejected' : documentMeta.status === 'in-review' ? 'In Review' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Created By</div>
                <div className="flex items-center">
                  <UserIcon size={20} className="text-gray-400 mr-2" />
                  <span>{documentMeta.createdBy}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Approved By</div>
                <div className="flex items-center">
                  <UserIcon size={20} className="text-gray-400 mr-2" />
                  <span>{documentMeta.approvedBy || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Approval Actions</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            {isApproved ? <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon size={24} className="mr-2" />
                  <div>
                    <p className="font-medium">
                      This document has been approved
                    </p>
                    <p className="text-sm text-gray-600">
                      Approved by {documentMeta.approvedBy} on{' '}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => onUpdateMeta({
              status: 'in-review'
            })} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Create New Revision
                </button>
              </div> : isRejected ? <div className="flex items-center justify-between">
                <div className="flex items-center text-red-600">
                  <XCircleIcon size={24} className="mr-2" />
                  <div>
                    <p className="font-medium">
                      This document has been rejected
                    </p>
                    <p className="text-sm text-gray-600">
                      Please address the comments and resubmit for approval
                    </p>
                  </div>
                </div>
                <button onClick={() => onUpdateMeta({
              status: 'in-review'
            })} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Resubmit for Approval
                </button>
              </div> : <div>
                {documentMeta.status === 'draft' ? <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <InfoIcon size={24} className="mr-2" />
                      <div>
                        <p className="font-medium">
                          This document is still in draft
                        </p>
                        <p className="text-sm text-gray-600">
                          Complete all sections before submitting for approval
                        </p>
                      </div>
                    </div>
                    <button onClick={() => onUpdateMeta({
                status: 'in-review'
              })} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Submit for Approval
                    </button>
                  </div> : <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-yellow-600">
                        <FileTextIcon size={24} className="mr-2" />
                        <div>
                          <p className="font-medium">
                            This document is waiting for approval
                          </p>
                          <p className="text-sm text-gray-600">
                            Submitted by {documentMeta.createdBy} on{' '}
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button onClick={() => setShowRejectConfirm(true)} className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50" disabled={!canApprove}>
                          Reject
                        </button>
                        <button onClick={() => setShowApproveConfirm(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={!canApprove}>
                          Approve
                        </button>
                      </div>
                    </div>
                    {showApproveConfirm && <div className="mt-4 border border-green-200 rounded-md p-4 bg-green-50">
                        <h5 className="font-medium text-gray-800 mb-3">
                          Confirm Approval
                        </h5>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Approval Comment (Optional)
                          </label>
                          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Add any comments about this approval..." />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => setShowApproveConfirm(false)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm">
                            Cancel
                          </button>
                          <button onClick={handleApprove} className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                            Confirm Approval
                          </button>
                        </div>
                      </div>}
                    {showRejectConfirm && <div className="mt-4 border border-red-200 rounded-md p-4 bg-red-50">
                        <h5 className="font-medium text-gray-800 mb-3">
                          Confirm Rejection
                        </h5>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason (Required)
                          </label>
                          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="Explain why this document is being rejected..." required />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button onClick={() => setShowRejectConfirm(false)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm">
                            Cancel
                          </button>
                          <button onClick={handleReject} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm" disabled={!comment.trim()}>
                            Confirm Rejection
                          </button>
                        </div>
                      </div>}
                  </div>}
              </div>}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Client Approval</h4>
          <div className="border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {documentMeta.clientApproval ? <CheckCircleIcon size={20} className="text-green-500 mr-2" /> : <XCircleIcon size={20} className="text-gray-300 mr-2" />}
                <span className="font-medium">
                  {documentMeta.clientApproval ? 'Client has approved this document' : 'Awaiting client approval'}
                </span>
              </div>
              <div>
                <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer inline-flex items-center">
                  <UploadIcon size={16} className="mr-1" />
                  Upload Client Approval
                  <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleClientSignatureUpload} />
                </label>
              </div>
            </div>
            {clientSignature && <div className="flex items-center text-sm text-green-600">
                <CheckCircleIcon size={16} className="mr-1" />
                <span>
                  Client approval document uploaded: {clientSignature.name}
                </span>
              </div>}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <InfoIcon size={16} className="mr-1 text-blue-500" />
                <span>
                  Client approval can be uploaded once the document has been
                  internally approved.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};