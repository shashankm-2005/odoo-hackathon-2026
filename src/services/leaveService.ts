import { localDb } from '../lib/supabase';
import type { LeaveRequest, LeaveStatus, LeaveType, LeaveQuota } from '../types';

export interface LeaveFilters {
  employeeId?: string;
  status?: LeaveStatus | 'ALL';
  leaveType?: LeaveType | 'ALL';
  search?: string;
}

export const leaveService = {
  async getLeaveRequests(filters: LeaveFilters = {}): Promise<LeaveRequest[]> {
    let requests = localDb.getLeaveRequests();

    if (filters.employeeId) {
      requests = requests.filter(r => r.employee_id === filters.employeeId);
    }

    if (filters.status && filters.status !== 'ALL') {
      requests = requests.filter(r => r.status === filters.status);
    }

    if (filters.leaveType && filters.leaveType !== 'ALL') {
      requests = requests.filter(r => r.leave_type === filters.leaveType);
    }

    if (filters.search && filters.search.trim() !== '') {
      const s = filters.search.toLowerCase().trim();
      requests = requests.filter(r => 
        r.employee?.full_name.toLowerCase().includes(s) ||
        r.employee?.employee_id.toLowerCase().includes(s) ||
        r.reason.toLowerCase().includes(s)
      );
    }

    return requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async submitLeaveRequest(payload: {
    employeeId: string;
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<LeaveRequest> {
    if (!payload.employeeId) throw new Error('Employee ID is required');
    if (!payload.startDate || !payload.endDate) throw new Error('Start date and end date are required');
    if (!payload.reason || payload.reason.trim().length < 5) throw new Error('Please provide a descriptive reason (at least 5 characters)');

    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (end < start) {
      throw new Error('End date cannot be earlier than start date');
    }

    // Calculate number of working days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const employee = localDb.getEmployeeById(payload.employeeId);
    if (!employee) throw new Error('Employee profile not found');

    return localDb.submitLeaveRequest({
      employee_id: payload.employeeId,
      employee: employee,
      leave_type: payload.leaveType,
      start_date: payload.startDate,
      end_date: payload.endDate,
      number_of_days: diffDays,
      reason: payload.reason.trim(),
    });
  },

  async approveLeave(requestId: string, adminComment?: string, reviewerName: string = 'Sarah Jenkins (Admin)'): Promise<LeaveRequest> {
    return localDb.updateLeaveStatus(requestId, 'APPROVED', adminComment, reviewerName);
  },

  async rejectLeave(requestId: string, adminComment?: string, reviewerName: string = 'Sarah Jenkins (Admin)'): Promise<LeaveRequest> {
    return localDb.updateLeaveStatus(requestId, 'REJECTED', adminComment, reviewerName);
  },

  async getLeaveQuotas(employeeId: string): Promise<LeaveQuota[]> {
    const employeeRequests = localDb.getLeaveRequestsForEmployee(employeeId);
    const approvedRequests = employeeRequests.filter(r => r.status === 'APPROVED');

    const calculateUsed = (type: LeaveType) => {
      return approvedRequests
        .filter(r => r.leave_type === type)
        .reduce((sum, r) => sum + r.number_of_days, 0);
    };

    const paidUsed = calculateUsed('PAID_LEAVE');
    const sickUsed = calculateUsed('SICK_LEAVE');
    const casualUsed = calculateUsed('CASUAL_LEAVE');
    const unpaidUsed = calculateUsed('UNPAID_LEAVE');

    const QUOTAS: LeaveQuota[] = [
      {
        type: 'PAID_LEAVE',
        label: 'Paid / Annual Leave',
        total: 18,
        used: paidUsed,
        remaining: Math.max(0, 18 - paidUsed),
        color: 'blue',
      },
      {
        type: 'SICK_LEAVE',
        label: 'Sick Leave',
        total: 12,
        used: sickUsed,
        remaining: Math.max(0, 12 - sickUsed),
        color: 'emerald',
      },
      {
        type: 'CASUAL_LEAVE',
        label: 'Casual / Personal',
        total: 8,
        used: casualUsed,
        remaining: Math.max(0, 8 - casualUsed),
        color: 'amber',
      },
      {
        type: 'UNPAID_LEAVE',
        label: 'Unpaid Leave',
        total: 30,
        used: unpaidUsed,
        remaining: Math.max(0, 30 - unpaidUsed),
        color: 'purple',
      }
    ];

    return QUOTAS;
  }
};
