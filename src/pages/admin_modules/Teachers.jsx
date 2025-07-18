import React from 'react';
import { Box, Typography } from '@mui/material';

const Teachers = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Teachers
            </Typography>
            <Typography variant="body1">
                This is the Teachers management page. CRUD operations and assignment will be implemented here.
            </Typography>
        </Box>
    );
};

export default Teachers;