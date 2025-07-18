import React from 'react';
import { Box, Typography } from '@mui/material';

const Timetable = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Timetable
            </Typography>
            <Typography variant="body1">
                This is the Timetable management page. Assigning teachers and subjects to time slots will be implemented here.
            </Typography>
        </Box>
    );
};

export default Timetable;