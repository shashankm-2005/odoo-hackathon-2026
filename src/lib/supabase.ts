import { createClient } from '@supabase/supabase-js';
import type { 
  Profile, 
  Employee, 
  Attendance, 
  LeaveRequest, 
  PayrollRecord, 
  Notification,
  UserRole
} from '../types';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ============================================================================
// LOCAL PERSISTENT DATABASE ENGINE (With RLS Enforcement & Seed Automation)
// ============================================================================

const STORAGE_KEYS = {
  PROFILES: 'dayflow_db_profiles',
  EMPLOYEES: 'dayflow_db_employees',
  ATTENDANCE: 'dayflow_db_attendance',
  LEAVE_REQUESTS: 'dayflow_db_leave_requests',
  PAYROLL: 'dayflow_db_payroll',
  NOTIFICATIONS: 'dayflow_db_notifications',
  CURRENT_USER: 'dayflow_auth_session',
  INITIALIZED: 'dayflow_db_initialized_v2',
};

// Initial Seed Dataset (Mirrors supabase/seed.sql)
const INITIAL_PROFILES: Profile[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@dayflow.io',
    full_name: 'Sarah Jenkins (Admin)',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    created_at: '2021-01-15T08:00:00Z',
    updated_at: '2021-01-15T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    email: 'alex.morgan@dayflow.io',
    full_name: 'Alex Morgan',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    created_at: '2022-03-01T08:00:00Z',
    updated_at: '2022-03-01T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    email: 'david.chen@dayflow.io',
    full_name: 'David Chen',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    created_at: '2021-08-10T08:00:00Z',
    updated_at: '2021-08-10T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    email: 'elena.rostova@dayflow.io',
    full_name: 'Elena Rostova',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    created_at: '2023-01-09T08:00:00Z',
    updated_at: '2023-01-09T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    email: 'marcus.vance@dayflow.io',
    full_name: 'Marcus Vance',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    created_at: '2022-06-15T08:00:00Z',
    updated_at: '2022-06-15T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    email: 'priya.sharma@dayflow.io',
    full_name: 'Priya Sharma',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    created_at: '2023-04-03T08:00:00Z',
    updated_at: '2023-04-03T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    email: 'lucas.silva@dayflow.io',
    full_name: 'Lucas Silva',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    created_at: '2023-09-18T08:00:00Z',
    updated_at: '2023-09-18T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    email: 'aaliyah.khan@dayflow.io',
    full_name: 'Aaliyah Khan',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    email: 'james.wilson@dayflow.io',
    full_name: 'James Wilson',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    created_at: '2022-10-10T08:00:00Z',
    updated_at: '2022-10-10T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000009',
    email: 'clara.oswald@dayflow.io',
    full_name: 'Clara Oswald',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    created_at: '2024-05-15T08:00:00Z',
    updated_at: '2024-05-15T08:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000000010',
    email: 'tariq.mansoor@dayflow.io',
    full_name: 'Tariq Mansoor',
    role: 'EMPLOYEE',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    created_at: '2023-07-01T08:00:00Z',
    updated_at: '2023-07-01T08:00:00Z',
  }
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    profile_id: 'a0000000-0000-0000-0000-000000000001',
    employee_id: 'EMP-001',
    full_name: 'Sarah Jenkins',
    email: 'admin@dayflow.io',
    phone: '+1 (555) 234-5678',
    gender: 'Female',
    date_of_birth: '1988-04-12',
    address: '742 Evergreen Terrace, Suite 100, San Francisco, CA',
    department: 'Human Resources',
    designation: 'Chief People Officer',
    joining_date: '2021-01-15',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'ADMIN',
    base_salary: 12500,
    profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Michael Jenkins',
    emergency_phone: '+1 (555) 998-1122',
    created_at: '2021-01-15T08:00:00Z',
    updated_at: '2021-01-15T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    profile_id: 'e0000000-0000-0000-0000-000000000001',
    employee_id: 'EMP-002',
    full_name: 'Alex Morgan',
    email: 'alex.morgan@dayflow.io',
    phone: '+1 (555) 345-6789',
    gender: 'Female',
    date_of_birth: '1993-08-23',
    address: '124 Market Street, Apt 4B, San Francisco, CA',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    joining_date: '2022-03-01',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 9800,
    profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Jessica Morgan',
    emergency_phone: '+1 (555) 887-3344',
    created_at: '2022-03-01T08:00:00Z',
    updated_at: '2022-03-01T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    profile_id: 'e0000000-0000-0000-0000-000000000002',
    employee_id: 'EMP-003',
    full_name: 'David Chen',
    email: 'david.chen@dayflow.io',
    phone: '+1 (555) 456-7890',
    gender: 'Male',
    date_of_birth: '1990-11-15',
    address: '500 Howard Street, San Francisco, CA',
    department: 'Engineering',
    designation: 'Lead DevOps Architect',
    joining_date: '2021-08-10',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 10500,
    profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Lisa Chen',
    emergency_phone: '+1 (555) 776-5544',
    created_at: '2021-08-10T08:00:00Z',
    updated_at: '2021-08-10T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    profile_id: 'e0000000-0000-0000-0000-000000000003',
    employee_id: 'EMP-004',
    full_name: 'Elena Rostova',
    email: 'elena.rostova@dayflow.io',
    phone: '+1 (555) 567-8901',
    gender: 'Female',
    date_of_birth: '1995-02-19',
    address: '88 Mission Bay Blvd, San Francisco, CA',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    joining_date: '2023-01-09',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 8400,
    profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Igor Rostov',
    emergency_phone: '+1 (555) 665-2211',
    created_at: '2023-01-09T08:00:00Z',
    updated_at: '2023-01-09T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    profile_id: 'e0000000-0000-0000-0000-000000000004',
    employee_id: 'EMP-005',
    full_name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.io',
    phone: '+1 (555) 678-9012',
    gender: 'Male',
    date_of_birth: '1989-06-30',
    address: '320 Folsom Street, San Francisco, CA',
    department: 'Marketing',
    designation: 'Head of Product Marketing',
    joining_date: '2022-06-15',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 9200,
    profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Valerie Vance',
    emergency_phone: '+1 (555) 554-7788',
    created_at: '2022-06-15T08:00:00Z',
    updated_at: '2022-06-15T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    profile_id: 'e0000000-0000-0000-0000-000000000005',
    employee_id: 'EMP-006',
    full_name: 'Priya Sharma',
    email: 'priya.sharma@dayflow.io',
    phone: '+1 (555) 789-0123',
    gender: 'Female',
    date_of_birth: '1994-09-08',
    address: '415 10th Street, San Francisco, CA',
    department: 'Human Resources',
    designation: 'HR Operations Specialist',
    joining_date: '2023-04-03',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 7200,
    profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Raj Sharma',
    emergency_phone: '+1 (555) 443-8899',
    created_at: '2023-04-03T08:00:00Z',
    updated_at: '2023-04-03T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    profile_id: 'e0000000-0000-0000-0000-000000000006',
    employee_id: 'EMP-007',
    full_name: 'Lucas Silva',
    email: 'lucas.silva@dayflow.io',
    phone: '+1 (555) 890-1234',
    gender: 'Male',
    date_of_birth: '1996-12-04',
    address: '180 Townsend St, San Francisco, CA',
    department: 'Operations',
    designation: 'Supply Chain Coordinator',
    joining_date: '2023-09-18',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 6500,
    profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Ana Silva',
    emergency_phone: '+1 (555) 332-1100',
    created_at: '2023-09-18T08:00:00Z',
    updated_at: '2023-09-18T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    profile_id: 'e0000000-0000-0000-0000-000000000007',
    employee_id: 'EMP-008',
    full_name: 'Aaliyah Khan',
    email: 'aaliyah.khan@dayflow.io',
    phone: '+1 (555) 901-2345',
    gender: 'Female',
    date_of_birth: '1997-03-14',
    address: '225 Bush Street, San Francisco, CA',
    department: 'Engineering',
    designation: 'UI/UX Product Designer',
    joining_date: '2024-02-01',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 8100,
    profile_image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Zayn Khan',
    emergency_phone: '+1 (555) 221-9988',
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000009',
    profile_id: 'e0000000-0000-0000-0000-000000000008',
    employee_id: 'EMP-009',
    full_name: 'James Wilson',
    email: 'james.wilson@dayflow.io',
    phone: '+1 (555) 012-3456',
    gender: 'Male',
    date_of_birth: '1992-07-22',
    address: '910 Battery St, San Francisco, CA',
    department: 'Finance',
    designation: 'Payroll & Tax Accountant',
    joining_date: '2022-10-10',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 7800,
    profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Emma Wilson',
    emergency_phone: '+1 (555) 110-4433',
    created_at: '2022-10-10T08:00:00Z',
    updated_at: '2022-10-10T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000010',
    profile_id: 'e0000000-0000-0000-0000-000000000009',
    employee_id: 'EMP-010',
    full_name: 'Clara Oswald',
    email: 'clara.oswald@dayflow.io',
    phone: '+1 (555) 123-4567',
    gender: 'Female',
    date_of_birth: '1998-05-11',
    address: '450 Sutter St, San Francisco, CA',
    department: 'Marketing',
    designation: 'Digital Content Strategist',
    joining_date: '2024-05-15',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 6200,
    profile_image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Danny Pink',
    emergency_phone: '+1 (555) 998-7766',
    created_at: '2024-05-15T08:00:00Z',
    updated_at: '2024-05-15T08:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000011',
    profile_id: 'e0000000-0000-0000-0000-000000000010',
    employee_id: 'EMP-011',
    full_name: 'Tariq Mansoor',
    email: 'tariq.mansoor@dayflow.io',
    phone: '+1 (555) 234-8901',
    gender: 'Male',
    date_of_birth: '1991-10-05',
    address: '601 Van Ness Ave, San Francisco, CA',
    department: 'Operations',
    designation: 'Facilities & Safety Manager',
    joining_date: '2023-07-01',
    employment_type: 'FULL_TIME',
    status: 'ACTIVE',
    role: 'EMPLOYEE',
    base_salary: 7500,
    profile_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    emergency_contact: 'Farah Mansoor',
    emergency_phone: '+1 (555) 887-1122',
    created_at: '2023-07-01T08:00:00Z',
    updated_at: '2023-07-01T08:00:00Z',
  }
];

