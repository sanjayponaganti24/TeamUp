import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layers, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthFeaturePanel from '../../components/auth/AuthFeaturePanel.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell min-h-screen flex items-center justify-center p-5 sm:p-8">
      <div className="auth-page-frame grid w-full max-w-6xl overflow-hidden rounded-2xl border border-blue-100 bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <div className="auth-panel-column hidden lg:block"><AuthFeaturePanel /></div>
        <section className="auth-form-card flex min-w-0 flex-col justify-center px-6 py-10 sm:px-12 lg:px-10 xl:px-16">
        <div className="mx-auto mb-7 w-full max-w-md text-center">
          <span className="app-brand-mark mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-blue-200"><Layers className="h-6 w-6" /></span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back!</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-auto mb-5 flex w-[90%] items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@college.edu"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-2 flex w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <><span>Login</span><ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
          <span>Don't have an account? </span>
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Register
          </Link>
        </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
