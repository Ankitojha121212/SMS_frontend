import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography, MenuItem } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step5 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 5: Academics
            </Typography>
            <TextField
                label="Academic Session Start Month"
                name="academicSessionStartMonth"
                value={formData.academicSessionStartMonth || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Classes Offered (comma-separated)"
                name="classesOffered"
                value={formData.classesOffered || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Streams Offered (comma-separated)"
                name="streamsOffered"
                value={formData.streamsOffered || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Languages Taught (comma-separated)"
                name="languagesTaught"
                value={formData.languagesTaught || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Medium"
                name="medium"
                value={formData.medium || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step5;