import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';

interface CheckInOutWidgetProps {
  employeeId: string;
  onAttendanceUpdated?: () => void;
}

export const CheckInOutWidget: React.FC<CheckInOutWidgetProps> = ({
  employeeId,
  onAttendanceUpdated,
}) => {
  const { success, error, info } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusData, setStatusData] = useState<{
    status: string;
    canCheckIn: boolean;
    canCheckOut: boolean;
    checkInTime?: string;
    checkOutTime?: string;
    workingHours: number;
  } | null>(null);

  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadStatus = async () => {
    if (!employeeId) return;
    try {
      const data = await attendanceService.getTodayStatus(employeeId);
      setStatusData(data);
    } catch (err) {
      console.error('Failed to load today attendance status:', err);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [employeeId]);

  const handleCheckIn = async () => {
    if (!employeeId) return;
    setIsProcessing(true);
    try {
      await attendanceService.checkIn(employeeId, notes || undefined);
      success('Check-in Successful!', `Recorded at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}

      setShowNotesInput(false);
      setNotes('');
      await loadStatus();
      if (onAttendanceUpdated) onAttendanceUpdated();
    } catch (err: any) {
      error('Check-in Failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId) return;
    setIsProcessing(true);
    try {
      const record = await attendanceService.checkOut(employeeId);
      success('Check-out Recorded', `Logged ${record.working_hours} working hours today. Great job!`);
      await loadStatus();
      if (onAttendanceUpdated) onAttendanceUpdated();
    } catch (err: any) {
      error('Check-out Failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const targetHours = 8;
  const currentHours = statusData?.workingHours || 0;
  const progressPercent = Math.min(100, Math.round((currentHours / targetHours) * 100));

  return (
    <div id="check-in-out-widget" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800">Attendance Console</h3>
            <StatusBadge status={statusData?.status || 'NOT_CHECKED_IN'} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{formattedDate}</p>
        </div>

        {/* Big Live Digital Clock */}
        <div className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-xl shadow-inner font-mono text-lg font-bold tracking-widest self-start sm:self-auto">
          <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Progress & Logged Timestamps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 text-xs">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-medium block text-[11px]">Check-in Time</span>
          <span className="text-sm font-bold text-slate-800 mt-0.5 block">
            {statusData?.checkInTime 
              ? new Date(statusData.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : '--:--'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-medium block text-[11px]">Check-out Time</span>
          <span className="text-sm font-bold text-slate-800 mt-0.5 block">
            {statusData?.checkOutTime 
              ? new Date(statusData.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : '--:--'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-slate-400 font-medium block text-[11px]">Total Hours Tracked</span>
          <span className="text-sm font-bold text-blue-600 mt-0.5 block">
            {statusData?.workingHours ? `${statusData.workingHours} hrs` : '0.00 hrs'}
          </span>
        </div>
      </div>

      {/* Workday Progress Bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>Standard Workday Goal (8.0 hrs)</span>
          <span className="font-semibold text-slate-700">{progressPercent}% complete</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Notes Input for Check In */}
      {showNotesInput && statusData?.canCheckIn && (
        <div className="mb-4 animate-in fade-in">
          <input
            type="text"
            placeholder="Add optional morning note or remote location tag..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {statusData?.canCheckIn && (
          <>
            <button
              id="employee-check-in-btn"
              onClick={handleCheckIn}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>{isProcessing ? 'Recording Check-in...' : 'Check In Now'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNotesInput(!showNotesInput)}
              className="px-3.5 py-2.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-semibold"
            >
              {showNotesInput ? 'Hide Note' : '+ Add Note'}
            </button>
          </>
        )}

        {statusData?.canCheckOut && (
          <button
            id="employee-check-out-btn"
            onClick={handleCheckOut}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm disabled:opacity-50"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span>{isProcessing ? 'Processing Check-out...' : 'Check Out for Today'}</span>
          </button>
        )}

        {!statusData?.canCheckIn && !statusData?.canCheckOut && (
          <div className="w-full flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-xl border border-green-200 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>Workday complete! Your attendance and {statusData?.workingHours} working hours have been saved.</span>
          </div>
        )}
      </div>
    </div>
  );
};
