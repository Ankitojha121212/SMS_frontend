import React from 'react';
import { Box, Typography } from '@mui/material';

const Students = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Students
            </Typography>
            <Typography variant="body1">
                This is the Students management page. CRUD operations and search/filter will be implemented here.
            </Typography>
        </Box>
    );
};

export default Students;