import { supabase, isSupabaseConfigured, localDb } from '../lib/supabase';
import type { Employee, EmployeeStatus, EmploymentType, UserRole } from '../types';

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: EmployeeStatus | 'ALL';
  employmentType?: EmploymentType | 'ALL';
  role?: UserRole | 'ALL';
  sortBy?: 'name' | 'id' | 'department' | 'joiningDate' | 'salary';
  sortOrder?: 'asc' | 'desc';
}

export const employeeService = {
  async getEmployees(filters: EmployeeFilters = {}): Promise<Employee[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('employees').select('*');

        if (filters.department && filters.department !== 'ALL') {
          query = query.eq('department', filters.department);
        }
        if (filters.status && filters.status !== 'ALL') {
          query = query.eq('status', filters.status);
        }
        if (filters.search) {
          query = query.or(`full_name.ilike.%${filters.search}%,employee_id.ilike.%${filters.search}%,email.ilike.%${filters.search}%,designation.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;
        if (!error && data) return data as Employee[];
      } catch (err) {
        console.warn('Supabase getEmployees fallback to local database:', err);
      }
    }

    let employees = localDb.getEmployees();

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const s = filters.search.toLowerCase().trim();
      employees = employees.filter(e => 
        e.full_name.toLowerCase().includes(s) ||
        e.employee_id.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        e.department.toLowerCase().includes(s) ||
        e.designation.toLowerCase().includes(s)
      );
    }

    // Department filter
    if (filters.department && filters.department !== 'ALL') {
      employees = employees.filter(e => e.department === filters.department);
    }

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      employees = employees.filter(e => e.status === filters.status);
    }

    // Employment Type filter
    if (filters.employmentType && filters.employmentType !== 'ALL') {
      employees = employees.filter(e => e.employment_type === filters.employmentType);
    }

    // Role filter
    if (filters.role && filters.role !== 'ALL') {
      employees = employees.filter(e => e.role === filters.role);
    }

    // Sorting
    const sortField = filters.sortBy || 'name';
    const isAsc = filters.sortOrder !== 'desc';

    employees.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.full_name.localeCompare(b.full_name);
      } else if (sortField === 'id') {
        comparison = a.employee_id.localeCompare(b.employee_id);
      } else if (sortField === 'department') {
        comparison = a.department.localeCompare(b.department);
      } else if (sortField === 'joiningDate') {
        comparison = new Date(a.joining_date).getTime() - new Date(b.joining_date).getTime();
      } else if (sortField === 'salary') {
        comparison = a.base_salary - b.base_salary;
      }
      return isAsc ? comparison : -comparison;
    });

    return employees;
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('employees').select('*').eq('id', id).single();
        if (!error && data) return data as Employee;
      } catch (err) {
        console.warn('Supabase getEmployeeById fallback:', err);
      }
    }
    return localDb.getEmployeeById(id) || null;
  },

  async saveEmployee(employeeData: Partial<Employee> & { full_name: string; email: string; department: string; designation: string }): Promise<Employee> {
    if (isSupabaseConfigured && supabase) {
      try {
        if (employeeData.id) {
          const { data, error } = await supabase.from('employees').update(employeeData).eq('id', employeeData.id).select().single();
          if (!error && data) return data as Employee;
        } else {
          const { data, error } = await supabase.from('employees').insert([employeeData]).select().single();
          if (!error && data) return data as Employee;
        }
      } catch (err) {
        console.warn('Supabase saveEmployee fallback:', err);
      }
    }
    return localDb.saveEmployee(employeeData);
  },

  async toggleEmployeeStatus(id: string, newStatus: EmployeeStatus): Promise<Employee> {
    const employee = localDb.getEmployeeById(id);
    if (!employee) throw new Error('Employee not found');
    
    return localDb.saveEmployee({
      ...employee,
      status: newStatus,
    });
  },

  async deleteEmployee(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete fallback:', err);
      }
    }
    return localDb.deleteEmployee(id);
  },

  async getDepartments(): Promise<string[]> {
    const employees = await this.getEmployees();
    const depts = new Set(employees.map(e => e.department));
    return (Array.from(depts) as string[]).sort();
  }
};
