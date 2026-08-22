import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  DollarSign, 
  Play, 
  Plus, 
  Download, 
  Eye, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Search,
  Printer
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { PayslipModal } from '../../components/payroll/PayslipModal';
import { PayrollFormModal } from '../../components/payroll/PayrollFormModal';
import { payrollService } from '../../services/payrollService';
import { useToast } from '../../context/ToastContext';
import type { PayrollRecord, PaymentStatus } from '../../types';

export const PayrollPage: React.FC = () => {
  const { success, error, info } = useToast();

  const [month, setMonth] = useState('August');
  const [year, setYear] = useState(2026);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [department, setDepartment] = useState('ALL');
  const [search, setSearch] = useState('');

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningPayroll, setIsRunningPayroll] = useState(false);

  // Modals
  const [viewingPayslip, setViewingPayslip] = useState<PayrollRecord | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);

  const loadPayrollData = async () => {
    setIsLoading(true);
    try {
      const records = await payrollService.getPayrollRecords({
        month,
        year,
        paymentStatus,
        department,
        search,
      });
      const sum = await payrollService.getPayrollSummary(month, year);
      setPayrollRecords(records);
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load payroll data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollData();
  }, [month, year, paymentStatus, department, search]);

  const handleRunAutomatedPayroll = async () => {
    setIsRunningPayroll(true);
    try {
      const res = await payrollService.generateMonthlyPayroll(month, year);
      success('Automated Payroll Run Completed', `Generated ${res.generatedCount} employee payslips ($${res.totalAmount.toLocaleString()} Net).`);
      await loadPayrollData();
    } catch (err: any) {
      error('Payroll Run Failed', err.message);
    } finally {
      setIsRunningPayroll(false);
    }
  };

  const handleSaveRecord = async (data: any) => {
    try {
      await payrollService.savePayrollRecord(data);
      success(editingRecord ? 'Payroll record updated' : 'Payroll record created');
      setEditingRecord(null);
      await loadPayrollData();
    } catch (err: any) {
      error('Failed to save payroll record', err.message);
    }
  };

  const handleExportCsv = () => {
    const headers = 'Pay Period,Employee ID,Full Name,Department,Basic Salary,Gross Salary,Deductions,Tax,Net Salary,Payment Status,Payment Method\n';
    const rows = payrollRecords.map(p => `"${p.pay_period_month} ${p.pay_period_year}","${p.employee?.employee_id}","${p.employee?.full_name}","${p.employee?.department}","${p.basic_salary}","${p.gross_salary}","${p.deductions}","${p.tax}","${p.net_salary}","${p.payment_status}","${p.payment_method}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Payroll_${month}_${year}.csv`;
    a.click();
    info('Payroll CSV Exported');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Payroll & Compensation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Execute monthly salary runs, manage allowances & deductions, and issue official payslips.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Ledger</span>
          </button>

          <button
            id="run-automated-payroll-btn"
            onClick={handleRunAutomatedPayroll}
            disabled={isRunningPayroll}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunningPayroll ? 'Executing Run...' : `Run ${month} Payroll`}</span>
          </button>

          <button
            id="add-payroll-record-btn"
            onClick={() => {
              setEditingRecord(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Manual Entry</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Disbursed"
          value={`$${(summary?.totalNet || 0).toLocaleString()}`}
          subtitle={`${summary?.month} ${summary?.year} Pay Run`}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Gross Payroll Volume"
          value={`$${(summary?.totalGross || 0).toLocaleString()}`}
          subtitle="Before taxes & withholdings"
          icon={<Receipt className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />

        <StatCard
          title="Withholdings & Tax"
          value={`$${(summary?.totalDeductions || 0).toLocaleString()}`}
          subtitle="Statutory 15% tax + health plans"
          icon={<Clock className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
        />

        <StatCard
          title="Disbursement Status"
          value={`${summary?.paidCount || 0} / ${summary?.totalRecords || 0}`}
          subtitle={`${summary?.pendingCount || 0} pending processing`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Month Selector */}
          <select
            id="payroll-month-filter"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
              <option key={m} value={m}>{m} {year}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="payroll-search-input"
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      {isLoading ? (
        <LoadingSpinner label="Compiling monthly compensation entries..." />
      ) : payrollRecords.length === 0 ? (
        <EmptyState
          title={`No Payroll Records for ${month} ${year}`}
          description="You haven't run payroll for this month yet. Click 'Run Automated Payroll' to generate payslips for all active employees."
          action={{
            label: `Run ${month} Payroll Now`,
            onClick: handleRunAutomatedPayroll,
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">ID / Dept</th>
                  <th className="px-4 py-3.5">Basic Salary</th>
                  <th className="px-4 py-3.5">Allowances + Bonus</th>
                  <th className="px-4 py-3.5">Taxes & Deduct</th>
                  <th className="px-4 py-3.5">Net Pay</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollRecords.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={p.employee?.full_name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{p.employee?.full_name}</p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{p.employee?.designation}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-800 font-medium block">{p.employee?.employee_id}</span>
                      <span className="text-[10px] text-slate-400">{p.employee?.department}</span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-800">
                      ${p.basic_salary.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-emerald-600 font-medium">
                      +${(p.allowances + p.bonuses).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 font-mono text-rose-600 font-medium">
                      -${(p.deductions + p.tax).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      ${p.net_salary.toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={p.payment_status} />
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingPayslip(p)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-2xs transition-colors text-[11px]"
                          title="View Official Payslip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Payslip</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingRecord(p);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Adjust Values"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      <PayslipModal
        isOpen={!!viewingPayslip}
        onClose={() => setViewingPayslip(null)}
        record={viewingPayslip}
      />

      {/* Edit / New Entry Modal */}
      <PayrollFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingRecord(null);
        }}
        initialRecord={editingRecord}
        onSave={handleSaveRecord}
      />
    </div>
  );
};
