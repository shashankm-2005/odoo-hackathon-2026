import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Edit3, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';
import type { Employee } from '../../types';

export const EmployeeProfilePage: React.FC = () => {
  const { user, employee, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        phone: employee.phone || '+1 (555) 301-4490',
        address: employee.address || '452 Pine Valley Way, San Francisco, CA',
        emergency_contact: employee.emergency_contact || 'Elena Morgan (Spouse)',
        emergency_phone: employee.emergency_phone || '+1 (555) 992-1082',
      });
    }
  }, [employee]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setIsSaving(true);
    try {
      await employeeService.saveEmployee({
        ...employee,
        phone: formData.phone,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
        emergency_phone: formData.emergency_phone,
      });
      success('Profile Updated Successfully', 'Your contact and emergency information has been saved.');
      setIsEditing(false);
    } catch (err: any) {
      error('Failed to update profile', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!employee) {
    return <LoadingSpinner fullHeight label="Retrieving employee profile details..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">My Employee Dossier</h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal records, organizational placement, compensation structure, and emergency contacts.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Contact Info'}</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={employee.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
          alt={employee.full_name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{employee.full_name}</h2>
            <StatusBadge status={employee.status} />
          </div>

          <p className="text-xs font-medium text-slate-600">
            {employee.designation} • {employee.department}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-semibold text-slate-700">
              ID: {employee.employee_id}
            </span>
            <span>Role: {employee.role}</span>
            <span>Type: {employee.employment_type?.replace('_', ' ') || 'Full Time'}</span>
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job & Compensation Details */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">Employment & Compensation</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Department</span>
              <span className="font-bold text-slate-900">{employee.department}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Job Title</span>
              <span className="font-bold text-slate-900">{employee.designation}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Date of Joining</span>
              <span className="font-bold text-slate-900">{employee.joining_date}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Monthly Base Salary</span>
              <span className="font-mono font-bold text-emerald-700">${employee.base_salary?.toLocaleString() || '6,000'} / mo</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Corporate Email</span>
              <span className="font-medium text-slate-900">{employee.email}</span>
            </div>
          </div>
        </div>

        {/* Editable Personal & Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">Contact & Emergency Details</h3>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person</label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={formData.emergency_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Contact Phone</span>
                <span className="font-bold text-slate-900">{formData.phone}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Residential Address</span>
                <span className="font-medium text-slate-900 text-right max-w-xs">{formData.address}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Emergency Contact</span>
                <span className="font-bold text-slate-900">{formData.emergency_contact}</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Emergency Phone</span>
                <span className="font-bold text-slate-900">{formData.emergency_phone}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
