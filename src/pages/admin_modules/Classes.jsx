import React from 'react';
import { Box, Typography } from '@mui/material';

const Classes = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Classes
            </Typography>
            <Typography variant="body1">
                This is the Classes management page. Class creation and section attachment will be implemented here.
            </Typography>
        </Box>
    );
};

export default Classes;