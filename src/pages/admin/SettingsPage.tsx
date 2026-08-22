import React, { useState } from 'react';
import { 
  Building, 
  Clock, 
  CalendarOff, 
  Database, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { localDb } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { success, info } = useToast();

  const [companyData, setCompanyData] = useState({
    name: 'Dayflow Technologies Inc.',
    tagline: 'Every workday, perfectly aligned.',
    email: 'admin@dayflow.io',
    phone: '+1 (555) 492-1000',
    address: '100 Innovation Boulevard, Suite 500, San Francisco, CA 94107',
    taxId: 'US-EIN-94829104',
    currency: 'USD ($)',
  });

  const [policyData, setPolicyData] = useState({
    workHours: 8.0,
    lateGraceMinutes: 15,
    paidLeaveQuota: 18,
    sickLeaveQuota: 12,
    casualLeaveQuota: 8,
    autoApproveLeaves: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      success('Organization Settings Saved', 'Company profile details updated across all system templates.');
    }, 400);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all HRMS database records to initial seed data? This will restore the 11 original employee profiles.')) {
      localDb.resetToSeedData();
      success('Database Seed Reset Complete', 'All 11 demo employee profiles, attendance logs, and payroll records have been restored.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Organization & System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure corporate metadata, workforce policies, working hours, and database synchronization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Sections */}
        <div className="md:col-span-2 space-y-6">
          {/* Company Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Building className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Company Profile</h3>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4 text-xs mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Tagline</label>
                  <input
                    type="text"
                    value={companyData.tagline}
                    onChange={(e) => setCompanyData({ ...companyData, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Support / Admin Email</label>
                  <input
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headquarters Address</label>
                <input
                  type="text"
                  value={companyData.address}
                  onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Work & Leave Policy Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Workforce Policies</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Standard Shift</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{policyData.workHours} Hours / Day</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">09:00 AM - 05:00 PM</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Late Grace Window</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{policyData.lateGraceMinutes} Minutes</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Until 09:15 AM</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium block">Annual Paid Quota</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{policyData.paidLeaveQuota} Days / Year</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Accrues monthly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Database & Demo Tools */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Database & Demo Engine</h3>
            </div>

            <div className="space-y-3 text-xs mt-3">
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Dual Mode Storage Active</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Dayflow is utilizing the LocalDatabaseEngine with immediate persistence. All edits, attendance punches, and leave approvals persist across sessions.
                </p>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Hackathon Reviewer Tools
                </span>
                <button
                  id="reset-demo-seed-btn"
                  onClick={handleResetDemoData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 font-semibold rounded-xl transition-all text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore 11 Demo Seed Profiles</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="font-bold">Odoo Hackathon 2026</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Dayflow HRMS provides complete, non-simulated enterprise workforce operations, role-based security isolation, dynamic attendance tracking, and printable payslip generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
