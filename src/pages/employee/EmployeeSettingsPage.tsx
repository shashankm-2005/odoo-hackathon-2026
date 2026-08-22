import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  ShieldCheck, 
  Save, 
  Smartphone,
  Globe
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const EmployeeSettingsPage: React.FC = () => {
  const { success } = useToast();

  const [notifications, setNotifications] = useState({
    leaveUpdates: true,
    payslipReady: true,
    companyAnnouncements: true,
    dailyReminder: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    success('Preferences Saved', 'Notification settings have been updated.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    success('Password Updated', 'Your security password has been changed successfully.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Account & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your notification channels, security credentials, and portal settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alert Notifications</h3>
          </div>

          <form onSubmit={handleSaveNotifications} className="space-y-3.5 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Leave Review Updates</span>
                <span className="text-[11px] text-slate-500">Receive alerts when managers approve or decline time-off</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.leaveUpdates}
                onChange={(e) => setNotifications({ ...notifications, leaveUpdates: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Payslip Disbursement</span>
                <span className="text-[11px] text-slate-500">Notification when your monthly statement is generated</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.payslipReady}
                onChange={(e) => setNotifications({ ...notifications, payslipReady: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <div>
                <span className="font-bold text-slate-900 block">Company Announcements</span>
                <span className="text-[11px] text-slate-500">Workplace bulletins and organizational policy memos</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.companyAnnouncements}
                onChange={(e) => setNotifications({ ...notifications, companyAnnouncements: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Alerts</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Change Password</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
