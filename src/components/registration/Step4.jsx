import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step4 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 4: Contact Persons
            </Typography>
            <TextField
                label="Principal Name"
                name="principalName"
                value={formData.principalName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Principal Phone"
                name="principalPhone"
                value={formData.principalPhone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Principal Email"
                name="principalEmail"
                type="email"
                value={formData.principalEmail || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Admin Name"
                name="adminName"
                value={formData.adminName || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Admin Phone"
                name="adminPhone"
                value={formData.adminPhone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step4;