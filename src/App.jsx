import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationPage from './pages/RegistrationPage';
import SchoolDashboard from './pages/school/SchoolDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ParentDashboard from './pages/parent/ParentDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route
        path="/school-dashboard"
        element={<PrivateRoute roles={['school']}><SchoolDashboard /></PrivateRoute>}
      />
      <Route
        path="/teacher-dashboard"
        element={<PrivateRoute roles={['teacher']}><TeacherDashboard /></PrivateRoute>}
      />
      <Route
        path="/parent-dashboard"
        element={<PrivateRoute roles={['parent']}><ParentDashboard /></PrivateRoute>}
      />
      <Route
        path="/student-dashboard"
        element={<PrivateRoute roles={['student']}><StudentDashboard /></PrivateRoute>}
      />
      <Route
        path="/superadmin-dashboard"
        element={<PrivateRoute roles={['superadmin']}><SuperAdminDashboard /></PrivateRoute>}
      />
    </Routes>
  );
}

export default App;              