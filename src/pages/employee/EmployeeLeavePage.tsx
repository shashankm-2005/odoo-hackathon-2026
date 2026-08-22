import React, { useState, useEffect } from 'react';
import { 
  CalendarOff, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle 
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { LeaveRequestModal } from '../../components/leave/LeaveRequestModal';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services/leaveService';
import type { LeaveQuota, LeaveRequest } from '../../types';

export const EmployeeLeavePage: React.FC = () => {
  const { employee } = useAuth();
  const [quotas, setQuotas] = useState<LeaveQuota[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const empId = employee?.id || '';

  const loadData = async () => {
    if (!empId) return;
    setIsLoading(true);
    try {
      const q = await leaveService.getLeaveQuotas(empId);
      const r = await leaveService.getLeaveRequests({ employeeId: empId });
      setQuotas(q);
      setRequests(r);
    } catch (err) {
      console.error('Failed to load employee leave records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [empId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Time-off & Leave Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Check annual leave entitlements, apply for absences, and track supervisor reviews.
          </p>
        </div>

        <button
          id="employee-apply-leave-main-btn"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Balances Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quotas.map((q) => (
          <div key={q.type} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">{q.label}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{q.used} days used of {q.total}</span>
              <div className="my-3">
                <span className="text-3xl font-black text-slate-900 block font-mono">{q.remaining}</span>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-0.5">Days Available</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${Math.round(((q.total - q.remaining) / q.total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Requests History */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Leave Application History</h3>

        {isLoading ? (
          <LoadingSpinner label="Fetching your leave requests..." />
        ) : requests.length === 0 ? (
          <EmptyState
            title="No Leave Applications on File"
            description="You haven't requested any time-off yet this year. Click 'Apply for Leave' above to submit your first application."
            action={{
              label: 'Apply for Leave Now',
              onClick: () => setIsModalOpen(true),
            }}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Leave Category</th>
                    <th className="px-4 py-3.5">Schedule Window</th>
                    <th className="px-4 py-3.5">Duration</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">My Justification</th>
                    <th className="px-5 py-3.5">HR / Reviewer Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {req.leave_type.replace('_', ' ')}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-800 text-[11px]">
                        {req.start_date} <span className="text-slate-400">to</span> {req.end_date}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {req.number_of_days} {req.number_of_days === 1 ? 'Day' : 'Days'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={req.status} />
                      </td>

                      <td className="px-4 py-3.5 text-slate-700 max-w-xs truncate" title={req.reason}>
                        "{req.reason}"
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 max-w-xs">
                        {req.admin_comment ? (
                          <span className="text-slate-800 font-medium italic">"{req.admin_comment}"</span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employeeId={empId}
        onLeaveSubmitted={loadData}
      />
    </div>
  );
};
