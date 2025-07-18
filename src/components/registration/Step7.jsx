import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step7 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 7: Branding & Customization
            </Typography>
            <TextField
                label="Logo URL"
                name="logo"
                value={formData.logo || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Theme Color"
                name="themeColor"
                type="color"
                value={formData.themeColor || '#ffffff'}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Accent Color"
                name="accentColor"
                type="color"
                value={formData.accentColor || '#000000'}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Font Preference"
                name="fontPreference"
                value={formData.fontPreference || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step7;