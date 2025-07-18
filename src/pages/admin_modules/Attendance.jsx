import React from 'react';
import { Box, Typography } from '@mui/material';

const Attendance = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Attendance
            </Typography>
            <Typography variant="body1">
                This is the Attendance management page. Marking and viewing attendance will be implemented here.
            </Typography>
        </Box>
    );
};

export default Attendance;