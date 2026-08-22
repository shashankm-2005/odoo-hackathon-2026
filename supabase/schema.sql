-- =============================================================================
-- DAYFLOW HRMS - POSTGRESQL DATABASE SCHEMA
-- "Every workday, perfectly aligned."
-- Odoo Hackathon 2026 Solution
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employee_status AS ENUM ('ACTIVE', 'INACTIVE', 'PROBATION', 'TERMINATED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'LEAVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_type AS ENUM ('PAID_LEAVE', 'SICK_LEAVE', 'UNPAID_LEAVE', 'CASUAL_LEAVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PAID', 'PENDING', 'PROCESSING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- -----------------------------------------------------------------------------
-- 2. TABLES
-- -----------------------------------------------------------------------------

-- Profiles table (linked to auth.users in Supabase or standalone user accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'EMPLOYEE',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Employees table (Core workforce master data)
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    gender VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    employment_type employment_type NOT NULL DEFAULT 'FULL_TIME',
    status employee_status NOT NULL DEFAULT 'ACTIVE',
    role user_role NOT NULL DEFAULT 'EMPLOYEE',
    base_salary NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
    profile_image TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    working_hours NUMERIC(5, 2) DEFAULT 0.00,
    status attendance_status NOT NULL DEFAULT 'PRESENT',
    notes TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_daily_attendance UNIQUE(employee_id, date)
);

-- Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type leave_type NOT NULL DEFAULT 'PAID_LEAVE',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days INTEGER NOT NULL CHECK (number_of_days > 0),
    reason TEXT NOT NULL,
    status leave_status NOT NULL DEFAULT 'PENDING',
    admin_comment TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Payroll Records Table
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    pay_period_month VARCHAR(20) NOT NULL, -- e.g. "August 2026"
    pay_period_year INTEGER NOT NULL DEFAULT 2026,
    basic_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    allowances NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bonuses NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gross_salary NUMERIC(12, 2) GENERATED ALWAYS AS (basic_salary + allowances + bonuses) STORED,
    net_salary NUMERIC(12, 2) GENERATED ALWAYS AS (basic_salary + allowances + bonuses - deductions - tax) STORED,
    payment_status payment_status NOT NULL DEFAULT 'PAID',
    payment_date DATE,
    payment_method VARCHAR(50) DEFAULT 'Direct Bank Deposit',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_pay_period UNIQUE(employee_id, pay_period_month, pay_period_year)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info', -- info, success, warning, leave, payroll, attendance
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_employees_dept ON public.employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_emp_date ON public.attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_emp_status ON public.leave_requests(employee_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_emp_period ON public.payroll(employee_id, pay_period_year, pay_period_month);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- -----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE (auth_user_id = auth.uid() OR id = auth.uid())
        AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's employee_id
CREATE OR REPLACE FUNCTION public.get_current_employee_id()
RETURNS UUID AS $$
DECLARE
    emp_id UUID;
BEGIN
    SELECT e.id INTO emp_id
    FROM public.employees e
    JOIN public.profiles p ON e.profile_id = p.id
    WHERE p.auth_user_id = auth.uid() OR p.id = auth.uid();
    RETURN emp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Admins have full access to profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin() OR auth_user_id = auth.uid() OR id = auth.uid());

-- Employees Policies
CREATE POLICY "Admins can view and manage all employees"
    ON public.employees FOR ALL
    USING (public.is_admin());

CREATE POLICY "Employees can view their own employee record"
    ON public.employees FOR SELECT
    USING (id = public.get_current_employee_id());

CREATE POLICY "Employees can update limited personal info"
    ON public.employees FOR UPDATE
    USING (id = public.get_current_employee_id())
    WITH CHECK (id = public.get_current_employee_id());

-- Attendance Policies
CREATE POLICY "Admins have full access to attendance"
    ON public.attendance FOR ALL
    USING (public.is_admin());

CREATE POLICY "Employees can view own attendance"
    ON public.attendance FOR SELECT
    USING (employee_id = public.get_current_employee_id());

CREATE POLICY "Employees can record own attendance"
    ON public.attendance FOR INSERT
    WITH CHECK (employee_id = public.get_current_employee_id());

CREATE POLICY "Employees can check-out own attendance"
    ON public.attendance FOR UPDATE
    USING (employee_id = public.get_current_employee_id())
    WITH CHECK (employee_id = public.get_current_employee_id());

-- Leave Requests Policies
CREATE POLICY "Admins have full access to leave requests"
    ON public.leave_requests FOR ALL
    USING (public.is_admin());

CREATE POLICY "Employees can view own leave requests"
    ON public.leave_requests FOR SELECT
    USING (employee_id = public.get_current_employee_id());

CREATE POLICY "Employees can submit own leave requests"
    ON public.leave_requests FOR INSERT
    WITH CHECK (employee_id = public.get_current_employee_id());

-- Payroll Policies
CREATE POLICY "Admins have full access to payroll"
    ON public.payroll FOR ALL
    USING (public.is_admin());

CREATE POLICY "Employees have read-only access to own payslips"
    ON public.payroll FOR SELECT
    USING (employee_id = public.get_current_employee_id());

-- Notifications Policies
CREATE POLICY "Users can access their own notifications"
    ON public.notifications FOR ALL
    USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid() OR id = auth.uid()));
