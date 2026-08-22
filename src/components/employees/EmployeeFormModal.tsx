import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { Employee, EmployeeStatus, EmploymentType, UserRole } from '../../types';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => Promise<void>;
  initialEmployee?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEmployee,
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    phone: '',
    gender: 'Female',
    date_of_birth: '1995-05-15',
    address: '',
    department: 'Engineering',
    designation: '',
    joining_date: new Date().toISOString().split('T')[0],
    employment_type: 'FULL_TIME' as EmploymentType,
    status: 'ACTIVE' as EmployeeStatus,
    role: 'EMPLOYEE' as UserRole,
    base_salary: 7500,
    emergency_contact: '',
    emergency_phone: '',
    profile_image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        employee_id: initialEmployee.employee_id,
        full_name: initialEmployee.full_name,
        email: initialEmployee.email,
        phone: initialEmployee.phone || '',
        gender: initialEmployee.gender || 'Female',
        date_of_birth: initialEmployee.date_of_birth || '1995-05-15',
        address: initialEmployee.address || '',
        department: initialEmployee.department || 'Engineering',
        designation: initialEmployee.designation || '',
        joining_date: initialEmployee.joining_date || new Date().toISOString().split('T')[0],
        employment_type: initialEmployee.employment_type || 'FULL_TIME',
        status: initialEmployee.status || 'ACTIVE',
        role: initialEmployee.role || 'EMPLOYEE',
        base_salary: initialEmployee.base_salary || 7500,
        emergency_contact: initialEmployee.emergency_contact || '',
        emergency_phone: initialEmployee.emergency_phone || '',
        profile_image: initialEmployee.profile_image || '',
      });
    } else {
      setFormData({
        employee_id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        full_name: '',
        email: '',
        phone: '+1 (555) ',
        gender: 'Female',
        date_of_birth: '1995-05-15',
        address: 'San Francisco, CA',
        department: 'Engineering',
        designation: 'Software Engineer',
        joining_date: new Date().toISOString().split('T')[0],
        employment_type: 'FULL_TIME',
        status: 'ACTIVE',
        role: 'EMPLOYEE',
        base_salary: 8000,
        emergency_contact: '',
        emergency_phone: '',
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
    }
    setErrors({});
  }, [initialEmployee, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.full_name.trim()) errs.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.designation.trim()) errs.designation = 'Designation is required';
    if (!formData.employee_id.trim()) errs.employee_id = 'Employee ID is required';
    if (formData.base_salary <= 0) errs.base_salary = 'Base salary must be positive';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...(initialEmployee ? { id: initialEmployee.id, profile_id: initialEmployee.profile_id } : {}),
        ...formData,
        base_salary: Number(formData.base_salary),
      });
      onClose();
    } catch (err: any) {
      setErrors(prev => ({ ...prev, form: err.message || 'Failed to save employee' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialEmployee ? `Edit Employee: ${initialEmployee.full_name}` : 'Add New Workforce Member'}
      subtitle={initialEmployee ? `Updating records for ID ${initialEmployee.employee_id}` : 'Fill in employee details to onboard into Dayflow'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {errors.form && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee ID */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Employee ID *</label>
            <input
              type="text"
              required
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.employee_id && <p className="text-rose-500 text-[11px] mt-0.5">{errors.employee_id}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alex Morgan"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.full_name && <p className="text-rose-500 text-[11px] mt-0.5">{errors.full_name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="name@dayflow.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.email && <p className="text-rose-500 text-[11px] mt-0.5">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Designation / Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            {errors.designation && <p className="text-rose-500 text-[11px] mt-0.5">{errors.designation}</p>}
          </div>

          {/* Employment Type */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
            <select
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value as EmploymentType })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as EmployeeStatus })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="ACTIVE">Active</option>
              <option value="PROBATION">Probation</option>
              <option value="INACTIVE">Inactive</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">System Role Access</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="EMPLOYEE">Employee (Self-Service)</option>
              <option value="ADMIN">Admin / HR (Workforce Ops)</option>
            </select>
          </div>

          {/* Base Salary */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Monthly Base Salary ($)</label>
            <input
              type="number"
              min="1000"
              step="100"
              value={formData.base_salary}
              onChange={(e) => setFormData({ ...formData, base_salary: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
            <input
              type="date"
              value={formData.joining_date}
              onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
          <input
            type="text"
            placeholder="123 Main Street, San Francisco, CA"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : initialEmployee ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
