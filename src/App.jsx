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
import AdminDashboard from './pages/admin/AdminDashboard';
import Students from './pages/admin_modules/Students';
import Teachers from './pages/admin_modules/Teachers';
import Classes from './pages/admin_modules/Classes';
import Sections from './pages/admin_modules/Sections';
import Subjects from './pages/admin_modules/Subjects';
import Timetable from './pages/admin_modules/Timetable';
import Attendance from './pages/admin_modules/Attendance';
import Fees from './pages/admin_modules/Fees';
import OverviewDashboard from './pages/admin_modules/OverviewDashboard';
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
      <Route
        path="/school/admin"
        element={<PrivateRoute roles={['school']}><AdminDashboard /></PrivateRoute>}
      />
      <Route
        path="/school/admin/students"
        element={<PrivateRoute roles={['school']}><Students /></PrivateRoute>}
      />
      <Route
        path="/school/admin/teachers"
        element={<PrivateRoute roles={['school']}><Teachers /></PrivateRoute>}
      />
      <Route
        path="/school/admin/classes"
        element={<PrivateRoute roles={['school']}><Classes /></PrivateRoute>}
      />
      <Route
        path="/school/admin/sections"
        element={<PrivateRoute roles={['school']}><Sections /></PrivateRoute>}
      />
      <Route
        path="/school/admin/subjects"
        element={<PrivateRoute roles={['school']}><Subjects /></PrivateRoute>}
      />
      <Route
        path="/school/admin/timetable"
        element={<PrivateRoute roles={['school']}><Timetable /></PrivateRoute>}
      />
      <Route
        path="/school/admin/attendance"
        element={<PrivateRoute roles={['school']}><Attendance /></PrivateRoute>}
      />
      <Route
        path="/school/admin/fees"
        element={<PrivateRoute roles={['school']}><Fees /></PrivateRoute>}
      />
      <Route
        path="/school/admin/dashboard"
        element={<PrivateRoute roles={['school']}><OverviewDashboard /></PrivateRoute>}
      />
    </Routes>
  );
}

export default App;              