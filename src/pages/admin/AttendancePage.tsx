import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  CalendarOff,
  Users
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { StatCard } from '../../components/common/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import type { Attendance, AttendanceStatus } from '../../types';

export const AttendancePage: React.FC = () => {
  const { info } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState<AttendanceStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const records = await attendanceService.getAllAttendance({
        date: selectedDate,
        department,
        status,
        search,
      });
      const met = await attendanceService.getAttendanceMetrics(selectedDate);
      setAttendanceRecords(records);
      setMetrics(met);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate, department, status, search]);

  const handleExportCsv = () => {
    const headers = 'Date,Employee ID,Full Name,Department,Check In,Check Out,Working Hours,Status,Notes\n';
    const rows = attendanceRecords.map(r => `"${r.date}","${r.employee?.employee_id}","${r.employee?.full_name}","${r.employee?.department}","${r.check_in || ''}","${r.check_out || ''}","${r.working_hours}","${r.status}","${r.notes || ''}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Attendance_${selectedDate}.csv`;
    a.click();
    info('Export Generated', `Attendance data for ${selectedDate} exported to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Attendance Monitoring</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily clock-ins, shift completions, late arrivals, and absence trends across departments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Date & Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Attendance Rate</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{metrics?.attendanceRate || 0}%</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{metrics?.present || 0} of {metrics?.totalEmployees || 0} active</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Present</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{metrics?.present || 0}</span>
          <span className="text-[10px] text-emerald-600/70 mt-0.5 block">Logged In</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Late</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{metrics?.late || 0}</span>
          <span className="text-[10px] text-amber-600/70 mt-0.5 block">Past 09:15 AM</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-purple-600 block">On Leave</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">{metrics?.onLeave || 0}</span>
          <span className="text-[10px] text-purple-600/70 mt-0.5 block">Approved Schedule</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-rose-600 block">Absent</span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{metrics?.absent || 0}</span>
          <span className="text-[10px] text-rose-600/70 mt-0.5 block">Unrecorded / Off</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <input
              id="attendance-date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-semibold focus:outline-none"
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="attendance-search-input"
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Department */}
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="LEAVE">On Leave</option>
            <option value="ABSENT">Absent</option>
          </select>
        </div>

        <button
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 self-end md:self-auto"
        >
          Reset to Today
        </button>
      </div>

      {/* Attendance Table */}
      {isLoading ? (
        <LoadingSpinner label="Fetching attendance punch logs..." />
      ) : attendanceRecords.length === 0 ? (
        <EmptyState
          title="No Attendance Records Logged"
          description={`No attendance records found matching filters for date ${selectedDate}. Employees may check in using their self-service portal.`}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">ID / Department</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Check In</th>
                  <th className="px-4 py-3.5">Check Out</th>
                  <th className="px-4 py-3.5">Hours</th>
                  <th className="px-5 py-3.5">Shift Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={rec.employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={rec.employee?.full_name}
                          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{rec.employee?.full_name}</p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{rec.employee?.designation}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-800 font-medium block">{rec.employee?.employee_id}</span>
                      <span className="text-[10px] text-slate-400">{rec.employee?.department}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={rec.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-medium text-slate-800">
                        {rec.check_in ? new Date(rec.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-medium text-slate-800">
                        {rec.check_out ? new Date(rec.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-bold font-mono text-indigo-600">
                        {rec.working_hours ? `${rec.working_hours}h` : '0h'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-slate-500 text-[11px] truncate max-w-xs block">
                        {rec.notes || 'Normal workday punch'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
