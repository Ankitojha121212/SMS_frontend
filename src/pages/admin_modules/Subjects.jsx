import React from 'react';
import { Box, Typography } from '@mui/material';

const Subjects = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Subjects
            </Typography>
            <Typography variant="body1">
                This is the Subjects management page. Adding/editing subjects and assigning them to classes will be implemented here.
            </Typography>
        </Box>
    );
};

export default Subjects;