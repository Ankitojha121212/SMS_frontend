import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

const OverviewDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        presentStudentsToday: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found.');
                    setLoading(false);
                    return;
                }
                const config = {
                    headers: {
                        'x-auth-token': token,
                    },
                };
                const res = await axios.get('http://localhost:5000/api/admin/dashboard/stats', config);
                setStats(res.data.data);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Failed to load dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Typography>Loading dashboard stats...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Overview Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Total Students
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {stats.totalStudents}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Total Teachers
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {stats.totalTeachers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Students Present Today
                            </Typography>
                            <Typography variant="h3" color="primary">
                                {stats.presentStudentsToday}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Add more cards for other stats or charts */}
            </Grid>
        </Box>
    );
};

export default OverviewDashboard;