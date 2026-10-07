import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Compass,
  Users,
  Sparkles,
  Bell,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-blue-100">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-100 px-6 sm:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Team<span className="text-blue-600">Up</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">
            How It Works
          </a>
          <a href="#categories" className="hover:text-blue-600 transition-colors">
            Categories
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>The College Collaboration Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Find Your Team, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Build Your Future
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Connect with like-minded students, create rooms, find compatible teammates, and work
            together on hackathons, research, personal projects, and competitions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 text-sm flex items-center justify-center space-x-2 transition-all hover:scale-102"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/rooms"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 text-sm flex items-center justify-center transition-colors"
            >
              Explore Rooms
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Smart Match Engine</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Real-Time Notifications</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free for Students</span>
            </div>
          </div>
        </div>

        {/* Hero Illustration / Graphics */}
        <div className="w-full max-w-lg lg:max-w-xl">
          <div className="relative rounded-3xl bg-linear-to-tr from-blue-100/60 via-indigo-50/40 to-slate-50 p-8 border border-blue-100/70 shadow-xl">
            {/* Visual Team Mockup Card */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                  HACKATHON
                </span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                  94% Match
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI Innovation Sprint 2026</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Looking for React frontend dev and FastAPI backend engineer to build an AI agent!
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                  React
                </span>
                <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                  Node.js
                </span>
                <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                  Python
                </span>
                <span className="text-[11px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                  AI/ML
                </span>
              </div>
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-700">3 / 4 Members</span>
                </div>
                <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-xs">
                  Request to Join
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-slate-100">
                <div className="text-2xl font-black text-blue-600">500+</div>
                <div className="text-xs text-slate-500 font-medium">Students Teaming Up</div>
              </div>
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-xl border border-slate-100">
                <div className="text-2xl font-black text-indigo-600">120+</div>
                <div className="text-xs text-slate-500 font-medium">Active Project Rooms</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4 Pillars Section */}
      <section id="features" className="bg-slate-50/70 border-t border-slate-100 py-16 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything you need to form winning teams
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Designed specifically for college students to build, compete, and research together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Find Rooms</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Filter by hackathons, clubs, research, and skills to discover exciting teams looking for your talent.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Build Teams</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Create a room in 60 seconds, set skill and branch criteria, review applications, or directly invite students.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Get Recommendations</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Our transparent matching algorithm ranks rooms and candidates with detailed explanations of compatibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Stay Connected</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Get real-time Socket.IO notifications for incoming requests, deadline countdowns, and team milestone updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400">
        <p>© 2026 TeamUp — College Collaboration & Team Formation Platform.</p>
      </footer>
    </div>
  );
};

export default Home;
