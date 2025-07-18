import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step1 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 1: Basic Information
            </Typography>
            <TextField
                label="School Name"
                name="schoolName"
                value={formData.schoolName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Primary Phone"
                name="primaryPhone"
                value={formData.primaryPhone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Alternate Phone"
                name="alternatePhone"
                value={formData.alternatePhone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="WhatsApp Number"
                name="whatsappNumber"
                value={formData.whatsappNumber || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step1;