const todayDate = new Date().toISOString().split('T')[0];
const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];

const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'att-001',
    employee_id: 'b0000000-0000-0000-0000-000000000001',
    date: todayDate,
    check_in: `${todayDate}T08:45:00.000Z`,
    check_out: `${todayDate}T17:30:00.000Z`,
    working_hours: 8.75,
    status: 'PRESENT',
    notes: 'On time - Admin duties',
    created_at: `${todayDate}T08:45:00.000Z`,
    updated_at: `${todayDate}T17:30:00.000Z`,
  },
  {
    id: 'att-002',
    employee_id: 'b0000000-0000-0000-0000-000000000002',
    date: todayDate,
    check_in: `${todayDate}T09:02:00.000Z`,
    check_out: null,
    working_hours: 0,
    status: 'PRESENT',
    notes: 'Currently working on sprint backlog',
    created_at: `${todayDate}T09:02:00.000Z`,
    updated_at: `${todayDate}T09:02:00.000Z`,
  },
  {
    id: 'att-003',
    employee_id: 'b0000000-0000-0000-0000-000000000003',
    date: todayDate,
    check_in: `${todayDate}T08:30:00.000Z`,
    check_out: `${todayDate}T17:00:00.000Z`,
    working_hours: 8.5,
    status: 'PRESENT',
    notes: 'Infrastructure deployment',
    created_at: `${todayDate}T08:30:00.000Z`,
    updated_at: `${todayDate}T17:00:00.000Z`,
  },
  {
    id: 'att-004',
    employee_id: 'b0000000-0000-0000-0000-000000000004',
    date: todayDate,
    check_in: null,
    check_out: null,
    working_hours: 0,
    status: 'LEAVE',
    notes: 'Approved Annual Vacation Leave',
    created_at: `${todayDate}T00:00:00.000Z`,
    updated_at: `${todayDate}T00:00:00.000Z`,
  },
  {
    id: 'att-005',
    employee_id: 'b0000000-0000-0000-0000-000000000005',
    date: todayDate,
    check_in: `${todayDate}T09:45:00.000Z`,
    check_out: `${todayDate}T18:15:00.000Z`,
    working_hours: 8.5,
    status: 'LATE',
    notes: 'Traffic delay - notified lead',
    created_at: `${todayDate}T09:45:00.000Z`,
    updated_at: `${todayDate}T18:15:00.000Z`,
  },
  {
    id: 'att-006',
    employee_id: 'b0000000-0000-0000-0000-000000000006',
    date: todayDate,
    check_in: `${todayDate}T08:55:00.000Z`,
    check_out: `${todayDate}T17:10:00.000Z`,
    working_hours: 8.25,
    status: 'PRESENT',
    notes: 'HR onboarding review',
    created_at: `${todayDate}T08:55:00.000Z`,
    updated_at: `${todayDate}T17:10:00.000Z`,
  },
  {
    id: 'att-007',
    employee_id: 'b0000000-0000-0000-0000-000000000007',
    date: todayDate,
    check_in: `${todayDate}T08:50:00.000Z`,
    check_out: `${todayDate}T13:00:00.000Z`,
    working_hours: 4.16,
    status: 'HALF_DAY',
    notes: 'Doctor appointment',
    created_at: `${todayDate}T08:50:00.000Z`,
    updated_at: `${todayDate}T13:00:00.000Z`,
  },
  {
    id: 'att-008',
    employee_id: 'b0000000-0000-0000-0000-000000000008',
    date: todayDate,
    check_in: `${todayDate}T09:10:00.000Z`,
    check_out: null,
    working_hours: 0,
    status: 'PRESENT',
    notes: 'Design workshop',
    created_at: `${todayDate}T09:10:00.000Z`,
    updated_at: `${todayDate}T09:10:00.000Z`,
  },
  {
    id: 'att-009',
    employee_id: 'b0000000-0000-0000-0000-000000000009',
    date: todayDate,
    check_in: `${todayDate}T08:40:00.000Z`,
    check_out: `${todayDate}T17:05:00.000Z`,
    working_hours: 8.41,
    status: 'PRESENT',
    notes: 'Payroll audit',
    created_at: `${todayDate}T08:40:00.000Z`,
    updated_at: `${todayDate}T17:05:00.000Z`,
  },
  {
    id: 'att-010',
    employee_id: 'b0000000-0000-0000-0000-000000000010',
    date: todayDate,
    check_in: null,
    check_out: null,
    working_hours: 0,
    status: 'ABSENT',
    notes: 'Unplanned absence',
    created_at: `${todayDate}T00:00:00.000Z`,
    updated_at: `${todayDate}T00:00:00.000Z`,
  },
  {
    id: 'att-011',
    employee_id: 'b0000000-0000-0000-0000-000000000011',
    date: todayDate,
    check_in: `${todayDate}T08:50:00.000Z`,
    check_out: `${todayDate}T17:15:00.000Z`,
    working_hours: 8.41,
    status: 'PRESENT',
    notes: 'Facility maintenance',
    created_at: `${todayDate}T08:50:00.000Z`,
    updated_at: `${todayDate}T17:15:00.000Z`,
  },
  // Yesterday's Records
  {
    id: 'att-y-001',
    employee_id: 'b0000000-0000-0000-0000-000000000002',
    date: yesterdayDate,
    check_in: `${yesterdayDate}T08:58:00.000Z`,
    check_out: `${yesterdayDate}T17:35:00.000Z`,
    working_hours: 8.61,
    status: 'PRESENT',
    notes: 'Code reviews',
    created_at: `${yesterdayDate}T08:58:00.000Z`,
    updated_at: `${yesterdayDate}T17:35:00.000Z`,
  }
];

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    employee_id: 'b0000000-0000-0000-0000-000000000004',
    leave_type: 'PAID_LEAVE',
    start_date: todayDate,
    end_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    number_of_days: 5,
    reason: 'Annual family holiday and rejuvenation trip',
    status: 'APPROVED',
    admin_comment: 'Enjoy your vacation Elena! Backup assigned to James.',
    reviewed_by: 'a0000000-0000-0000-0000-000000000001',
    reviewed_by_name: 'Sarah Jenkins',
    reviewed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    employee_id: 'b0000000-0000-0000-0000-000000000002',
    leave_type: 'SICK_LEAVE',
    start_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    number_of_days: 2,
    reason: 'Scheduled dental extraction and recovery time',
    status: 'PENDING',
    admin_comment: null,
    reviewed_by: null,
    reviewed_by_name: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    employee_id: 'b0000000-0000-0000-0000-000000000008',
    leave_type: 'PAID_LEAVE',
    start_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
    number_of_days: 3,
    reason: 'Attending Figma Config Design Conference',
    status: 'PENDING',
    admin_comment: null,
    reviewed_by: null,
    reviewed_by_name: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    employee_id: 'b0000000-0000-0000-0000-000000000005',
    leave_type: 'CASUAL_LEAVE',
    start_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    number_of_days: 1,
    reason: 'Attending family anniversary event',
    status: 'PENDING',
    admin_comment: null,
    reviewed_by: null,
    reviewed_by_name: null,
    reviewed_at: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    employee_id: 'b0000000-0000-0000-0000-000000000007',
    leave_type: 'UNPAID_LEAVE',
    start_date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0],
    end_date: new Date(Date.now() - 86400000 * 14).toISOString().split('T')[0],
    number_of_days: 2,
    reason: 'Personal vehicle transport relocation',
    status: 'REJECTED',
    admin_comment: 'Critical supply chain deadline during this exact window.',
    reviewed_by: 'a0000000-0000-0000-0000-000000000001',
    reviewed_by_name: 'Sarah Jenkins',
    reviewed_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 17).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 16).toISOString(),
  }
];

