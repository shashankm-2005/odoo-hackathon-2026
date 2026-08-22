import React, { useState, useEffect } from 'react';
import { 
  CalendarOff, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  X, 
  Eye,
  Calendar
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { LeaveApprovalModal } from '../../components/leave/LeaveApprovalModal';
import { leaveService } from '../../services/leaveService';
import { useToast } from '../../context/ToastContext';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../types';

export const LeaveManagementPage: React.FC = () => {
  const { success, error } = useToast();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  // Modal
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const data = await leaveService.getLeaveRequests({
        status: statusFilter,
        leaveType: typeFilter,
        search,
      });
      setLeaveRequests(data);
    } catch (err) {
      console.error('Failed to load leave requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter, typeFilter, search]);

  const handleApprove = async (id: string, comment?: string) => {
    try {
      await leaveService.approveLeave(id, comment);
      success('Leave Application Approved', 'Employee has been notified');
      await loadRequests();
    } catch (err: any) {
      error('Failed to approve leave', err.message);
    }
  };

  const handleReject = async (id: string, comment?: string) => {
    try {
      await leaveService.rejectLeave(id, comment);
      success('Leave Application Rejected', 'Employee has been notified');
      await loadRequests();
    } catch (err: any) {
      error('Failed to reject leave', err.message);
    }
  };

  // Status metrics
  const pendingCount = leaveRequests.filter(r => r.status === 'PENDING').length;
  const approvedCount = leaveRequests.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Leave Management Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review time-off submissions, balance validations, supervisor notes, and approval workflows.
          </p>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'ALL' ? 'border-slate-900 ring-1 ring-slate-900/10' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Requests</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{leaveRequests.length}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">All Time Submissions</span>
        </div>

        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'PENDING' ? 'border-amber-500 ring-1 ring-amber-500/20 bg-amber-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Pending Review</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{pendingCount}</span>
          <span className="text-[10px] text-amber-600/70 mt-0.5 block">Action Required</span>
        </div>

        <div 
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'APPROVED' ? 'border-emerald-500 ring-1 ring-emerald-500/20 bg-emerald-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Approved Leaves</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{approvedCount}</span>
          <span className="text-[10px] text-emerald-600/70 mt-0.5 block">Recorded to Calendar</span>
        </div>

        <div 
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 bg-white rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'REJECTED' ? 'border-rose-500 ring-1 ring-rose-500/20 bg-rose-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Declined Requests</span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{rejectedCount}</span>
          <span className="text-[10px] text-rose-600/70 mt-0.5 block">Feedback Provided</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="leave-search-input"
              type="text"
              placeholder="Search by employee or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Leave Categories</option>
            <option value="PAID_LEAVE">Paid Annual Leave</option>
            <option value="SICK_LEAVE">Sick Leave</option>
            <option value="CASUAL_LEAVE">Casual / Personal</option>
            <option value="UNPAID_LEAVE">Unpaid Leave</option>
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-end md:self-auto text-xs">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      {isLoading ? (
        <LoadingSpinner label="Loading employee leave requests..." />
      ) : leaveRequests.length === 0 ? (
        <EmptyState
          title="No Leave Records Matching Filter"
          description="No leave applications match your search or category filters."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Applicant</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Dates / Schedule</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Reason</th>
                  <th className="px-5 py-3.5 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={req.employee?.full_name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{req.employee?.full_name}</p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{req.employee?.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-800">{req.leave_type.replace('_', ' ')}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 font-mono text-[11px]">
                        {req.start_date} <span className="text-slate-400">→</span> {req.end_date}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {req.number_of_days} {req.number_of_days === 1 ? 'Day' : 'Days'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="text-slate-600 truncate text-[11px]" title={req.reason}>
                        "{req.reason}"
                      </p>
                      {req.admin_comment && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          Admin: {req.admin_comment}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-[11px]"
                        >
                          Details
                        </button>

                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="flex items-center gap-1 px-2.5 py-1 text-white bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg shadow-2xs transition-colors text-[11px]"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <LeaveApprovalModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
