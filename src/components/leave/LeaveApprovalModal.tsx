import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Check, X, Calendar, User, FileText } from 'lucide-react';
import type { LeaveRequest } from '../../types';

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
  onApprove: (requestId: string, comment?: string) => Promise<void>;
  onReject: (requestId: string, comment?: string) => Promise<void>;
}

export const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [adminComment, setAdminComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(request.id, adminComment || undefined);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await onReject(request.id, adminComment || undefined);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Leave Application"
      subtitle={`Application submitted on ${new Date(request.created_at).toLocaleDateString()}`}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Applicant info card */}
        <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={request.employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={request.employee?.full_name}
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
          />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{request.employee?.full_name}</h4>
            <p className="text-slate-500">{request.employee?.designation} • {request.employee?.department}</p>
            <p className="text-slate-400 text-[11px]">ID: {request.employee?.employee_id}</p>
          </div>
        </div>

        {/* Leave details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Leave Type</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{request.leave_type.replace('_', ' ')}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Duration</span>
            <span className="font-semibold text-indigo-600 mt-0.5 block">{request.number_of_days} Day(s)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
            <span className="text-slate-400 block text-[11px]">Schedule Window</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {request.start_date} <span className="text-slate-400 font-normal">to</span> {request.end_date}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[11px] font-medium mb-1">Employee Reason</span>
          <p className="text-slate-700 leading-relaxed italic">"{request.reason}"</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-500 font-medium">Current Status:</span>
          <StatusBadge status={request.status} />
        </div>

        {/* Admin Feedback Comment */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Admin Response Note / Justification</label>
          <textarea
            id="admin-leave-comment"
            rows={2}
            placeholder="Add optional notes for the employee or backup delegation instructions..."
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none text-xs"
          />
        </div>

        {/* Decision Actions */}
        {request.status === 'PENDING' && (
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <button
              id="admin-reject-leave-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleReject}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Reject Request</span>
            </button>

            <button
              id="admin-approve-leave-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleApprove}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Approve Leave</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
