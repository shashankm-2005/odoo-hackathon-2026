-- =============================================================================
-- DAYFLOW HRMS - SEED DATA
-- "Every workday, perfectly aligned."
-- =============================================================================

-- Clean existing data in reverse dependency order
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.payroll CASCADE;
TRUNCATE TABLE public.leave_requests CASCADE;
TRUNCATE TABLE public.attendance CASCADE;
TRUNCATE TABLE public.employees CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- -----------------------------------------------------------------------------
-- 1. PROFILES (Admin & Employee user accounts)
-- -----------------------------------------------------------------------------
INSERT INTO public.profiles (id, email, full_name, role, avatar_url) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@dayflow.io', 'Sarah Jenkins (Admin)', 'ADMIN', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000001', 'alex.morgan@dayflow.io', 'Alex Morgan', 'EMPLOYEE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000002', 'david.chen@dayflow.io', 'David Chen', 'EMPLOYEE', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000003', 'elena.rostova@dayflow.io', 'Elena Rostova', 'EMPLOYEE', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000004', 'marcus.vance@dayflow.io', 'Marcus Vance', 'EMPLOYEE', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000005', 'priya.sharma@dayflow.io', 'Priya Sharma', 'EMPLOYEE', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000006', 'lucas.silva@dayflow.io', 'Lucas Silva', 'EMPLOYEE', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000007', 'aaliyah.khan@dayflow.io', 'Aaliyah Khan', 'EMPLOYEE', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000008', 'james.wilson@dayflow.io', 'James Wilson', 'EMPLOYEE', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000009', 'clara.oswald@dayflow.io', 'Clara Oswald', 'EMPLOYEE', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'),
('e0000000-0000-0000-0000-000000000010', 'tariq.mansoor@dayflow.io', 'Tariq Mansoor', 'EMPLOYEE', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80');

-- -----------------------------------------------------------------------------
-- 2. EMPLOYEES
-- -----------------------------------------------------------------------------
INSERT INTO public.employees (
    id, profile_id, employee_id, full_name, email, phone, gender, date_of_birth,
    address, department, designation, joining_date, employment_type, status, role,
    base_salary, profile_image, emergency_contact, emergency_phone
) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'EMP-001', 'Sarah Jenkins', 'admin@dayflow.io', '+1 (555) 234-5678', 'Female', '1988-04-12', '742 Evergreen Terrace, Suite 100, San Francisco, CA', 'Human Resources', 'Chief People Officer', '2021-01-15', 'FULL_TIME', 'ACTIVE', 'ADMIN', 12500.00, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Michael Jenkins', '+1 (555) 998-1122'),
('b0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'EMP-002', 'Alex Morgan', 'alex.morgan@dayflow.io', '+1 (555) 345-6789', 'Female', '1993-08-23', '124 Market Street, Apt 4B, San Francisco, CA', 'Engineering', 'Senior Full Stack Engineer', '2022-03-01', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 9800.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Jessica Morgan', '+1 (555) 887-3344'),
('b0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000002', 'EMP-003', 'David Chen', 'david.chen@dayflow.io', '+1 (555) 456-7890', 'Male', '1990-11-15', '500 Howard Street, San Francisco, CA', 'Engineering', 'Lead DevOps Architect', '2021-08-10', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 10500.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Lisa Chen', '+1 (555) 776-5544'),
('b0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000003', 'EMP-004', 'Elena Rostova', 'elena.rostova@dayflow.io', '+1 (555) 567-8901', 'Female', '1995-02-19', '88 Mission Bay Blvd, San Francisco, CA', 'Finance', 'Senior Financial Analyst', '2023-01-09', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 8400.00, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', 'Igor Rostov', '+1 (555) 665-2211'),
('b0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000004', 'EMP-005', 'Marcus Vance', 'marcus.vance@dayflow.io', '+1 (555) 678-9012', 'Male', '1989-06-30', '320 Folsom Street, San Francisco, CA', 'Marketing', 'Head of Product Marketing', '2022-06-15', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 9200.00, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Valerie Vance', '+1 (555) 554-7788'),
('b0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000005', 'EMP-006', 'Priya Sharma', 'priya.sharma@dayflow.io', '+1 (555) 789-0123', 'Female', '1994-09-08', '415 10th Street, San Francisco, CA', 'Human Resources', 'HR Operations Specialist', '2023-04-03', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 7200.00, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', 'Raj Sharma', '+1 (555) 443-8899'),
('b0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000006', 'EMP-007', 'Lucas Silva', 'lucas.silva@dayflow.io', '+1 (555) 890-1234', 'Male', '1996-12-04', '180 Townsend St, San Francisco, CA', 'Operations', 'Supply Chain Coordinator', '2023-09-18', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 6500.00, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'Ana Silva', '+1 (555) 332-1100'),
('b0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000007', 'EMP-008', 'Aaliyah Khan', 'aaliyah.khan@dayflow.io', '+1 (555) 901-2345', 'Female', '1997-03-14', '225 Bush Street, San Francisco, CA', 'Engineering', 'UI/UX Product Designer', '2024-02-01', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 8100.00, 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', 'Zayn Khan', '+1 (555) 221-9988'),
('b0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000008', 'EMP-009', 'James Wilson', 'james.wilson@dayflow.io', '+1 (555) 012-3456', 'Male', '1992-07-22', '910 Battery St, San Francisco, CA', 'Finance', 'Payroll & Tax Accountant', '2022-10-10', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 7800.00, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 'Emma Wilson', '+1 (555) 110-4433'),
('b0000000-0000-0000-0000-000000000010', 'e0000000-0000-0000-0000-000000000009', 'EMP-010', 'Clara Oswald', 'clara.oswald@dayflow.io', '+1 (555) 123-4567', 'Female', '1998-05-11', '450 Sutter St, San Francisco, CA', 'Marketing', 'Digital Content Strategist', '2024-05-15', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 6200.00, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'Danny Pink', '+1 (555) 998-7766'),
('b0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000010', 'EMP-011', 'Tariq Mansoor', 'tariq.mansoor@dayflow.io', '+1 (555) 234-8901', 'Male', '1991-10-05', '601 Van Ness Ave, San Francisco, CA', 'Operations', 'Facilities & Safety Manager', '2023-07-01', 'FULL_TIME', 'ACTIVE', 'EMPLOYEE', 7500.00, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'Farah Mansoor', '+1 (555) 887-1122');

-- -----------------------------------------------------------------------------
-- 3. ATTENDANCE (Today & Recent Days)
-- -----------------------------------------------------------------------------
-- Today's attendance records (August 21, 2026)
INSERT INTO public.attendance (employee_id, date, check_in, check_out, working_hours, status, notes) VALUES
('b0000000-0000-0000-0000-000000000001', CURRENT_DATE, (CURRENT_DATE + TIME '08:45:00')::timestamptz, (CURRENT_DATE + TIME '17:30:00')::timestamptz, 8.75, 'PRESENT', 'On time - Admin duties'),
('b0000000-0000-0000-0000-000000000002', CURRENT_DATE, (CURRENT_DATE + TIME '09:02:00')::timestamptz, NULL, 0.00, 'PRESENT', 'Currently working on sprint backlog'),
('b0000000-0000-0000-0000-000000000003', CURRENT_DATE, (CURRENT_DATE + TIME '08:30:00')::timestamptz, (CURRENT_DATE + TIME '17:00:00')::timestamptz, 8.50, 'PRESENT', 'Infrastructure deployment'),
('b0000000-0000-0000-0000-000000000004', CURRENT_DATE, NULL, NULL, 0.00, 'LEAVE', 'Approved Annual Vacation Leave'),
('b0000000-0000-0000-0000-000000000005', CURRENT_DATE, (CURRENT_DATE + TIME '09:45:00')::timestamptz, (CURRENT_DATE + TIME '18:15:00')::timestamptz, 8.50, 'LATE', 'Traffic delay - notified lead'),
('b0000000-0000-0000-0000-000000000006', CURRENT_DATE, (CURRENT_DATE + TIME '08:55:00')::timestamptz, (CURRENT_DATE + TIME '17:10:00')::timestamptz, 8.25, 'PRESENT', 'HR onboarding review'),
('b0000000-0000-0000-0000-000000000007', CURRENT_DATE, (CURRENT_DATE + TIME '08:50:00')::timestamptz, (CURRENT_DATE + TIME '13:00:00')::timestamptz, 4.16, 'HALF_DAY', 'Half-day doctor consultation'),
('b0000000-0000-0000-0000-000000000008', CURRENT_DATE, (CURRENT_DATE + TIME '09:10:00')::timestamptz, NULL, 0.00, 'PRESENT', 'Design sprint workshop'),
('b0000000-0000-0000-0000-000000000009', CURRENT_DATE, (CURRENT_DATE + TIME '08:40:00')::timestamptz, (CURRENT_DATE + TIME '17:05:00')::timestamptz, 8.41, 'PRESENT', 'Monthly payroll reconciliation'),
('b0000000-0000-0000-0000-000000000010', CURRENT_DATE, NULL, NULL, 0.00, 'ABSENT', 'Unplanned absence - follow up'),
('b0000000-0000-0000-0000-000000000011', CURRENT_DATE, (CURRENT_DATE + TIME '08:50:00')::timestamptz, (CURRENT_DATE + TIME '17:15:00')::timestamptz, 8.41, 'PRESENT', 'Facility safety audits');

-- Historical attendance records (Yesterday)
INSERT INTO public.attendance (employee_id, date, check_in, check_out, working_hours, status, notes) VALUES
('b0000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:50:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:40:00')::timestamptz, 8.83, 'PRESENT', 'Management meetings'),
('b0000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:58:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:35:00')::timestamptz, 8.61, 'PRESENT', 'Code reviews and merges'),
('b0000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:35:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:15:00')::timestamptz, 8.66, 'PRESENT', 'Server maintenance'),
('b0000000-0000-0000-0000-000000000004', CURRENT_DATE - INTERVAL '1 day', NULL, NULL, 0.00, 'LEAVE', 'Approved Vacation'),
('b0000000-0000-0000-0000-000000000005', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '09:00:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:30:00')::timestamptz, 8.50, 'PRESENT', 'Campaign analysis'),
('b0000000-0000-0000-0000-000000000006', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:45:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:00:00')::timestamptz, 8.25, 'PRESENT', 'Candidate interviews'),
('b0000000-0000-0000-0000-000000000007', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:55:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:25:00')::timestamptz, 8.50, 'PRESENT', 'Inventory dispatch'),
('b0000000-0000-0000-0000-000000000008', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '09:05:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:45:00')::timestamptz, 8.66, 'PRESENT', 'Mobile design tokens'),
('b0000000-0000-0000-0000-000000000009', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:30:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:00:00')::timestamptz, 8.50, 'PRESENT', 'Quarterly financial audit'),
('b0000000-0000-0000-0000-000000000010', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '09:15:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:40:00')::timestamptz, 8.41, 'PRESENT', 'Blog publication'),
('b0000000-0000-0000-0000-000000000011', CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day' + TIME '08:50:00')::timestamptz, (CURRENT_DATE - INTERVAL '1 day' + TIME '17:10:00')::timestamptz, 8.33, 'PRESENT', 'Fire drill compliance');

-- -----------------------------------------------------------------------------
-- 4. LEAVE REQUESTS
-- -----------------------------------------------------------------------------
INSERT INTO public.leave_requests (
    id, employee_id, leave_type, start_date, end_date, number_of_days, reason,
    status, admin_comment, reviewed_by, reviewed_at
) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'PAID_LEAVE', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '2 days', 5, 'Annual family holiday trip', 'APPROVED', 'Enjoy your vacation Elena! Backup assigned to James.', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '3 days'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'SICK_LEAVE', CURRENT_DATE + INTERVAL '4 days', CURRENT_DATE + INTERVAL '5 days', 2, 'Scheduled minor dental procedure and recovery', 'PENDING', NULL, NULL, NULL),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000008', 'PAID_LEAVE', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 3, 'Attending Figma Config design conference in San Francisco', 'PENDING', NULL, NULL, NULL),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', 'CASUAL_LEAVE', CURRENT_DATE + INTERVAL '12 days', CURRENT_DATE + INTERVAL '12 days', 1, 'Attending family anniversary function', 'PENDING', NULL, NULL, NULL),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000007', 'UNPAID_LEAVE', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '14 days', 2, 'Personal vehicle relocation', 'REJECTED', 'Critical supply chain sprint deadline during this window.', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '16 days'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 'PAID_LEAVE', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '22 days', 4, 'Mid-year wellness rest and trekking', 'APPROVED', 'Approved by Sarah Jenkins.', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '27 days');

-- -----------------------------------------------------------------------------
-- 5. PAYROLL (August 2026 & July 2026)
-- -----------------------------------------------------------------------------
INSERT INTO public.payroll (
    id, employee_id, pay_period_month, pay_period_year, basic_salary, allowances, bonuses, deductions, tax, payment_status, payment_date, payment_method, notes
) VALUES
-- August 2026 (Current Cycle)
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'August', 2026, 12500.00, 1500.00, 1000.00, 450.00, 2200.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Executive Monthly Compensation'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'August', 2026, 9800.00, 800.00, 500.00, 320.00, 1650.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Includes Q3 code sprint performance bonus'),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'August', 2026, 10500.00, 900.00, 750.00, 350.00, 1850.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Includes cloud reliability allowance'),
('d0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'August', 2026, 8400.00, 600.00, 300.00, 250.00, 1350.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Monthly finance officer compensation'),
('d0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'August', 2026, 9200.00, 700.00, 600.00, 280.00, 1500.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Product launch campaign reward'),
('d0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'August', 2026, 7200.00, 500.00, 250.00, 200.00, 1100.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Standard HR salary tier'),
('d0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'August', 2026, 6500.00, 450.00, 200.00, 180.00, 950.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Operations baseline compensation'),
('d0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008', 'August', 2026, 8100.00, 600.00, 400.00, 240.00, 1280.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Design token milestone bonus included'),
('d0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000009', 'August', 2026, 7800.00, 550.00, 300.00, 220.00, 1200.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Tax compliance bonus added'),
('d0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000010', 'August', 2026, 6200.00, 400.00, 150.00, 170.00, 890.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Marketing content creation tier'),
('d0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000011', 'August', 2026, 7500.00, 500.00, 300.00, 210.00, 1150.00, 'PAID', CURRENT_DATE, 'Direct Bank Deposit', 'Facility health certification bonus'),

-- July 2026 (Previous Cycle)
('d0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'July', 2026, 9800.00, 800.00, 0.00, 320.00, 1550.00, 'PAID', '2026-07-31', 'Direct Bank Deposit', 'July Standard Payroll'),
('d0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000003', 'July', 2026, 10500.00, 900.00, 0.00, 350.00, 1720.00, 'PAID', '2026-07-31', 'Direct Bank Deposit', 'July Standard Payroll'),
('d0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000008', 'July', 2026, 8100.00, 600.00, 0.00, 240.00, 1200.00, 'PAID', '2026-07-31', 'Direct Bank Deposit', 'July Standard Payroll');

-- -----------------------------------------------------------------------------
-- 6. NOTIFICATIONS
-- -----------------------------------------------------------------------------
INSERT INTO public.notifications (user_id, title, message, type, is_read, link) VALUES
('a0000000-0000-0000-0000-000000000001', 'New Leave Request Received', 'Alex Morgan submitted a Sick Leave request for 2 days.', 'leave', false, '/admin/leave'),
('a0000000-0000-0000-0000-000000000001', 'New Leave Request Received', 'Aaliyah Khan submitted a Paid Leave request for 3 days.', 'leave', false, '/admin/leave'),
('a0000000-0000-0000-0000-000000000001', 'Payroll Cycle Processed', 'August 2026 payroll run has been finalized for all 11 active team members.', 'payroll', true, '/admin/payroll'),
('e0000000-0000-0000-0000-000000000001', 'August 2026 Payslip Available', 'Your August 2026 salary of $8,630.00 Net has been credited to your bank account.', 'payroll', false, '/employee/payroll'),
('e0000000-0000-0000-0000-000000000001', 'Attendance Logged', 'You checked in today at 09:02 AM. Have a productive workday!', 'attendance', true, '/employee/attendance'),
('e0000000-0000-0000-0000-000000000003', 'Leave Request Approved', 'Your Paid Leave request from August 19 to August 23 has been approved.', 'leave', true, '/employee/leave');
