import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CalendarOff, 
  Receipt, 
  User, 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Megaphone
} from 'lucide-react';
import { CheckInOutWidget } from '../../components/attendance/CheckInOutWidget';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { LeaveRequestModal } from '../../components/leave/LeaveRequestModal';
import { PayslipModal } from '../../components/payroll/PayslipModal';
import { useAuth } from '../../context/AuthContext';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';
import { attendanceService } from '../../services/attendanceService';
import { localDb } from '../../lib/supabase';
import type { LeaveQuota, LeaveRequest, PayrollRecord } from '../../types';

export const EmployeeDashboardPage: React.FC = () => {
  const { user, employee } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [quotas, setQuotas] = useState<LeaveQuota[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);
  const [latestPayslip, setLatestPayslip] = useState<PayrollRecord | null>(null);

  // Modals
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [viewingPayslip, setViewingPayslip] = useState<PayrollRecord | null>(null);

  const empId = employee?.id || '';

  const loadEmployeeData = async () => {
    if (!empId) return;
    try {
      setIsLoading(true);
      const q = await leaveService.getLeaveQuotas(empId);
      const l = await leaveService.getLeaveRequests({ employeeId: empId });
      const p = await payrollService.getPayrollRecords({ employeeId: empId });

      setQuotas(q);
      setRecentLeaves(l.slice(0, 3));
      if (p.length > 0) setLatestPayslip(p[0]);
    } catch (err) {
      console.error('Failed to load employee dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployeeData();
  }, [empId]);

  if (isLoading) {
    return <LoadingSpinner fullHeight label="Loading personal self-service dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {user?.full_name?.split(' ')[0] || 'Employee'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {employee?.designation} • {employee?.department} (ID: {employee?.employee_id})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="employee-apply-leave-banner-btn"
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <CalendarOff className="w-4 h-4 text-blue-100" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* Check In / Check Out Main Console */}
      <CheckInOutWidget
        employeeId={empId}
        onAttendanceUpdated={loadEmployeeData}
      />

      {/* 2-Column Grid: Leave Quota Balances + Quick Access & Latest Payslip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Leave Balances & Recent Submissions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leave Quota Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarOff className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-800">Leave Quotas & Balances</h3>
              </div>
              <button
                onClick={() => navigate('/employee/leave')}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>My Time-off</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {quotas.map((q) => (
                <div key={q.type} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 block truncate">{q.label}</span>
                  <div className="my-2">
                    <span className="text-2xl font-bold text-slate-900 block">{q.remaining}</span>
                    <span className="text-[10px] text-slate-400 block font-medium">of {q.total} days remaining</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${Math.round(((q.total - q.remaining) / q.total) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leave Requests History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Leave Applications</h3>
              <button
                onClick={() => navigate('/employee/leave')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentLeaves.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  You haven't submitted any leave requests yet.
                </div>
              ) : (
                recentLeaves.map((req) => (
                  <div key={req.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{req.leave_type.replace('_', ' ')}</span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {req.start_date} to {req.end_date} ({req.number_of_days} days)
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 font-mono">{new Date(req.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Latest Payslip & Company Bulletin */}
        <div className="space-y-6 flex flex-col">
          {/* Latest Payslip Quick Card */}
          {latestPayslip && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-800 text-sm">Latest Payslip</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                    {latestPayslip.pay_period_month} {latestPayslip.pay_period_year}
                  </span>
                </div>

                <div className="my-4 text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Net Salary Deposited</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block font-mono">
                    ${latestPayslip.net_salary.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Gross: ${latestPayslip.gross_salary.toLocaleString()} • Tax: ${latestPayslip.tax.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                id="employee-view-latest-payslip-btn"
                onClick={() => setViewingPayslip(latestPayslip)}
                className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                View & Download Full Payslip
              </button>
            </div>
          )}

          {/* Company Announcements in Sleek Dark box */}
          <div className="bg-[#1E293B] text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-400" />
              <h4 className="font-bold text-sm">Team Bulletin</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Quarterly town hall is scheduled for next Friday at 2:00 PM. Please ensure all outstanding leave requests are submitted in Dayflow by Wednesday.
            </p>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        employeeId={empId}
        onLeaveSubmitted={loadEmployeeData}
      />

      {/* Payslip Viewer Modal */}
      <PayslipModal
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
        record={viewingPayslip}
      />
    </div>
  );
};