const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    employee_id: 'b0000000-0000-0000-0000-000000000001',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 12500,
    allowances: 1500,
    bonuses: 1000,
    deductions: 450,
    tax: 2200,
    gross_salary: 15000,
    net_salary: 12350,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Executive Monthly Compensation',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    employee_id: 'b0000000-0000-0000-0000-000000000002',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 9800,
    allowances: 800,
    bonuses: 500,
    deductions: 320,
    tax: 1650,
    gross_salary: 11100,
    net_salary: 9130,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Includes Q3 code sprint performance bonus',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    employee_id: 'b0000000-0000-0000-0000-000000000003',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 10500,
    allowances: 900,
    bonuses: 750,
    deductions: 350,
    tax: 1850,
    gross_salary: 12150,
    net_salary: 9950,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Includes cloud infrastructure uptime allowance',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    employee_id: 'b0000000-0000-0000-0000-000000000004',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 8400,
    allowances: 600,
    bonuses: 300,
    deductions: 250,
    tax: 1350,
    gross_salary: 9300,
    net_salary: 7700,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Monthly finance officer compensation',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    employee_id: 'b0000000-0000-0000-0000-000000000005',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 9200,
    allowances: 700,
    bonuses: 600,
    deductions: 280,
    tax: 1500,
    gross_salary: 10500,
    net_salary: 8720,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Product launch campaign reward',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    employee_id: 'b0000000-0000-0000-0000-000000000006',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 7200,
    allowances: 500,
    bonuses: 250,
    deductions: 200,
    tax: 1100,
    gross_salary: 7950,
    net_salary: 6650,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Standard HR operations compensation',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000007',
    employee_id: 'b0000000-0000-0000-0000-000000000007',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 6500,
    allowances: 450,
    bonuses: 200,
    deductions: 180,
    tax: 950,
    gross_salary: 7150,
    net_salary: 6020,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Operations baseline compensation',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000008',
    employee_id: 'b0000000-0000-0000-0000-000000000008',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 8100,
    allowances: 600,
    bonuses: 400,
    deductions: 240,
    tax: 1280,
    gross_salary: 9100,
    net_salary: 7580,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Design milestone bonus included',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000009',
    employee_id: 'b0000000-0000-0000-0000-000000000009',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 7800,
    allowances: 550,
    bonuses: 300,
    deductions: 220,
    tax: 1200,
    gross_salary: 8650,
    net_salary: 7230,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Tax compliance bonus added',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000010',
    employee_id: 'b0000000-0000-0000-0000-000000000010',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 6200,
    allowances: 400,
    bonuses: 150,
    deductions: 170,
    tax: 890,
    gross_salary: 6750,
    net_salary: 5690,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Marketing content creation compensation',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000011',
    employee_id: 'b0000000-0000-0000-0000-000000000011',
    pay_period_month: 'August',
    pay_period_year: 2026,
    basic_salary: 7500,
    allowances: 500,
    bonuses: 300,
    deductions: 210,
    tax: 1150,
    gross_salary: 8300,
    net_salary: 6940,
    payment_status: 'PAID',
    payment_date: todayDate,
    payment_method: 'Direct Bank Deposit',
    notes: 'Facility safety certification bonus',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'New Leave Request Received',
    message: 'Alex Morgan submitted a Sick Leave request for 2 days.',
    type: 'leave',
    is_read: false,
    link: '/admin/leave',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'notif-002',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'New Leave Request Received',
    message: 'Aaliyah Khan submitted a Paid Leave request for 3 days.',
    type: 'leave',
    is_read: false,
    link: '/admin/leave',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'notif-003',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    title: 'August Payroll Processed',
    message: 'August 2026 payroll records generated for all active workforce members.',
    type: 'payroll',
    is_read: true,
    link: '/admin/payroll',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-004',
    user_id: 'e0000000-0000-0000-0000-000000000001',
    title: 'August 2026 Payslip Available',
    message: 'Your August 2026 payslip has been finalized and processed.',
    type: 'payroll',
    is_read: false,
    link: '/employee/payroll',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'notif-005',
    user_id: 'e0000000-0000-0000-0000-000000000001',
    title: 'Attendance Check-in Confirmed',
    message: 'You checked in successfully today at 09:02 AM.',
    type: 'attendance',
    is_read: true,
    link: '/employee/attendance',
    created_at: `${todayDate}T09:02:00.000Z`,
  }
];

