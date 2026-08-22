import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { PayrollRecord, Employee } from '../../types';
import { localDb } from '../../lib/supabase';

interface PayrollFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: any) => Promise<void>;
  initialRecord?: PayrollRecord | null;
}

export const PayrollFormModal: React.FC<PayrollFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialRecord,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employee_id: '',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 6000,
    allowances: 480,
    bonuses: 250,
    deductions: 180,
    tax: 1000,
    payment_status: 'PAID' as 'PAID' | 'PENDING' | 'PROCESSING',
    payment_method: 'Direct Bank Deposit',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const list = localDb.getEmployees();
    setEmployees(list);
    if (list.length > 0 && !initialRecord) {
      setFormData(prev => ({
        ...prev,
        employee_id: list[0].id,
        basic_salary: list[0].base_salary || 6000,
        allowances: Math.round((list[0].base_salary || 6000) * 0.08),
        deductions: Math.round((list[0].base_salary || 6000) * 0.03),
        tax: Math.round((list[0].base_salary || 6000) * 0.15),
      }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialRecord) {
      setFormData({
        employee_id: initialRecord.employee_id,
        pay_period_month: initialRecord.pay_period_month,
        pay_period_year: initialRecord.pay_period_year,
        basic_salary: initialRecord.basic_salary,
        allowances: initialRecord.allowances,
        bonuses: initialRecord.bonuses,
        deductions: initialRecord.deductions,
        tax: initialRecord.tax,
        payment_status: initialRecord.payment_status as any,
        payment_method: initialRecord.payment_method,
        notes: initialRecord.notes || '',
      });
    }
  }, [initialRecord, isOpen]);

  const gross = Number(formData.basic_salary) + Number(formData.allowances) + Number(formData.bonuses);
  const net = gross - (Number(formData.deductions) + Number(formData.tax));

  const handleEmployeeChange = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      const basic = emp.base_salary || 6000;
      setFormData(prev => ({
        ...prev,
        employee_id: empId,
        basic_salary: basic,
        allowances: Math.round(basic * 0.08),
        deductions: Math.round(basic * 0.03),
        tax: Math.round(basic * 0.15),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialRecord ? { id: initialRecord.id } : {}),
        ...formData,
        basic_salary: Number(formData.basic_salary),
        allowances: Number(formData.allowances),
        bonuses: Number(formData.bonuses),
        deductions: Number(formData.deductions),
        tax: Number(formData.tax),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialRecord ? "Adjust Payroll Record" : "Issue New Payroll Record"}
      subtitle="Configure compensation structure, allowances, and statutory deductions"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Select Employee *</label>
          <select
            value={formData.employee_id}
            onChange={(e) => handleEmployeeChange(e.target.value)}
            disabled={!!initialRecord}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.full_name} ({e.employee_id} - {e.department})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pay Period Month</label>
            <select
              value={formData.pay_period_month}
              onChange={(e) => setFormData({ ...formData, pay_period_month: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Year</label>
            <input
              type="number"
              value={formData.pay_period_year}
              onChange={(e) => setFormData({ ...formData, pay_period_year: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Basic Salary ($)</label>
            <input
              type="number"
              min="0"
              value={formData.basic_salary}
              onChange={(e) => setFormData({ ...formData, basic_salary: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Allowances ($)</label>
            <input
              type="number"
              min="0"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Bonuses ($)</label>
            <input
              type="number"
              min="0"
              value={formData.bonuses}
              onChange={(e) => setFormData({ ...formData, bonuses: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Healthcare & Deductions ($)</label>
            <input
              type="number"
              min="0"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Estimated Tax ($)</label>
            <input
              type="number"
              min="0"
              value={formData.tax}
              onChange={(e) => setFormData({ ...formData, tax: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Calculated summary card */}
        <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Gross Earnings: ${gross.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 block">Deductions: ${(Number(formData.deductions) + Number(formData.tax)).toLocaleString()}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Net Pay</span>
            <span className="text-base font-bold text-indigo-700 font-mono">${net.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
            <select
              value={formData.payment_status}
              onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Disbursement Method</label>
            <input
              type="text"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : initialRecord ? 'Update Record' : 'Create Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
