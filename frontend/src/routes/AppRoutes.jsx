import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoutes from './ProtectedRoutes.jsx';
import AppLayout from '../components/common/AppLayout.jsx';

// Pages
import Home from '../pages/Home.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';

import Dashboard from '../pages/Dashboard.jsx';

import Profile from '../pages/profile/Profile.jsx';
import EditProfile from '../pages/profile/EditProfile.jsx';
import MyProjects from '../pages/profile/MyProjects.jsx';
import MySkills from '../pages/profile/MySkills.jsx';
import MyInterests from '../pages/profile/MyInterests.jsx';

import ExploreRooms from '../pages/rooms/ExploreRooms.jsx';
import CreateRoom from '../pages/rooms/CreateRoom.jsx';
import EditRoom from '../pages/rooms/EditRoom.jsx';
import RoomDetails from '../pages/rooms/RoomDetails.jsx';
import MyRooms from '../pages/rooms/MyRooms.jsx';
import RoomRequests from '../pages/rooms/RoomRequests.jsx';

import TeamDashboard from '../pages/team/TeamDashboard.jsx';
import TeamMembers from '../pages/team/TeamMembers.jsx';
import TeamAgenda from '../pages/team/TeamAgenda.jsx';
import TeamUpdates from '../pages/team/TeamUpdates.jsx';
import TeamActivity from '../pages/team/TeamActivity.jsx';

import RecommendedRooms from '../pages/matching/RecommendedRooms.jsx';
import RecommendedStudents from '../pages/matching/RecommendedStudents.jsx';

import Notifications from '../pages/notifications/Notifications.jsx';
import Applications from '../pages/notifications/Applications.jsx';
import Invitations from '../pages/notifications/Invitations.jsx';

import NotFound from '../pages/NotFound.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Pages within AppLayout */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/projects" element={<MyProjects />} />
          <Route path="/profile/skills" element={<MySkills />} />
          <Route path="/profile/interests" element={<MyInterests />} />

          {/* Rooms */}
          <Route path="/rooms" element={<ExploreRooms />} />
          <Route path="/rooms/create" element={<CreateRoom />} />
          <Route path="/rooms/my-rooms" element={<MyRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/rooms/:id/edit" element={<EditRoom />} />
          <Route path="/rooms/:id/requests" element={<RoomRequests />} />
          <Route path="/rooms/:id/candidates" element={<RecommendedStudents />} />

          {/* Team Workspace */}
          <Route path="/team" element={<TeamDashboard />} />
          <Route path="/team/:id" element={<TeamDashboard />} />
          <Route path="/team/:id/members" element={<TeamMembers />} />
          <Route path="/team/:id/agenda" element={<TeamAgenda />} />
          <Route path="/team/:id/updates" element={<TeamUpdates />} />
          <Route path="/team/:id/activity" element={<TeamActivity />} />

          {/* Matching Engine */}
          <Route path="/matching" element={<RecommendedRooms />} />
          <Route path="/matching/students" element={<RecommendedStudents />} />

          {/* Notifications & Requests */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/applications" element={<Applications />} />
          <Route path="/notifications/invitations" element={<Invitations />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
