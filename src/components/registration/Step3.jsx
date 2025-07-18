import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step3 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 3: Address
            </Typography>
            <TextField
                label="Country"
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="State"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="City"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="PIN Code"
                name="pinCode"
                value={formData.pinCode || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address Line 1"
                name="addressLine1"
                value={formData.addressLine1 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Address Line 2"
                name="addressLine2"
                value={formData.addressLine2 || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step3;