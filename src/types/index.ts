export type UserRole = 'ADMIN' | 'EMPLOYEE';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'PROBATION' | 'TERMINATED';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';

export type LeaveType = 'PAID_LEAVE' | 'SICK_LEAVE' | 'UNPAID_LEAVE' | 'CASUAL_LEAVE';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'PROCESSING';

export interface Profile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  profile_id?: string;
  employee_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address: string;
  department: string;
  designation: string;
  joining_date: string;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  role: UserRole;
  base_salary: number;
  profile_image?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  employee?: Employee;
  date: string; // YYYY-MM-DD
  check_in?: string | null; // ISO string
  check_out?: string | null; // ISO string
  working_hours: number;
  status: AttendanceStatus;
  notes?: string;
  ip_address?: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee?: Employee;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  number_of_days: number;
  reason: string;
  status: LeaveStatus;
  admin_comment?: string | null;
  reviewed_by?: string | null;
  reviewed_by_name?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee?: Employee;
  pay_period_month: string;
  pay_period_year: number;
  basic_salary: number;
  allowances: number;
  bonuses: number;
  deductions: number;
  tax: number;
  gross_salary: number;
  net_salary: number;
  payment_status: PaymentStatus;
  payment_date?: string | null;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'leave' | 'payroll' | 'attendance';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface LeaveQuota {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  remaining: number;
  color: string;
}

export interface AdminDashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  lateToday: number;
  attendancePercentage: number;
  pendingLeaveRequests: number;
  activeDepartments: number;
  totalMonthlyPayroll: number;
}

export interface EmployeeDashboardStats {
  todayStatus: AttendanceStatus | 'NOT_CHECKED_IN';
  todayCheckInTime?: string;
  todayCheckOutTime?: string;
  todayWorkingHours: number;
  monthlyAttendanceRate: number;
  totalLeaveBalance: number;
  pendingLeavesCount: number;
  latestNetSalary: number;
}
