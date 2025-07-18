import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import CategoryIcon from '@mui/icons-material/Category';
import SubjectIcon from '@mui/icons-material/Subject';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';

const AdminDashboard = () => {
    const modules = [
        {
            title: 'Manage Students',
            description: 'Add, edit, and view student information.',
            icon: <GroupIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/students',
        },
        {
            title: 'Manage Teachers',
            description: 'Manage teacher profiles and assignments.',
            icon: <PersonIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/teachers',
        },
        {
            title: 'Manage Classes',
            description: 'Create and organize academic classes.',
            icon: <ClassIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/classes',
        },
        {
            title: 'Manage Sections',
            description: 'Define sections for each class.',
            icon: <CategoryIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/sections',
        },
        {
            title: 'Manage Subjects',
            description: 'Add and assign subjects to classes.',
            icon: <SubjectIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/subjects',
        },
        {
            title: 'Manage Timetable',
            description: 'Create and manage school timetables.',
            icon: <CalendarMonthIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/timetable',
        },
        {
            title: 'Manage Attendance',
            description: 'Mark and view student attendance.',
            icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/attendance',
        },
        {
            title: 'Manage Fees',
            description: 'Define fee structures and track payments.',
            icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/fees',
        },
        {
            title: 'Overview Dashboard',
            description: 'View key statistics and school performance.',
            icon: <DashboardIcon sx={{ fontSize: 40 }} />,
            path: '/school/admin/dashboard',
        },
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                School Admin Dashboard
            </Typography>
            <Grid container spacing={3}>
                {modules.map((module, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card raised sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    {module.icon}
                                </Box>
                                <Typography variant="h6" component="h2" gutterBottom>
                                    {module.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {module.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                                <Button
                                    component={Link}
                                    to={module.path}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                >
                                    Go to Module
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AdminDashboard;