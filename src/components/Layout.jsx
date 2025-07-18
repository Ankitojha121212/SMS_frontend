import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';

function Layout() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>
          {user && (
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Welcome, {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Typography>
          )}
          <Box>
            {user ? (
              <>
                <Button color="inherit" component={Link} to="/home">Home</Button>
                {user.role === 'school' && (
                  <>
                    <Button color="inherit" component={Link} to="/school-dashboard">Dashboard</Button>
                    <Button color="inherit" component={Link} to="/student-management">Student Management</Button>
                  </>
                )}
                {user.role === 'teacher' && (
                  <Button color="inherit" component={Link} to="/teacher-dashboard">Dashboard</Button>
                )}
                {user.role === 'parent' && (
                  <Button color="inherit" component={Link} to="/parent-dashboard">Dashboard</Button>
                )}
                {user.role === 'student' && (
                  <Button color="inherit" component={Link} to="/student-dashboard">Dashboard</Button>
                )}
                {(user.role === 'school' || user.role === 'parent' || user.role === 'student') && (
                  <Button color="inherit" component={Link} to="/fees">Fees</Button>
                )}
                {(user.role === 'school' || user.role === 'teacher' || user.role === 'parent') && (
                  <Button color="inherit" component={Link} to="/attendance">Attendance</Button>
                )}
                {(user.role === 'school' || user.role === 'teacher') && (
                  <Button color="inherit" component={Link} to="/reports">Reports</Button>
                )}
                {(user.role === 'school' || user.role === 'teacher' || user.role === 'student') && (
                  <Button color="inherit" component={Link} to="/study-material">Study Material</Button>
                )}
                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">Login</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout;
