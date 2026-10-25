import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Loader2, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthFeaturePanel from '../../components/auth/AuthFeaturePanel.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science and Engineering',
    year: 2,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        ...formData,
        year: Number(formData.year),
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const branches = [
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics & Communication (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Data Science',
    'Other Engineering Branch',
  ];

  return (
    <main className="auth-shell min-h-screen flex items-center justify-center p-5 sm:p-8">
      <div className="auth-page-frame grid w-full max-w-6xl overflow-hidden rounded-2xl border border-blue-100 bg-white lg:grid-cols-[0.9fr_1.1fr]">
        <div className="auth-panel-column hidden lg:block"><AuthFeaturePanel /></div>
        <section className="auth-form-card flex min-w-0 flex-col justify-center px-6 py-8 sm:px-12 lg:px-10 xl:px-16">
        <div className="mx-auto mb-5 w-full max-w-md text-center">
          <span className="app-brand-mark mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-blue-200"><Layers className="h-5 w-5" /></span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Your Account</h1>
          <p className="mt-1 text-sm text-slate-500">Join TeamUp and start building your future</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-auto mb-4 flex w-full max-w-md items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-sm text-rose-600">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Sanjay Kumar"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              College Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. sanjay@college.edu"
              className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute inset-y-0 right-2 flex w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

            <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Branch / Dept
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              >
                {[1, 2, 3, 4, 5].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
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
                <span>Creating account...</span>
              </>
            ) : (
              <><span>Register</span><ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
