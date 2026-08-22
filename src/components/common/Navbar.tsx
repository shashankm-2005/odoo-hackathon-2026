import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  LogOut, 
  User, 
  Layers, 
  ShieldCheck, 
  Check, 
  Clock, 
  ExternalLink,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenAiAssistant }) => {
  const { user, employee, role, logout, switchUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { success } = useToast();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (demoRef.current && !demoRef.current.contains(event.target as Node)) {
        setShowDemoSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const handleSwitchRole = async (targetEmail: string) => {
    await switchUser(targetEmail);
    setShowDemoSwitcher(false);
    success('Switched user persona', `Active account: ${targetEmail}`);
    if (targetEmail.includes('admin')) {
      navigate('/admin');
    } else {
      navigate('/employee');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (role === 'ADMIN') {
      navigate(`/admin/employees?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/employee/attendance?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white border-b border-slate-200 shadow-2xs">
      {/* Left side: Mobile Toggle & Brand / Context */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleSidebar && (
          <button
            id="mobile-sidebar-toggle"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <Link to={role === 'ADMIN' ? '/admin' : '/employee'} className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold italic shadow-xs">
              D
            </div>
            <span className="font-bold tracking-tight text-slate-900 text-lg">DAYFLOW</span>
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-800">
              {role === 'ADMIN' ? 'Admin Command Center' : 'Employee Self-Service'}
            </h2>
            <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md uppercase font-bold tracking-tight">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Global Search */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center max-w-xs lg:max-w-sm w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="global-navbar-search"
            type="text"
            placeholder={role === 'ADMIN' ? "Search workforce records..." : "Search attendance, leaves..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Persona Switcher for Hackathon Reviewers */}
        <div className="relative" ref={demoRef}>
          <button
            id="demo-role-switcher-btn"
            onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            title="Switch Demo Persona"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Persona:</span>
            <span className="font-semibold text-slate-900">{role === 'ADMIN' ? 'Admin' : 'Employee'}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showDemoSwitcher && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quick Persona Switch</p>
                <p className="text-xs text-slate-500">Test role-based access & workflows</p>
              </div>
              <button
                onClick={() => handleSwitchRole('admin@dayflow.io')}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${role === 'ADMIN' ? 'bg-indigo-50/50' : ''}`}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">Sarah Jenkins (Admin)</p>
                  <p className="text-[10px] text-slate-500">Full workforce management</p>
                </div>
                {role === 'ADMIN' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
              <button
                onClick={() => handleSwitchRole('alex.morgan@dayflow.io')}
                className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${role === 'EMPLOYEE' ? 'bg-indigo-50/50' : ''}`}
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900">Alex Morgan (Employee)</p>
                  <p className="text-[10px] text-slate-500">Self-service check-in, leaves & payroll</p>
                </div>
                {role === 'EMPLOYEE' && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          )}
        </div>

        {/* Dayflow AI HR Assistant Button */}
        {onOpenAiAssistant && (
          <button
            id="open-ai-assistant-btn"
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors shadow-2xs"
            title="Ask Dayflow HR Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">HR Assistant</span>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            id="navbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new notifications right now.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.is_read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs ${!notif.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            id="navbar-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar_url || employee?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.full_name}
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.full_name}</p>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{employee?.designation || (role === 'ADMIN' ? 'HR Admin' : 'Employee')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Role: {role}
                </span>
              </div>

              <Link
                to={role === 'ADMIN' ? '/admin/settings' : '/employee/profile'}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>{role === 'ADMIN' ? 'Organization Settings' : 'My Profile'}</span>
              </Link>

              <button
                id="navbar-logout-btn"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
