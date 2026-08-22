<div align="center">

# 🕐 Dayflow HRMS

### *"Every workday, perfectly aligned."*

**A full-scale, database-driven Human Resource Management System**
built for the **Odoo Hackathon 2026**

Dayflow unifies employee management, attendance tracking, leave workflows, automated payroll, and an embedded AI HR Assistant — all inside one clean, modern SaaS web app.

</div>

---

## 📖 Table of Contents

- [Why Dayflow?](#-why-dayflow)
- [Feature Modules](#-feature-modules)
- [Demo Personas](#-demo-personas--quick-switcher)
- [Tech Stack](#️-architecture--tech-stack)
- [Getting Started](#-getting-started)
- [Team](#-team-contributors)

---

## ✨ Why Dayflow?

Most HR tools feel like spreadsheets wearing a UI. Dayflow doesn't.

It's built as a genuine **role-aware SaaS product** — Admins and Employees see fundamentally different experiences, powered by real-time state, a persistent local database engine (with full PostgreSQL/Supabase support), and an AI assistant that actually understands HR context instead of just answering generic prompts.

> 💡 **What makes it unique:** everything — attendance, leave, payroll, and AI chat — runs on the *same* live data engine, so a leave approval instantly reflects in payroll deductions and the AI assistant's answers, with zero manual syncing.

---

## 🌟 Feature Modules

<table>
<tr>
<td width="50%" valign="top">

### 👥 Workforce & Employee Management
- Searchable master directory, filterable by department & status
- Table view **and** visual profile card view
- Full CRUD with auto-generated IDs, avatars & emergency contacts
- Detailed employee dossier modal & dedicated pages
- 1-click CSV export

</td>
<td width="50%" valign="top">

### ⏱️ Real-Time Attendance Tracking
- Live check-in/check-out widget with running timer
- Grace-period engine — auto-flags late arrivals past 09:15 AM
- Admin daily register with department breakdowns
- Personal 7-day / 30-day / all-time history & averages

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🏖️ Leave Management & Approvals
- 4 leave types: Paid, Sick, Casual, Unpaid
- Live quota engine (18 Paid · 12 Sick · 8 Casual)
- Date-range picker with auto day-count
- Admin queue with quick approve/reject + comments
- Instant status-change notifications

</td>
<td width="50%" valign="top">

### 💳 Compensation & Automated Payroll
- 1-click monthly pay-run engine
- Auto-calculates tax, insurance & net take-home
- Printable/downloadable itemized payslips
- Manual bonus/overtime/tax adjustments
- Self-service employee pay archive

</td>
</tr>
</table>

### 🤖 AI HR Assistant — *Powered by Gemini*

An AI teammate that knows **who's asking**:

| As an Admin, ask it to... | As an Employee, ask it to... |
|---|---|
| 📊 Report team attendance rates | 🌴 Check your remaining leave balance |
| 📥 Summarize the pending leave backlog | 📅 List upcoming company holidays |
| 💰 Calculate this month's payroll total | 🕘 Explain working-hour policies |
| 📝 Draft an employee announcement | 🧾 Break down your latest payslip |

Quick-prompt chips make common questions one tap away.

---

## 🔑 Demo Personas & Quick Switcher

Try Dayflow instantly — no signup needed. Use the **1-click Persona Switcher** on the login page to jump between roles.

| Role | Name & Title | Email | Password |
|---|---|---|---|
| 🛡️ **Admin** | Sarah Jenkins · VP of People Operations | `admin@dayflow.io` | `admin123` |
| 👨‍💻 **Employee** | Alex Morgan · Lead Backend Architect | `alex.morgan@dayflow.io` | `employee123` |
| 📊 **Employee** | David Kim · Financial Controller | `david.kim@dayflow.io` | `employee123` |
| 🎯 **Employee** | Elena Rostova · HR Specialist | `elena.rostova@dayflow.io` | `employee123` |

---

## 🏗️ Architecture & Tech Stack

```
Frontend    →  React 19 · TypeScript · Vite · React Router (HashRouter)
Styling     →  Tailwind CSS v4 · Lucide Icons · Canvas Confetti
State       →  AuthContext (RBAC) · NotificationContext · ToastContext
Data Layer  →  PostgreSQL / Supabase  +  Persistent LocalDatabaseEngine
AI Layer    →  Gemini API — role-aware contextual responses
```

- **Dual-mode data engine** — plug into real PostgreSQL/Supabase (`supabase/schema.sql`, `supabase/seed.sql`) or run entirely offline on a built-in persistent engine pre-seeded with 11 realistic employees, attendance logs, leave records & payroll runs.
- **Reviewer Reset** tool under `Admin → Settings` restores the original seed data anytime — perfect for demos.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Verify types & build for production
npm run lint
npm run build
```

---

## 👨‍👩‍👧 Team Contributors

| Name | Role |
|---|---|
| **Shashank M** | Project Lead |
| **Sahana Nagesh Rao** | Team Member |
| **Satvik S P** | Team Member |

---

<div align="center">

Built with ❤️ for **Odoo Hackathon 2026**

</div>