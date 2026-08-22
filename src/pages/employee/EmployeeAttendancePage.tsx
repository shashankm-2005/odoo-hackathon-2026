import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Hourglass, 
  TrendingUp 
} from 'lucide-react';
import { CheckInOutWidget } from '../../components/attendance/CheckInOutWidget';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import type { Attendance } from '../../types';

export const EmployeeAttendancePage: React.FC = () => {
  const { employee } = useAuth();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('month');
  const [isLoading, setIsLoading] = useState(true);

  const empId = employee?.id || '';

  const loadAttendance = async () => {
    if (!empId) return;
    setIsLoading(true);
    try {
      const data = await attendanceService.getEmployeeAttendance(empId, period);
      setRecords(data);
    } catch (err) {
      console.error('Failed to load employee attendance history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [empId, period]);

  // Calculations
  const presentDays = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE' || r.status === 'HALF_DAY').length;
  const lateDays = records.filter(r => r.status === 'LATE').length;
  const totalHours = records.reduce((sum, r) => sum + (r.working_hours || 0), 0);
  const avgHours = presentDays > 0 ? (totalHours / presentDays).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Attendance & Shifts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Punch in daily, track shift timestamps, and review historical work hours.
        </p>
      </div>

      {/* Main Punch Clock Widget */}
      <CheckInOutWidget
        employeeId={empId}
        onAttendanceUpdated={loadAttendance}
      />

      {/* Personal Metric Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Present Shifts</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{presentDays}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Logged in {period}</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Late Arrivals</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{lateDays}</span>
          <span className="text-[10px] text-amber-600/70 mt-0.5 block">Past 09:15 AM</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-indigo-600 block">Total Work Hours</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{totalHours.toFixed(1)}h</span>
          <span className="text-[10px] text-indigo-600/70 mt-0.5 block">Cumulative</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Hours / Shift</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{avgHours}h</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Target: 8.0h</span>
        </div>
      </div>

      {/* Control & Period Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Attendance Log History</h3>
        
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(['week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                period === p ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p === 'week' ? 'Past 7 Days' : p === 'month' ? 'Past 30 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      {isLoading ? (
        <LoadingSpinner label="Compiling your attendance history..." />
      ) : records.length === 0 ? (
        <EmptyState
          title="No Attendance History in Selected Period"
          description="Check in using the punch clock above to record your shift."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Date & Day</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Check In Time</th>
                  <th className="px-4 py-3.5">Check Out Time</th>
                  <th className="px-4 py-3.5">Duration</th>
                  <th className="px-5 py-3.5">Daily Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => {
                  const dateObj = new Date(rec.date + 'T00:00:00');
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{rec.date}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{dayName}</span>
                      </td>

                      <td className="px-4 py-3.5">
                        <StatusBadge status={rec.status} />
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-800">
                        {rec.check_in ? new Date(rec.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-800">
                        {rec.check_out ? new Date(rec.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-600">
                        {rec.working_hours ? `${rec.working_hours} hrs` : '0 hrs'}
                      </td>

                      <td className="px-5 py-3.5 text-slate-500">
                        {rec.notes || 'Normal workday'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
