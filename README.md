# Dayflow HRMS
> *"Every workday, perfectly aligned."*

A full-scale, database-driven Human Resource Management System built for the **Odoo Hackathon 2026**. Dayflow unifies employee management, daily attendance punch clocks, leave approval workflows, automated payroll execution, and an embedded AI HR Assistant into a clean, modern SaaS web application.

---

## 🌟 Key Functional Modules

### 1. 👥 Workforce & Employee Management
- **Master Directory**: Searchable, filterable by department (*Engineering, HR, Finance, Marketing, Operations*) and employment status (*Active, Probation, Inactive, Terminated*).
- **Dual View Modes**: Switch between high-density data tables and visual profile cards.
- **Full Employee CRUD**: Onboard new employees with ID auto-generation, profile avatars, designations, joining dates, base compensation, and emergency contacts.
- **Detailed Employee Dossier**: Modal and dedicated page views of master records.
- **CSV Data Export**: 1-click export of workforce directory.

### 2. ⏱️ Real-Time Attendance Tracking
- **Interactive Check-In / Check-Out Widget**: Real-time timer, work hours counter, shift note logger, and status tracking (*Present, Late, Half Day, Absent*).
- **Grace Period Engine**: Automatic late calculation for arrivals past 09:15 AM.
- **Admin Attendance Register**: Daily logs with date selector, department breakdown, attendance rates, and CSV reporting.
- **Personal History**: 7-day, 30-day, and all-time work hour history with average hours/shift metrics.

### 3. 🏖️ Leave Management & Approval Workflows
- **Leave Types**: Paid Annual Leave, Sick Leave, Casual Leave, and Unpaid Leave.
- **Balance & Quota Engine**: Real-time quota calculation (18 Paid, 12 Sick, 8 Casual) with remaining days countdowns.
- **Employee Application Flow**: Date-range picker, automatic day count computation, and justification inputs.
- **Admin Review Queue**: Pending leave queue with 1-click Quick Approve/Reject, detailed modal reviews, and supervisor feedback comments.
- **Instant Alerts**: Notifications dispatched to employees upon status resolution.

### 4. 💳 Compensation & Automated Payroll
- **Automated Pay Run**: 1-Click monthly payroll engine that calculates base pay, statutory health & insurance deductions, standard income taxes, and net take-home pay.
- **Payslip Generator & Viewer**: Official, printable/downloadable company payslip statements with itemized earnings and deductions.
- **Manual Adjustments**: Admin form to edit bonuses, overtime allowances, or tax withholdings.
- **Employee Pay Archive**: Self-service history of all disbursed payslips with net compensation summaries.

### 5. 🤖 AI HR Assistant (Powered by Gemini)
- **Role-Aware Context**: Contextual responses tailored to whether an Administrator or Employee is interacting.
- **Admin Capabilities**: Query team attendance rates, analyze pending leave backlogs, calculate monthly payroll totals, and draft employee announcements.
- **Employee Capabilities**: Inquire about remaining leave balances, company holidays, working hours policies, and payslip breakdowns.
- **Quick Prompts**: Pre-configured action chips for instant HR intelligence.

---

## 🔑 Demo Personas & Quick Switcher

Use the **1-Click Persona Switcher** on the Login page to instantly test both user roles:

| Role | Demo Email | Password | Name & Title |
|---|---|---|---|
| **Admin / HR Manager** | `admin@dayflow.io` | `admin123` | **Sarah Jenkins**, VP of People Operations |
| **Employee (Demo 1)** | `alex.morgan@dayflow.io` | `employee123` | **Alex Morgan**, Lead Backend Architect |
| **Employee (Demo 2)** | `david.kim@dayflow.io` | `employee123` | **David Kim**, Financial Controller |
| **Employee (Demo 3)** | `elena.rostova@dayflow.io` | `employee123` | **Elena Rostova**, HR Specialist |

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router (`HashRouter` for preview stability)
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **State & Contexts**:
  - `AuthContext`: Role-Based Access Control (`ADMIN` vs `EMPLOYEE`)
  - `NotificationContext`: Real-time notification stream with unread counters
  - `ToastContext`: Global animated toast notifications
- **Data Engine**:
  - Dual-mode architecture with **PostgreSQL / Supabase integration** (`supabase/schema.sql` and `supabase/seed.sql` provided).
  - Built-in **Persistent LocalDatabaseEngine** with pre-seeded data for 11 realistic employees, attendance logs, leave records, and payroll runs that persist across browser reloads.
  - Reviewer Reset tool in **Admin &rarr; Settings** to restore initial seed data at any time.

---

## 🚀 Running Locally
## Team Members

- Shashank Manjunath
- Satvik
- Sahana

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build & verify TypeScript
npm run lint
npm run build
```
