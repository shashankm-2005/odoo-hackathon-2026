import React from 'react';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { Printer, Download, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { PayrollRecord } from '../../types';
import { useToast } from '../../context/ToastContext';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { info } = useToast();

  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    info('Payslip PDF Exported', `Generated payslip for ${record.employee?.full_name} (${record.pay_period_month} ${record.pay_period_year})`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Payslip Statement"
      subtitle={`Pay Period: ${record.pay_period_month} ${record.pay_period_year}`}
      maxWidth="2xl"
    >
      <div id="printable-payslip" className="space-y-6 text-xs bg-white p-2">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900">DAYFLOW HRMS</h2>
              <p className="text-[11px] text-slate-500 font-medium">Enterprise Workforce & Payroll Management</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Statement Reference</span>
            <span className="font-mono font-bold text-slate-800 text-xs">PAY-{record.pay_period_year}-{record.pay_period_month.substring(0, 3).toUpperCase()}-{record.id.substring(record.id.length - 4)}</span>
            <div className="mt-1">
              <StatusBadge status={record.payment_status} />
            </div>
          </div>
        </div>

        {/* Employee & Payment Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee Name</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{record.employee?.full_name}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.employee?.employee_id}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.employee?.department}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.employee?.designation}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pay Period</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.pay_period_month} {record.pay_period_year}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.payment_method}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Disbursement Date</span>
            <span className="font-medium text-slate-800 mt-0.5 block">{record.payment_date || 'Processed'}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Employment Type</span>
            <span className="font-medium text-slate-800 mt-0.5 block">Full Time Regular</span>
          </div>
        </div>

        {/* Earnings & Deductions Breakdown Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between font-bold">
              <span>Earnings / Additions</span>
              <span>Amount ($)</span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Basic Salary</span>
                <span className="font-semibold text-slate-900">${record.basic_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Allowances (Housing & Travel)</span>
                <span className="font-semibold text-slate-900">${record.allowances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Performance Bonus</span>
                <span className="font-semibold text-slate-900">${record.bonuses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Gross Earnings</span>
                <span className="text-emerald-600">${record.gross_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex justify-between font-bold">
              <span>Deductions & Taxes</span>
              <span>Amount ($)</span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>Statutory Income Tax</span>
                <span className="font-semibold text-slate-900">${record.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Healthcare & Benefits Plan</span>
                <span className="font-semibold text-slate-900">${record.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400 italic">
                <span>Other Withholdings</span>
                <span>$0.00</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Deductions</span>
                <span className="text-rose-600">${(record.deductions + record.tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay Highlight Banner */}
        <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Total Net Compensation Credited</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Calculated as (Gross Earnings) - (Total Deductions & Tax)</p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
              ${record.net_salary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Note / Disclaimer */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p>
            This is a computer-generated payroll advice document from Dayflow HRMS and carries authorized cryptographic certification. No physical signature is required.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Payslip</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
