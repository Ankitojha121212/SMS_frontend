import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Step9 = () => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 9: Document Upload
            </Typography>
            <Box mt={2}>
                <Typography variant="subtitle1">Government Recognition Certificate</Typography>
                <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden />
                </Button>
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">Principal ID Proof</Typography>
                <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden />
                </Button>
            </Box>
            <Box mt={2}>
                <Typography variant="subtitle1">School Seal Image</Typography>
                <Button variant="contained" component="label">
                    Upload File
                    <input type="file" hidden />
                </Button>
            </Box>
        </Box>
    );
};

export default Step9;