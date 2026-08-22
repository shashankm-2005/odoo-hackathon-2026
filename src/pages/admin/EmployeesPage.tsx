import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Download, 
  Eye, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  DollarSign, 
  CheckCircle2,
  MoreVertical,
  LayoutGrid,
  List
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { EmployeeFormModal } from '../../components/employees/EmployeeFormModal';
import { Modal } from '../../components/common/Modal';
import { employeeService } from '../../services/employeeService';
import { useToast } from '../../context/ToastContext';
import type { Employee, EmployeeStatus } from '../../types';

export const EmployeesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { success, error, info } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [department, setDepartment] = useState('ALL');
  const [status, setStatus] = useState<EmployeeStatus | 'ALL'>('ALL');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getEmployees({
        search,
        department,
        status,
      });
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [search, department, status]);

  const handleSaveEmployee = async (data: any) => {
    try {
      await employeeService.saveEmployee(data);
      success(editingEmployee ? 'Employee record updated' : 'New workforce member added');
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err: any) {
      error('Failed to save employee', err.message);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    try {
      await employeeService.deleteEmployee(deletingEmployee.id);
      success('Employee removed', `${deletingEmployee.full_name} deleted from records`);
      setDeletingEmployee(null);
      await loadEmployees();
    } catch (err: any) {
      error('Failed to delete employee', err.message);
    }
  };

  const handleExportCsv = () => {
    const headers = 'Employee ID,Full Name,Email,Department,Designation,Status,Base Salary,Joining Date\n';
    const rows = employees.map(e => `"${e.employee_id}","${e.full_name}","${e.email}","${e.department}","${e.designation}","${e.status}","${e.base_salary}","${e.joining_date}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dayflow_Workforce_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    info('Export Complete', 'Workforce directory exported to CSV');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Workforce Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage employee master data, designations, compensation, and organizational alignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            id="add-employee-main-btn"
            onClick={() => {
              setEditingEmployee(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="employee-search-input"
              type="text"
              placeholder="Search by name, ID, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Department Filter */}
          <select
            id="employee-dept-filter"
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

          {/* Status Filter */}
          <select
            id="employee-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PROBATION">Probation</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content View */}
      {isLoading ? (
        <LoadingSpinner label="Querying employee database records..." />
      ) : employees.length === 0 ? (
        <EmptyState
          title="No Employees Found"
          description="No team members match your active filter criteria. Try clearing search keywords or department filters."
          action={{
            label: 'Add First Employee',
            onClick: () => {
              setEditingEmployee(null);
              setIsFormModalOpen(true);
            }
          }}
        />
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">ID / Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Designation</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Base Salary</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={emp.full_name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{emp.full_name}</p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono text-slate-800 font-medium block">{emp.employee_id}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{emp.role}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-800">{emp.department}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-slate-700">{emp.designation}</span>
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={emp.status} />
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-900">
                        ${emp.base_salary ? emp.base_salary.toLocaleString() : '6,000'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/month</span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Employee"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={emp.full_name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">{emp.full_name}</h4>
                      <p className="text-slate-500 text-xs">{emp.designation}</p>
                      <span className="text-[10px] font-mono text-slate-400">{emp.employee_id}</span>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Monthly Comp</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">${emp.base_salary?.toLocaleString() || '6,000'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewingEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingEmployee(emp);
                      setIsFormModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEmployee(null);
        }}
        initialEmployee={editingEmployee}
        onSave={handleSaveEmployee}
      />

      {/* Detailed Profile Viewer Modal */}
      {viewingEmployee && (
        <Modal
          isOpen={!!viewingEmployee}
          onClose={() => setViewingEmployee(null)}
          title="Employee Profile Dossier"
          subtitle={`Master HR record for ID ${viewingEmployee.employee_id}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={viewingEmployee.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={viewingEmployee.full_name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{viewingEmployee.full_name}</h3>
                <p className="text-slate-600 font-medium">{viewingEmployee.designation} • {viewingEmployee.department}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={viewingEmployee.status} />
                  <span className="text-[11px] font-mono text-slate-500">{viewingEmployee.employee_id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Work Email</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{viewingEmployee.email}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Contact Phone</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{viewingEmployee.phone || 'Not recorded'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Employment Type</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{viewingEmployee.employment_type || 'Full Time'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Joining Date</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{viewingEmployee.joining_date}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Monthly Base Compensation</span>
                <span className="font-mono font-bold text-indigo-700 mt-0.5 block">${viewingEmployee.base_salary?.toLocaleString() || '6,000'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Date of Birth / Gender</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{viewingEmployee.date_of_birth || '1995-05-15'} ({viewingEmployee.gender || 'Not specified'})</span>
              </div>
            </div>

            {viewingEmployee.address && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Registered Address</span>
                <span className="text-slate-800 mt-0.5 block">{viewingEmployee.address}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingEmployee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = viewingEmployee;
                  setViewingEmployee(null);
                  setEditingEmployee(target);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-xs shadow-xs"
              >
                Edit Details
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEmployee && (
        <Modal
          isOpen={!!deletingEmployee}
          onClose={() => setDeletingEmployee(null)}
          title="Confirm Deletion"
          subtitle="Are you sure you want to remove this employee?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              This action will permanently delete <strong className="text-slate-900">{deletingEmployee.full_name}</strong> ({deletingEmployee.employee_id}) and remove all linked attendance and payroll associations.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingEmployee(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-employee-btn"
                onClick={handleDeleteEmployee}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs"
              >
                Delete Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
