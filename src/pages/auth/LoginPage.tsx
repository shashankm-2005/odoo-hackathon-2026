import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const LoginPage: React.FC = () => {
  const { login, switchUser } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const session = await login(email, password);

      success(`Welcome back, ${session.user.full_name}!`);

      // Always redirect based on the ACTUAL authenticated user's role.
      if (session.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    } catch (err: any) {
      const message = err?.message || 'Invalid email or password';

      setErrorMessage(message);
      error('Authentication Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (
    quickEmail: string,
    quickPassword: string = 'password123'
  ) => {
    setIsLoading(true);
    setErrorMessage('');

    // IMPORTANT:
    // Keep the normal login form synchronized with the selected demo account.
    setEmail(quickEmail);
    setPassword(quickPassword);

    try {
      const session = await switchUser(quickEmail);

      success(`Welcome back, ${session.user.full_name}!`);

      // Redirect using the actual session role.
      if (session.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    } catch (err: any) {
      const message = err?.message || 'Login failed';

      setErrorMessage(message);
      error('Authentication Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F172A] text-white shadow-lg mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold italic text-lg shadow-sm">
            D
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          DAYFLOW
        </h2>

        <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase mt-0.5">
          Enterprise Human Resource Management System
        </p>

        <p className="text-xs text-slate-500 mt-1 italic">
          "Every workday, perfectly aligned."
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">

        {/* Quick Demo Login Presets */}
        <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              1-Click Hackathon Demo Logins
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">

            {/* ADMIN LOGIN */}
            <button
              id="quick-login-admin"
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleQuickLogin('admin@dayflow.io', 'password123')
              }
              className="flex flex-col items-start p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Sarah Jenkins</span>
              </div>

              <span className="text-[10px] text-slate-500 mt-0.5">
                Admin / HR Lead
              </span>
            </button>

            {/* EMPLOYEE LOGIN */}
            <button
              id="quick-login-employee"
              type="button"
              disabled={isLoading}
              onClick={() =>
                handleQuickLogin(
                  'alex.morgan@dayflow.io',
                  'password123'
                )
              }
              className="flex flex-col items-start p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                <User className="w-4 h-4 text-blue-600" />
                <span>Alex Morgan</span>
              </div>

              <span className="text-[10px] text-slate-500 mt-0.5">
                Employee (Engineer)
              </span>
            </button>

          </div>
        </div>

        {/* Traditional Login Form */}
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200 sm:px-10">

          <form onSubmit={handleLogin} className="space-y-4 text-xs">

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Corporate Email
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  id="login-email-input"
                  type="email"
                  required
                  placeholder="admin@dayflow.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  Password
                </label>

                <span className="text-[10px] text-slate-400">
                  Demo: password123
                </span>
              </div>

              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>
            </div>

            {/* SIGN IN */}
            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 text-xs uppercase"
              >
                <span>
                  {isLoading ? 'Signing In...' : 'Sign In to Dayflow'}
                </span>

                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

          {/* REGISTER */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Don't have an employee account yet? </span>

            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Register New Workforce Member
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};