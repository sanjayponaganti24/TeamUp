import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';
import NotificationBell from './NotificationBell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import * as studentApi from '../../services/api/student-api.js';

const Navbar = ({ onOpenSidebar, searchTerm, setSearchTerm }) => {
  const { user, student, setStudent } = useAuth();
  const navigate = useNavigate();

  const toggleAvailability = async () => {
    if (!student) return;
    const nextStatus =
      student.availability === 'AVAILABLE'
        ? 'WAITING'
        : student.availability === 'WAITING'
        ? 'HOLD'
        : 'AVAILABLE';

    try {
      const res = await studentApi.updateProfile({ availability: nextStatus });
      if (res.success && res.data) {
        setStudent(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const getStatusBadge = () => {
    switch (student?.availability) {
      case 'AVAILABLE':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Available',
        };
      case 'WAITING':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Waiting',
        };
      case 'HOLD':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'Hold',
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Available',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="h-18 bg-white border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3 w-full max-w-md">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="w-full">
          <SearchBar
            value={searchTerm || ''}
            onChange={(val) => {
              if (setSearchTerm) setSearchTerm(val);
            }}
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Availability Quick Toggle Pill */}
        <button
          onClick={toggleAvailability}
          title="Click to change availability status"
          className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all hover:scale-102 ${status.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
          <span>{status.label}</span>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile avatar */}
        <Link
          to="/profile"
          className="flex items-center space-x-2.5 p-1 hover:bg-slate-50 rounded-full transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-2 ring-slate-100">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left pr-2">
            <p className="text-xs font-semibold text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
              {user?.name || 'Student'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-none">
              {student?.branch ? student.branch.split(' ')[0] : 'Member'}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
