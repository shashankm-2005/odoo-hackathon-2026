import { localDb } from '../lib/supabase';
import type { PayrollRecord, PaymentStatus } from '../types';

export interface PayrollFilters {
  employeeId?: string;
  month?: string;
  year?: number;
  paymentStatus?: PaymentStatus | 'ALL';
  department?: string;
  search?: string;
}

export const payrollService = {
  async getPayrollRecords(filters: PayrollFilters = {}): Promise<PayrollRecord[]> {
    let records = localDb.getPayroll();

    if (filters.employeeId) {
      records = records.filter(p => p.employee_id === filters.employeeId);
    }

    if (filters.month && filters.month !== 'ALL') {
      records = records.filter(p => p.pay_period_month.toLowerCase() === filters.month!.toLowerCase());
    }

    if (filters.year) {
      records = records.filter(p => p.pay_period_year === Number(filters.year));
    }

    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
      records = records.filter(p => p.payment_status === filters.paymentStatus);
    }

    if (filters.department && filters.department !== 'ALL') {
      records = records.filter(p => p.employee?.department === filters.department);
    }

    if (filters.search && filters.search.trim() !== '') {
      const s = filters.search.toLowerCase().trim();
      records = records.filter(p => 
        p.employee?.full_name.toLowerCase().includes(s) ||
        p.employee?.employee_id.toLowerCase().includes(s) ||
        p.employee?.department.toLowerCase().includes(s)
      );
    }

    return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getPayslipById(id: string): Promise<PayrollRecord | null> {
    const records = localDb.getPayroll();
    return records.find(r => r.id === id) || null;
  },

  async savePayrollRecord(record: Partial<PayrollRecord> & { employee_id: string; pay_period_month: string; pay_period_year: number; basic_salary: number }): Promise<PayrollRecord> {
    return localDb.savePayrollRecord(record);
  },

  async generateMonthlyPayroll(month: string, year: number = 2026): Promise<{ generatedCount: number; totalAmount: number }> {
    const employees = localDb.getEmployees().filter(e => e.status === 'ACTIVE');
    let generatedCount = 0;
    let totalAmount = 0;

    for (const emp of employees) {
      const basic = emp.base_salary || 6000;
      const allowances = Math.round(basic * 0.08); // 8% standard allowances
      const bonuses = 250; // Standard company performance bonus
      const deductions = Math.round(basic * 0.03); // 3% health and benefits
      const tax = Math.round((basic + allowances + bonuses) * 0.15); // 15% estimated tax

      const payrollRecord = localDb.savePayrollRecord({
        employee_id: emp.id,
        pay_period_month: month,
        pay_period_year: year,
        basic_salary: basic,
        allowances,
        bonuses,
        deductions,
        tax,
        payment_status: 'PAID',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Direct Bank Deposit',
        notes: `System generated automated payroll run for ${month} ${year}`,
      });

      generatedCount++;
      totalAmount += payrollRecord.net_salary;

      // Notify employee if profile exists
      if (emp.profile_id) {
        localDb.createNotification({
          user_id: emp.profile_id,
          title: `${month} ${year} Payslip Available`,
          message: `Your payslip for ${month} ${year} of $${payrollRecord.net_salary.toLocaleString()} Net has been generated.`,
          type: 'payroll',
          link: '/employee/payroll',
        });
      }
    }

    return { generatedCount, totalAmount };
  },

  async getPayrollSummary(month: string = 'August', year: number = 2026) {
    const records = await this.getPayrollRecords({ month, year });
    const totalGross = records.reduce((sum, r) => sum + r.gross_salary, 0);
    const totalNet = records.reduce((sum, r) => sum + r.net_salary, 0);
    const totalDeductions = records.reduce((sum, r) => sum + r.deductions + r.tax, 0);
    const paidCount = records.filter(r => r.payment_status === 'PAID').length;
    const pendingCount = records.filter(r => r.payment_status === 'PENDING').length;

    return {
      month,
      year,
      totalGross,
      totalNet,
      totalDeductions,
      totalRecords: records.length,
      paidCount,
      pendingCount,
    };
  }
};
