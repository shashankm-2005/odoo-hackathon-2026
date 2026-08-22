import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  CalendarOff, 
  Receipt, 
  Settings, 
  User, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../lib/supabase';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, employee, logout } = useAuth();
  const location = useLocation();

  // Dynamic badge counts from database
  const pendingLeavesCount = role === 'ADMIN'
    ? localDb.getLeaveRequests().filter(r => r.status === 'PENDING').length
    : 0;

  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Attendance', path: '/admin/attendance', icon: Clock },
    { label: 'Leave Management', path: '/admin/leave', icon: CalendarOff, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined },
    { label: 'Payroll', path: '/admin/payroll', icon: Receipt },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const employeeNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/employee', icon: LayoutDashboard, exact: true },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'Attendance', path: '/employee/attendance', icon: Clock },
    { label: 'Leave Requests', path: '/employee/leave', icon: CalendarOff },
    { label: 'My Payroll', path: '/employee/payroll', icon: Receipt },
    { label: 'Settings', path: '/employee/settings', icon: Settings },
  ];

  const navItems: NavItem[] = role === 'ADMIN' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800 shadow-xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-xl italic shadow-xs">
              D
            </div>
            <div>
              <h1 className="text-white font-bold tracking-tight text-xl leading-none">DAYFLOW</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-1">
                Workday Aligned
              </p>
            </div>
          </div>
          {/* Close toggle for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {role === 'ADMIN' ? 'WORKFORCE OPS' : 'SELF SERVICE'}
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / User Profile summary */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">
                  {role === 'ADMIN' ? 'Admin Account' : (employee?.designation || 'Employee')}
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
