import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  DollarSign, 
  Eye, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { PayslipModal } from '../../components/payroll/PayslipModal';
import { useAuth } from '../../context/AuthContext';
import { payrollService } from '../../services/payrollService';
import type { PayrollRecord } from '../../types';

export const EmployeePayrollPage: React.FC = () => {
  const { employee } = useAuth();
  const [payslips, setPayslips] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const empId = employee?.id || '';

  const loadPayslips = async () => {
    if (!empId) return;
    setIsLoading(true);
    try {
      const data = await payrollService.getPayrollRecords({ employeeId: empId });
      setPayslips(data);
    } catch (err) {
      console.error('Failed to load payslips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, [empId]);

  const latest = payslips.length > 0 ? payslips[0] : null;
  const totalNetAllTime = payslips.reduce((sum, p) => sum + p.net_salary, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">My Compensation & Payslips</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review disbursement history, tax withholdings, monthly payslips, and compensation statements.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Latest Net Pay"
          value={latest ? `$${latest.net_salary.toLocaleString()}` : '$0'}
          subtitle={latest ? `${latest.pay_period_month} ${latest.pay_period_year} Cycle` : 'No cycles run'}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Base Salary Rate"
          value={`$${(employee?.base_salary || 6000).toLocaleString()}`}
          subtitle="Monthly standard base pay"
          icon={<Receipt className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />

        <StatCard
          title="Total Earnings Received"
          value={`$${totalNetAllTime.toLocaleString()}`}
          subtitle={`${payslips.length} Statements on record`}
          icon={<CheckCircle2 className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-50"
        />
      </div>

      {/* Payslips Archive Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Payroll Statement Archive</h3>

        {isLoading ? (
          <LoadingSpinner label="Fetching your payslips archive..." />
        ) : payslips.length === 0 ? (
          <EmptyState
            title="No Payslips Issued Yet"
            description="Your organization administrator has not yet processed a payroll run for your account."
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Pay Period</th>
                    <th className="px-4 py-3.5">Basic Salary</th>
                    <th className="px-4 py-3.5">Allowances & Bonus</th>
                    <th className="px-4 py-3.5">Tax & Deductions</th>
                    <th className="px-4 py-3.5">Net Take-Home</th>
                    <th className="px-4 py-3.5">Payment Method</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslips.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {p.pay_period_month} {p.pay_period_year}
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

                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-700">
                        ${p.net_salary.toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5 text-slate-600">
                        {p.payment_method}
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={p.payment_status} />
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedPayslip(p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-2xs transition-colors ml-auto text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Statement</span>
                        </button>
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
      <PayslipModal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        record={selectedPayslip}
      />
    </div>
  );
};
