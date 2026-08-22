import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { leaveService } from '../../services/leaveService';
import type { LeaveType, LeaveQuota } from '../../types';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  onLeaveSubmitted: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  onLeaveSubmitted,
}) => {
  const [leaveType, setLeaveType] = useState<LeaveType>('PAID_LEAVE');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [quotas, setQuotas] = useState<LeaveQuota[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employeeId && isOpen) {
      leaveService.getLeaveQuotas(employeeId).then(setQuotas);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(new Date().toISOString().split('T')[0]);
      setReason('');
      setErrors({});
    }
  }, [employeeId, isOpen]);

  // Calculate requested duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = !isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start
    ? Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  const currentQuota = quotas.find(q => q.type === leaveType);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    if (new Date(endDate) < new Date(startDate)) {
      errs.endDate = 'End date must be on or after start date';
    }
    if (!reason.trim() || reason.trim().length < 5) {
      errs.reason = 'Please provide a reason with at least 5 characters';
    }
    if (currentQuota && currentQuota.remaining < diffDays && leaveType !== 'UNPAID_LEAVE') {
      errs.leaveType = `Insufficient balance! You only have ${currentQuota.remaining} days remaining for ${currentQuota.label}.`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await leaveService.submitLeaveRequest({
        employeeId,
        leaveType,
        startDate,
        endDate,
        reason,
      });
      onLeaveSubmitted();
      onClose();
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit leave request' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave of Absence"
      subtitle="Submit request for supervisor and HR review"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.form && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            {errors.form}
          </div>
        )}

        {/* Leave Type Selector */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Leave Category *</label>
          <select
            id="leave-type-select"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value as LeaveType)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="PAID_LEAVE">Paid Annual Leave (Vacation)</option>
            <option value="SICK_LEAVE">Sick Leave (Medical)</option>
            <option value="CASUAL_LEAVE">Casual / Personal Leave</option>
            <option value="UNPAID_LEAVE">Unpaid Leave</option>
          </select>

          {currentQuota && (
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
              <span>Quota Available:</span>
              <span className="font-semibold text-indigo-600">
                {currentQuota.remaining} days remaining of {currentQuota.total} total
              </span>
            </p>
          )}
          {errors.leaveType && <p className="text-rose-500 text-[11px] mt-0.5">{errors.leaveType}</p>}
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
            <input
              id="leave-start-date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.startDate && <p className="text-rose-500 text-[11px] mt-0.5">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
            <input
              id="leave-end-date"
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.endDate && <p className="text-rose-500 text-[11px] mt-0.5">{errors.endDate}</p>}
          </div>
        </div>

        {/* Duration Calculation Banner */}
        <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
          <span className="text-slate-600 font-medium">Calculated Duration:</span>
          <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            {diffDays} {diffDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>

        {/* Reason Textarea */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Reason for Leave *</label>
          <textarea
            id="leave-reason-textarea"
            rows={3}
            required
            placeholder="Please specify the purpose and any handover contact arrangements..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
          />
          {errors.reason && <p className="text-rose-500 text-[11px] mt-0.5">{errors.reason}</p>}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-leave-request-btn"
            type="submit"
            disabled={isSubmitting || diffDays <= 0}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
