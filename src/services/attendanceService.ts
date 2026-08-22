import { localDb } from '../lib/supabase';
import type { Attendance, AttendanceStatus } from '../types';

export interface AttendanceFilters {
  date?: string; // YYYY-MM-DD
  department?: string;
  status?: AttendanceStatus | 'ALL';
  search?: string;
}

export const attendanceService = {
  async getTodayStatus(employeeId: string): Promise<{
    status: AttendanceStatus | 'NOT_CHECKED_IN';
    attendance?: Attendance;
    canCheckIn: boolean;
    canCheckOut: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    workingHours: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    const record = localDb.getTodayAttendance(employeeId, today);

    if (!record || !record.check_in) {
      return {
        status: 'NOT_CHECKED_IN',
        attendance: record,
        canCheckIn: true,
        canCheckOut: false,
        workingHours: 0,
      };
    }

    if (record.check_in && !record.check_out) {
      const checkInDate = new Date(record.check_in);
      const now = new Date();
      const elapsedHours = Number(((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)).toFixed(2));

      return {
        status: record.status,
        attendance: record,
        canCheckIn: false,
        canCheckOut: true,
        checkInTime: record.check_in,
        workingHours: Math.max(0, elapsedHours),
      };
    }

    return {
      status: record.status,
      attendance: record,
      canCheckIn: false,
      canCheckOut: false,
      checkInTime: record.check_in,
      checkOutTime: record.check_out || undefined,
      workingHours: record.working_hours || 0,
    };
  },

  async checkIn(employeeId: string, notes?: string): Promise<Attendance> {
    return localDb.recordCheckIn(employeeId, notes);
  },

  async checkOut(employeeId: string): Promise<Attendance> {
    return localDb.recordCheckOut(employeeId);
  },

  async getEmployeeAttendance(employeeId: string, period?: 'all' | 'month' | 'week'): Promise<Attendance[]> {
    let records = localDb.getAttendanceForEmployee(employeeId);
    
    if (period === 'week') {
      const oneWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      records = records.filter(r => r.date >= oneWeekAgo);
    } else if (period === 'month') {
      const oneMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      records = records.filter(r => r.date >= oneMonthAgo);
    }

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getAllAttendance(filters: AttendanceFilters = {}): Promise<Attendance[]> {
    let records = localDb.getAttendance();

    if (filters.date) {
      records = records.filter(r => r.date === filters.date);
    }

    if (filters.department && filters.department !== 'ALL') {
      records = records.filter(r => r.employee?.department === filters.department);
    }

    if (filters.status && filters.status !== 'ALL') {
      records = records.filter(r => r.status === filters.status);
    }

    if (filters.search && filters.search.trim() !== '') {
      const s = filters.search.toLowerCase().trim();
      records = records.filter(r => 
        r.employee?.full_name.toLowerCase().includes(s) ||
        r.employee?.employee_id.toLowerCase().includes(s) ||
        r.employee?.department.toLowerCase().includes(s)
      );
    }

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getAttendanceMetrics(dateStr?: string) {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    const employees = localDb.getEmployees().filter(e => e.status === 'ACTIVE');
    const attendanceRecords = localDb.getAttendance().filter(r => r.date === targetDate);

    const total = employees.length;
    let present = 0;
    let late = 0;
    let halfDay = 0;
    let onLeave = 0;
    let absent = 0;

    // Map existing attendance records
    attendanceRecords.forEach(rec => {
      if (rec.status === 'PRESENT') present++;
      else if (rec.status === 'LATE') {
        present++;
        late++;
      } else if (rec.status === 'HALF_DAY') {
        present++;
        halfDay++;
      } else if (rec.status === 'LEAVE') onLeave++;
      else if (rec.status === 'ABSENT') absent++;
    });

    // Any employee without record is considered pending/absent
    const unrecorded = Math.max(0, total - (present + onLeave + absent));

    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      date: targetDate,
      totalEmployees: total,
      present,
      late,
      halfDay,
      onLeave,
      absent: absent + unrecorded,
      attendanceRate,
    };
  }
};
