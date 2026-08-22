import { localDb } from '../lib/supabase';
import type { Profile } from '../types';

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; query: string }[];
}

export const aiAssistantService = {
  async askAssistant(query: string, currentUser: Profile): Promise<string> {
    const q = query.toLowerCase().trim();
    const isAdmin = currentUser.role === 'ADMIN';

    // Role-based authorization & data isolation
    const employees = localDb.getEmployees();
    const attendance = localDb.getAttendance();
    const leaveRequests = localDb.getLeaveRequests();
    const payroll = localDb.getPayroll();
    const today = new Date().toISOString().split('T')[0];

    // Try backend proxy if available
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          role: currentUser.role,
          userId: currentUser.id,
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          return data.reply;
        }
      }
    } catch {
      // Fall through to deterministic authorized AI NLP engine
    }

    // 1. Leave Queries
    if (q.includes('leave') && (q.includes('how many') || q.includes('who') || q.includes('pending') || q.includes('on leave'))) {
      if (isAdmin) {
        const todayOnLeave = attendance.filter(a => a.date === today && a.status === 'LEAVE');
        const pendingLeaves = leaveRequests.filter(r => r.status === 'PENDING');

        if (q.includes('pending')) {
          if (pendingLeaves.length === 0) {
            return `There are currently no pending leave requests in the queue.`;
          }
          const list = pendingLeaves.map(r => `• **${r.employee?.full_name || 'Employee'}**: ${r.leave_type.replace('_', ' ')} (${r.number_of_days} days, starting ${r.start_date})`).join('\n');
          return `There are **${pendingLeaves.length} pending leave request(s)** awaiting administrative review:\n\n${list}\n\nYou can approve or reject them directly from the Leave Management tab.`;
        }

        if (q.includes('on leave') || q.includes('who is on leave')) {
          if (todayOnLeave.length === 0) {
            return `No employees are recorded on leave today (${today}).`;
          }
          const names = todayOnLeave.map(a => `• **${a.employee?.full_name}** (${a.employee?.department})`).join('\n');
          return `There are **${todayOnLeave.length} employee(s) on leave today**:\n\n${names}`;
        }
      } else {
        // Employee role query
        const myEmp = localDb.getEmployeeByProfileId(currentUser.id) || localDb.getEmployeeByEmail(currentUser.email);
        if (!myEmp) return `Could not locate your employee profile.`;
        const myPending = leaveRequests.filter(r => r.employee_id === myEmp.id && r.status === 'PENDING');
        const myApproved = leaveRequests.filter(r => r.employee_id === myEmp.id && r.status === 'APPROVED');
        return `You have **${myPending.length} pending** leave request(s) and **${myApproved.length} approved** leave record(s) this year.`;
      }
    }

    // 2. Attendance & Absenteeism Queries
    if (q.includes('absent') || q.includes('attendance') || q.includes('present') || q.includes('checked in')) {
      if (isAdmin) {
        const todayRecords = attendance.filter(a => a.date === today);
        const presentCount = todayRecords.filter(a => a.status === 'PRESENT' || a.status === 'LATE' || a.status === 'HALF_DAY').length;
        const totalActive = employees.filter(e => e.status === 'ACTIVE').length;
        const absentCount = todayRecords.filter(a => a.status === 'ABSENT').length;
        const attendanceRate = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 0;

        if (q.includes('absent') || q.includes('who is absent')) {
          const absentRecords = todayRecords.filter(a => a.status === 'ABSENT');
          if (absentRecords.length === 0) {
            return `Great news! There are no unexcused absences recorded for today.`;
          }
          const names = absentRecords.map(a => `• **${a.employee?.full_name}** (${a.employee?.department}) - Status: ${a.notes || 'Absent'}`).join('\n');
          return `There is **${absentRecords.length} employee absent today**:\n\n${names}`;
        }

        if (q.includes('percentage') || q.includes('rate') || q.includes('how many present')) {
          return `Today's workforce attendance rate is **${attendanceRate}%** (${presentCount} out of ${totalActive} active team members present or checked in).`;
        }

        return `Workforce summary for **${today}**:\n• Total Active: **${totalActive}**\n• Present / Checked In: **${presentCount}**\n• Attendance Rate: **${attendanceRate}%**\n• Absent: **${absentCount}**`;
      } else {
        const myEmp = localDb.getEmployeeByProfileId(currentUser.id) || localDb.getEmployeeByEmail(currentUser.email);
        if (!myEmp) return `Could not locate your employee profile.`;
        const myToday = localDb.getTodayAttendance(myEmp.id, today);
        if (myToday && myToday.check_in) {
          return `You are checked in today! Check-in time: **${new Date(myToday.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}**. Status: **${myToday.status}**.`;
        }
        return `You have not checked in yet today. Head over to your dashboard or the Attendance page to check in.`;
      }
    }

    // 3. Department Specific Queries
    if (q.includes('department') || q.includes('engineering') || q.includes('marketing') || q.includes('finance') || q.includes('operations') || q.includes('human resources') || q.includes('hr')) {
      if (!isAdmin) {
        return `As an employee, you can view your own department team on your dashboard.`;
      }
      let targetDept = 'Engineering';
      if (q.includes('marketing')) targetDept = 'Marketing';
      else if (q.includes('finance')) targetDept = 'Finance';
      else if (q.includes('operations')) targetDept = 'Operations';
      else if (q.includes('human resources') || q.includes('hr')) targetDept = 'Human Resources';

      const deptEmployees = employees.filter(e => e.department.toLowerCase() === targetDept.toLowerCase());
      const list = deptEmployees.map(e => `• **${e.full_name}** (${e.employee_id}) - ${e.designation} [${e.status}]`).join('\n');

      return `There are **${deptEmployees.length} team members in ${targetDept}**:\n\n${list}`;
    }

    // 4. Payroll Queries
    if (q.includes('payroll') || q.includes('salary') || q.includes('payslip')) {
      if (isAdmin) {
        const augPayrolls = payroll.filter(p => p.pay_period_month === 'August' && p.pay_period_year === 2026);
        const totalNet = augPayrolls.reduce((sum, p) => sum + p.net_salary, 0);
        return `August 2026 payroll summary:\n• Records Processed: **${augPayrolls.length}**\n• Total Net Disbursed: **$${totalNet.toLocaleString()}**\n• Payment Status: **All Paid via Direct Bank Deposit**`;
      } else {
        const myEmp = localDb.getEmployeeByProfileId(currentUser.id) || localDb.getEmployeeByEmail(currentUser.email);
        if (!myEmp) return `Could not locate your employee profile.`;
        const myPayslips = payroll.filter(p => p.employee_id === myEmp.id);
        if (myPayslips.length > 0) {
          const latest = myPayslips[0];
          return `Your latest payslip for **${latest.pay_period_month} ${latest.pay_period_year}** is processed:\n• Gross Salary: **$${latest.gross_salary.toLocaleString()}**\n• Net Salary: **$${latest.net_salary.toLocaleString()}**\n• Status: **${latest.payment_status}**\n\nYou can view and print the breakdown in the Payroll tab.`;
        }
        return `No payslip records found for your account yet.`;
      }
    }

    // General fallback assistance
    if (isAdmin) {
      return `Hello ${currentUser.full_name}! I am the **Dayflow HR Assistant**. I have live, authorized access to your workforce analytics. You can ask me:\n• *"How many employees are on leave today?"*\n• *"Who is absent today?"*\n• *"How many pending leave requests are there?"*\n• *"What is the attendance percentage?"*\n• *"Show me employees in Engineering."*\n• *"What is the August payroll summary?"*`;
    }

    return `Hello ${currentUser.full_name}! I am the **Dayflow HR Assistant**. You can ask me about:\n• Your today's check-in status\n• Your leave quota and balance\n• Your latest payslip details`;
  }
};
