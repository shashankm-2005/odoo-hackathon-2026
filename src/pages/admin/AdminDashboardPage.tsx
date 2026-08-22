import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  CalendarOff, 
  Receipt, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Sparkles,
  Building,
  Check,
  X
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmployeeFormModal } from '../../components/employees/EmployeeFormModal';
import { LeaveApprovalModal } from '../../components/leave/LeaveApprovalModal';
import { localDb } from '../../lib/supabase';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { employeeService } from '../../services/employeeService';
import { payrollService } from '../../services/payrollService';
import { useToast } from '../../context/ToastContext';
import type { LeaveRequest, Employee } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceMetrics, setAttendanceMetrics] = useState<any>(null);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<any>(null);

  // Modals
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedLeaveForReview, setSelectedLeaveForReview] = useState<LeaveRequest | null>(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const allEmps = await employeeService.getEmployees();
      const metrics = await attendanceService.getAttendanceMetrics();
      const leaves = await leaveService.getLeaveRequests({ status: 'PENDING' });
      const pay = await payrollService.getPayrollSummary('August', 2026);

      setEmployees(allEmps);
      setAttendanceMetrics(metrics);
      setPendingLeaves(leaves.slice(0, 5));
      setPayrollSummary(pay);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickApproveLeave = async (requestId: string) => {
    try {
      await leaveService.approveLeave(requestId, 'Approved from Admin Quick Dashboard');
      success('Leave request approved');
      await loadDashboardData();
    } catch (err: any) {
      error('Failed to approve leave', err.message);
    }
  };

  const handleQuickRejectLeave = async (requestId: string) => {
    try {
      await leaveService.rejectLeave(requestId, 'Declined from Admin Quick Dashboard');
      success('Leave request rejected');
      await loadDashboardData();
    } catch (err: any) {
      error('Failed to reject leave', err.message);
    }
  };

  const handleSaveEmployee = async (data: any) => {
    await employeeService.saveEmployee(data);
    success('New employee onboarded successfully');
    await loadDashboardData();
  };

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Loading real-time workforce metrics..." />;
  }

  // Department counts
  const departmentCounts: Record<string, number> = {};
  employees.forEach(e => {
    departmentCounts[e.department] = (departmentCounts[e.department] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Workforce Command Center</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time status overview, attendance tracking, leave queues, and payroll metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-add-employee-btn"
            onClick={() => setIsAddEmployeeOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Add Employee</span>
          </button>
          <button
            id="admin-payroll-run-quick"
            onClick={() => navigate('/admin/payroll')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl transition-all shadow-2xs"
          >
            <Receipt className="w-4 h-4 text-slate-600" />
            <span>Payroll Hub</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Employees"
          value={employees.length}
          subtitle={`${employees.filter(e => e.status === 'ACTIVE').length} Active Staff`}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50 text-blue-600"
          trend={{ value: '+4.2%', isPositive: true }}
          onClick={() => navigate('/admin/employees')}
        />

        <StatCard
          title="On-time Today"
          value={`${attendanceMetrics?.attendanceRate || 0}%`}
          subtitle={`${attendanceMetrics?.present || 0} of ${attendanceMetrics?.totalEmployees || 0} checked in`}
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-50 text-orange-600"
          trend={{ value: 'Live', isPositive: false }}
          onClick={() => navigate('/admin/attendance')}
        />

        <StatCard
          title="Leave Requests"
          value={pendingLeaves.length}
          subtitle="Awaiting supervisor review"
          icon={<CalendarOff className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50 text-purple-600"
          trend={{ value: `${pendingLeaves.length} Pending`, isPositive: false }}
          onClick={() => navigate('/admin/leave')}
        />

        <StatCard
          title="Payroll Summary"
          value={`$${(payrollSummary?.totalNet || 0).toLocaleString()}`}
          subtitle={`August 2026 (${payrollSummary?.totalRecords || 0} Employees)`}
          icon={<Receipt className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50 text-emerald-600"
          trend={{ value: 'Monthly', isPositive: false }}
          onClick={() => navigate('/admin/payroll')}
        />
      </div>

      {/* Main Grid: Attendance Live Breakdown + Pending Leaves Review & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Attendance Pulse & Department Spread */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Attendance Pulse */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800">Today's Attendance</h3>
              </div>
              <button
                onClick={() => navigate('/admin/attendance')}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-green-50/70 rounded-xl border border-green-100">
                  <span className="text-[10px] font-bold uppercase text-green-700 block">Present</span>
                  <span className="text-2xl font-bold text-green-900 mt-0.5 block">{attendanceMetrics?.present || 0}</span>
                </div>
                <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-100">
                  <span className="text-[10px] font-bold uppercase text-orange-700 block">Late Arrivals</span>
                  <span className="text-2xl font-bold text-orange-900 mt-0.5 block">{attendanceMetrics?.late || 0}</span>
                </div>
                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-bold uppercase text-purple-700 block">On Leave</span>
                  <span className="text-2xl font-bold text-purple-900 mt-0.5 block">{attendanceMetrics?.onLeave || 0}</span>
                </div>
                <div className="p-3 bg-red-50/70 rounded-xl border border-red-100">
                  <span className="text-[10px] font-bold uppercase text-red-700 block">Absent</span>
                  <span className="text-2xl font-bold text-red-900 mt-0.5 block">{attendanceMetrics?.absent || 0}</span>
                </div>
              </div>

              {/* Attendance Progress Stack */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Workforce Attendance Capacity</span>
                  <span className="font-bold text-slate-900">{attendanceMetrics?.attendanceRate || 0}% present</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${Math.round(((attendanceMetrics?.present || 0) / (attendanceMetrics?.totalEmployees || 1)) * 100)}%` }}
                    title="Present"
                  />
                  <div 
                    className="bg-purple-400 h-full transition-all"
                    style={{ width: `${Math.round(((attendanceMetrics?.onLeave || 0) / (attendanceMetrics?.totalEmployees || 1)) * 100)}%` }}
                    title="On Leave"
                  />
                  <div 
                    className="bg-rose-400 h-full transition-all"
                    style={{ width: `${Math.round(((attendanceMetrics?.absent || 0) / (attendanceMetrics?.totalEmployees || 1)) * 100)}%` }}
                    title="Absent"
                  />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Present</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> On Leave</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /> Absent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800">Department Workforce Distribution</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">{Object.keys(departmentCounts).length} Departments</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {Object.entries(departmentCounts).map(([dept, count]) => {
                const percent = Math.round((count / employees.length) * 100);
                return (
                  <div key={dept} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-800">{dept}</span>
                      <span className="font-semibold text-slate-600">{count} members ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Leave Requests + Dark Sleek Quick Actions */}
        <div className="space-y-6 flex flex-col">
          {/* Recent Leave Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarOff className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-800">Recent Leave Requests</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-600 rounded">
                {pendingLeaves.length} Pending
              </span>
            </div>

            <div className="space-y-3 flex-1 my-3 overflow-y-auto max-h-[340px]">
              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No pending leave requests! All applications are actioned.
                </div>
              ) : (
                pendingLeaves.map(req => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          src={req.employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={req.employee?.full_name}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{req.employee?.full_name}</p>
                          <p className="text-[10px] text-slate-500">{req.leave_type.replace('_', ' ')} • {req.number_of_days}d</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{req.start_date}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 italic truncate leading-snug">
                      "{req.reason}"
                    </p>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleQuickApproveLeave(req.id)}
                        className="flex-1 py-1.5 text-[10px] bg-blue-600 hover:bg-blue-700 text-white rounded font-bold uppercase transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleQuickRejectLeave(req.id)}
                        className="flex-1 py-1.5 text-[10px] bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded font-bold uppercase transition-colors"
                      >
                        Deny
                      </button>
                      <button
                        onClick={() => setSelectedLeaveForReview(req)}
                        className="px-2 py-1.5 text-[10px] text-slate-500 hover:text-slate-800 rounded font-semibold transition-colors"
                        title="Review Details"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => navigate('/admin/leave')}
                className="text-xs font-semibold text-blue-600 hover:underline transition-colors"
              >
                Go to Leave Queue &rarr;
              </button>
            </div>
          </div>

          {/* Sleek Dark Quick Actions widget matching design */}
          <div className="bg-[#1E293B] rounded-2xl p-5 text-white shadow-sm border border-slate-800">
            <h3 className="text-sm font-bold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors text-center"
              >
                <span className="text-base">👥</span>
                <span>Add Employee</span>
              </button>
              <button
                onClick={() => navigate('/admin/payroll')}
                className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors text-center"
              >
                <span className="text-base">💳</span>
                <span>New Payroll</span>
              </button>
              <button
                onClick={() => navigate('/admin/attendance')}
                className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors text-center"
              >
                <span className="text-base">🕒</span>
                <span>Attendance Log</span>
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="p-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-xs font-semibold flex flex-col items-center gap-1.5 transition-colors text-center"
              >
                <span className="text-base">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <EmployeeFormModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSave={handleSaveEmployee}
      />

      {/* Review Leave Modal */}
      <LeaveApprovalModal
        isOpen={!!selectedLeaveForReview}
        onClose={() => setSelectedLeaveForReview(null)}
        request={selectedLeaveForReview}
        onApprove={async (id, comment) => {
          await leaveService.approveLeave(id, comment);
          success('Leave application approved');
          await loadDashboardData();
        }}
        onReject={async (id, comment) => {
          await leaveService.rejectLeave(id, comment);
          success('Leave application rejected');
          await loadDashboardData();
        }}
      />
    </div>
  );
};