class LocalDatabaseEngine {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;

    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(INITIAL_LEAVE_REQUESTS));
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.initDatabase();
    window.location.reload();
  }

  // --- Profiles Table ---
  public getProfiles(): Profile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  }

  public getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  public saveProfile(profile: Profile): Profile {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push({ ...profile, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    return profile;
  }

  // --- Employees Table ---
  public getEmployees(): Employee[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      return data ? JSON.parse(data) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.getEmployees().find(e => e.id === id);
  }

  public getEmployeeByEmail(email: string): Employee | undefined {
    return this.getEmployees().find(e => e.email.toLowerCase() === email.toLowerCase());
  }

  public getEmployeeByProfileId(profileId: string): Employee | undefined {
    return this.getEmployees().find(e => e.profile_id === profileId);
  }

  public saveEmployee(employee: Partial<Employee> & { full_name: string; email: string; department: string; designation: string }): Employee {
    const employees = this.getEmployees();
    const now = new Date().toISOString();
    
    if (employee.id) {
      const index = employees.findIndex(e => e.id === employee.id);
      if (index >= 0) {
        employees[index] = {
          ...employees[index],
          ...employee,
          updated_at: now
        } as Employee;
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
        return employees[index];
      }
    }

    // Auto-generate employee_id if missing
    const empCount = employees.length + 1;
    const employeeIdCode = employee.employee_id || `EMP-${String(empCount).padStart(3, '0')}`;

    const newEmployee: Employee = {
      id: employee.id || `emp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      profile_id: employee.profile_id,
      employee_id: employeeIdCode,
      full_name: employee.full_name,
      email: employee.email,
      phone: employee.phone || '+1 (555) 000-0000',
      gender: employee.gender || 'Other',
      date_of_birth: employee.date_of_birth || '1995-01-01',
      address: employee.address || 'San Francisco, CA',
      department: employee.department,
      designation: employee.designation,
      joining_date: employee.joining_date || new Date().toISOString().split('T')[0],
      employment_type: employee.employment_type || 'FULL_TIME',
      status: employee.status || 'ACTIVE',
      role: employee.role || 'EMPLOYEE',
      base_salary: Number(employee.base_salary) || 6000,
      profile_image: employee.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      emergency_contact: employee.emergency_contact || 'Contact',
      emergency_phone: employee.emergency_phone || '+1 (555) 123-4567',
      created_at: now,
      updated_at: now
    };

    employees.unshift(newEmployee);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    return newEmployee;
  }

  public deleteEmployee(id: string): boolean {
    const employees = this.getEmployees();
    const filtered = employees.filter(e => e.id !== id);
    if (filtered.length !== employees.length) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(filtered));
      return true;
    }
    return false;
  }

  // --- Attendance Table ---
  public getAttendance(): Attendance[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      const records: Attendance[] = data ? JSON.parse(data) : INITIAL_ATTENDANCE;
      const employees = this.getEmployees();
      
      // Populate employee relation
      return records.map(record => ({
        ...record,
        employee: employees.find(e => e.id === record.employee_id)
      }));
    } catch {
      return INITIAL_ATTENDANCE;
    }
  }

  public getAttendanceForEmployee(employeeId: string): Attendance[] {
    return this.getAttendance().filter(a => a.employee_id === employeeId);
  }

  public getTodayAttendance(employeeId: string, dateStr: string = new Date().toISOString().split('T')[0]): Attendance | undefined {
    return this.getAttendance().find(a => a.employee_id === employeeId && a.date === dateStr);
  }

  public recordCheckIn(employeeId: string, notes?: string): Attendance {
    const records = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const existingIndex = records.findIndex(r => r.employee_id === employeeId && r.date === today);
    if (existingIndex >= 0) {
      if (records[existingIndex].check_in) {
        throw new Error('You have already checked in for today!');
      }
      records[existingIndex].check_in = now;
      records[existingIndex].status = 'PRESENT';
      records[existingIndex].updated_at = now;
      if (notes) records[existingIndex].notes = notes;
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
      return records[existingIndex];
    }

    const newRecord: Attendance = {
      id: `att-${Date.now()}`,
      employee_id: employeeId,
      date: today,
      check_in: now,
      check_out: null,
      working_hours: 0,
      status: 'PRESENT',
      notes: notes || 'Web check-in',
      created_at: now,
      updated_at: now,
    };

    records.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return newRecord;
  }

  public recordCheckOut(employeeId: string): Attendance {
    const records = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const existingIndex = records.findIndex(r => r.employee_id === employeeId && r.date === today);
    if (existingIndex < 0 || !records[existingIndex].check_in) {
      throw new Error('Cannot check out without checking in first!');
    }

    if (records[existingIndex].check_out) {
      throw new Error('You have already checked out for today!');
    }

    const checkInTime = new Date(records[existingIndex].check_in!).getTime();
    const checkOutTime = new Date(now).getTime();
    const hours = Math.max(0.1, Number(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2)));

    records[existingIndex].check_out = now;
    records[existingIndex].working_hours = hours;
    records[existingIndex].updated_at = now;

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return records[existingIndex];
  }

  // --- Leave Requests Table ---
  public getLeaveRequests(): LeaveRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
      const requests: LeaveRequest[] = data ? JSON.parse(data) : INITIAL_LEAVE_REQUESTS;
      const employees = this.getEmployees();

      return requests.map(req => ({
        ...req,
        employee: employees.find(e => e.id === req.employee_id)
      }));
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  }

  public getLeaveRequestsForEmployee(employeeId: string): LeaveRequest[] {
    return this.getLeaveRequests().filter(l => l.employee_id === employeeId);
  }

  public submitLeaveRequest(request: Omit<LeaveRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): LeaveRequest {
    const requests = this.getLeaveRequests();
    
    // Check overlapping requests
    const employeeExisting = requests.filter(r => r.employee_id === request.employee_id && r.status !== 'REJECTED' && r.status !== 'CANCELLED');
    const hasOverlap = employeeExisting.some(r => {
      return (request.start_date <= r.end_date && request.end_date >= r.start_date);
    });

    if (hasOverlap) {
      throw new Error('You already have an active leave request overlapping these dates.');
    }

    const newRequest: LeaveRequest = {
      ...request,
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      status: 'PENDING',
      admin_comment: null,
      reviewed_by: null,
      reviewed_by_name: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));

    // Create notification for admin
    this.createNotification({
      user_id: 'a0000000-0000-0000-0000-000000000001',
      title: 'New Leave Request Received',
      message: `${request.employee?.full_name || 'An employee'} submitted a ${request.leave_type.replace('_', ' ')} request for ${request.number_of_days} days.`,
      type: 'leave',
      link: '/admin/leave',
    });

    return newRequest;
  }

  public updateLeaveStatus(requestId: string, status: 'APPROVED' | 'REJECTED', adminComment?: string, reviewerName: string = 'Sarah Jenkins (Admin)'): LeaveRequest {
    const requests = this.getLeaveRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index < 0) throw new Error('Leave request not found');

    const now = new Date().toISOString();
    requests[index].status = status;
    requests[index].admin_comment = adminComment || (status === 'APPROVED' ? 'Approved by Admin' : 'Rejected by Admin');
    requests[index].reviewed_by = 'a0000000-0000-0000-0000-000000000001';
    requests[index].reviewed_by_name = reviewerName;
    requests[index].reviewed_at = now;
    requests[index].updated_at = now;

    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));

    // Send notification to employee's profile
    const targetEmployee = this.getEmployeeById(requests[index].employee_id);
    if (targetEmployee && targetEmployee.profile_id) {
      this.createNotification({
        user_id: targetEmployee.profile_id,
        title: `Leave Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        message: `Your ${requests[index].leave_type.replace('_', ' ')} from ${requests[index].start_date} to ${requests[index].end_date} has been ${status.toLowerCase()}. ${adminComment ? `Note: "${adminComment}"` : ''}`,
        type: 'leave',
        link: '/employee/leave',
      });
    }

    return requests[index];
  }

  // --- Payroll Table ---
  public getPayroll(): PayrollRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYROLL);
      const records: PayrollRecord[] = data ? JSON.parse(data) : INITIAL_PAYROLL;
      const employees = this.getEmployees();

      return records.map(p => ({
        ...p,
        employee: employees.find(e => e.id === p.employee_id)
      }));
    } catch {
      return INITIAL_PAYROLL;
    }
  }

  public getPayrollForEmployee(employeeId: string): PayrollRecord[] {
    return this.getPayroll().filter(p => p.employee_id === employeeId);
  }

  public savePayrollRecord(record: Partial<PayrollRecord> & { employee_id: string; pay_period_month: string; pay_period_year: number; basic_salary: number }): PayrollRecord {
    const payrolls = this.getPayroll();
    const basic = Number(record.basic_salary) || 0;
    const allowances = Number(record.allowances) || 0;
    const bonuses = Number(record.bonuses) || 0;
    const deductions = Number(record.deductions) || 0;
    const tax = Number(record.tax) || 0;

    const gross = basic + allowances + bonuses;
    const net = gross - deductions - tax;
    const now = new Date().toISOString();

    if (record.id) {
      const index = payrolls.findIndex(p => p.id === record.id);
      if (index >= 0) {
        payrolls[index] = {
          ...payrolls[index],
          ...record,
          gross_salary: gross,
          net_salary: net,
          updated_at: now,
        } as PayrollRecord;
        localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrolls));
        return payrolls[index];
      }
    }

    const newRecord: PayrollRecord = {
      id: record.id || `pay-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      employee_id: record.employee_id,
      pay_period_month: record.pay_period_month,
      pay_period_year: record.pay_period_year,
      basic_salary: basic,
      allowances: allowances,
      bonuses: bonuses,
      deductions: deductions,
      tax: tax,
      gross_salary: gross,
      net_salary: net,
      payment_status: record.payment_status || 'PAID',
      payment_date: record.payment_date || new Date().toISOString().split('T')[0],
      payment_method: record.payment_method || 'Direct Bank Deposit',
      notes: record.notes || 'Monthly Salary Record',
      created_at: now,
      updated_at: now,
    };

    payrolls.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrolls));
    return newRecord;
  }

  // --- Notifications Table ---
  public getNotifications(userId: string): Notification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const notifications: Notification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      return notifications.filter(n => n.user_id === userId);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  public markNotificationAsRead(id: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: Notification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    const index = notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      notifications[index].is_read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: Notification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  public createNotification(notif: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Notification {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: Notification[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return newNotif;
  }

  public resetToSeedData(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(INITIAL_PROFILES));
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(INITIAL_EMPLOYEES));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(INITIAL_LEAVE_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(INITIAL_PAYROLL));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }
}

export const localDb = new LocalDatabaseEngine();
