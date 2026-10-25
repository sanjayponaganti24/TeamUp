import React from 'react';
import { Bell, Compass, Layers, Sparkles, UsersRound } from 'lucide-react';

const features = [
  {
    icon: UsersRound,
    title: 'Find Teammates',
    description: 'Connect with students who share your skills, interests and goals.',
    tone: 'auth-feature-blue',
  },
  {
    icon: Compass,
    title: 'Discover Opportunities',
    description: 'Explore rooms for hackathons, projects, clubs, research and more.',
    tone: 'auth-feature-violet',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Get personalized recommendations based on your profile and preferences.',
    tone: 'auth-feature-green',
  },
  {
    icon: Bell,
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications, applications and invitations.',
    tone: 'auth-feature-yellow',
  },
];

const TeamIllustration = () => (
  <svg className="auth-team-illustration" viewBox="0 0 360 172" role="img" aria-label="Students collaborating around a laptop">
    <ellipse cx="180" cy="157" rx="154" ry="11" fill="#dbeeff" />
    <path d="M28 144c10-26 25-37 40-34 10-27 32-39 53-30 14-25 38-29 59-13 20-26 50-22 67-4 22-21 51-11 61 15 17 3 29 22 36 66H28Z" fill="#d8efff" />
    <circle cx="93" cy="71" r="20" fill="#f0b68e" />
    <path d="M72 73c0-20 10-31 24-31 12 0 21 9 21 25-8-3-13-9-15-16-7 10-17 16-30 18Z" fill="#253f70" />
    <path d="M56 143c2-32 14-50 38-50 23 0 36 18 39 50Z" fill="#f4b72f" />
    <circle cx="155" cy="55" r="22" fill="#c98260" />
    <path d="M132 58c0-19 10-32 25-32 14 0 24 11 23 29-9-5-16-11-19-19-7 9-17 16-29 22Z" fill="#263f6f" />
    <path d="M116 143c1-33 15-52 39-52 26 0 39 19 42 52Z" fill="#3978e8" />
    <circle cx="225" cy="70" r="20" fill="#e7a67e" />
    <path d="M204 71c0-20 10-31 24-31 13 0 21 10 21 25-8-2-14-8-17-15-7 10-16 17-28 21Z" fill="#263f6f" />
    <path d="M190 143c2-32 14-49 37-49s36 17 39 49Z" fill="#31b890" />
    <circle cx="282" cy="91" r="17" fill="#f1bd98" />
    <path d="M264 92c0-16 8-26 20-26 12 0 19 9 19 23-8-2-13-7-15-13-6 8-14 13-24 16Z" fill="#263f6f" />
    <path d="M251 144c2-26 12-40 31-40 20 0 30 14 32 40Z" fill="#4f67d8" />
    <path d="M92 135h177l-12 22H104l-12-22Z" fill="#1c3764" />
    <path d="M111 137h139l-8 14H119l-8-14Z" fill="#edf7ff" />
    <rect x="167" y="141" width="27" height="2" rx="1" fill="#9ebfe2" />
    <path d="M22 130c-3-14 4-25 15-28-1 13-6 22-15 28Zm300-17c1-15 10-23 21-23-4 13-11 20-21 23Z" fill="#53c8c0" />
  </svg>
);

const AuthFeaturePanel = () => (
  <aside className="auth-feature-panel h-full w-full p-6 sm:p-8 lg:p-9">
    <div className="flex items-center gap-3">
      <span className="app-brand-mark flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm">
        <Layers className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="text-2xl font-bold tracking-tight text-slate-900">TeamUp</span>
    </div>
    <p className="mt-3 text-xs font-medium tracking-wide text-slate-500">Connect <span className="mx-2 text-blue-300">|</span> Collaborate <span className="mx-2 text-blue-300">|</span> Build</p>

    <div className="mt-8">
      <h1 className="max-w-sm text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-[1.75rem]">
        Join a community of learners, creators and doers.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        Find the right teammates, join exciting projects, and turn your ideas into reality.
      </p>
    </div>

    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {features.map(({ icon: Icon, title, description, tone }) => (
        <div key={title} className="flex items-center gap-3">
          <span className={`auth-feature-icon ${tone}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xs font-semibold text-slate-800">{title}</h2>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{description}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-5 hidden lg:block"><TeamIllustration /></div>
  </aside>
);

export default AuthFeaturePanel;
