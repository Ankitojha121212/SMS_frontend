import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step11 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 11: Account Setup
            </Typography>
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />
        </Box>
    );
};

export default Step11;