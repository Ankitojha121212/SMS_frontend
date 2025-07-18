import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step8 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        dispatch(setFormData({ [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 8: App & Module Preferences
            </Typography>
            <TextField
                label="Primary Language"
                name="primaryLanguage"
                value={formData.primaryLanguage || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Timezone"
                name="timezone"
                value={formData.timezone || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Preferred Login Method"
                name="preferredLoginMethod"
                value={formData.preferredLoginMethod || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Phone</MenuItem>
                <MenuItem value="username">Username</MenuItem>
            </TextField>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.hasStudentAppAccess || false}
                        onChange={handleChange}
                        name="hasStudentAppAccess"
                    />
                }
                label="Has Student App Access"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.hasParentAppAccess || false}
                        onChange={handleChange}
                        name="hasParentAppAccess"
                    />
                }
                label="Has Parent App Access"
            />
            <TextField
                label="Modules Enabled (comma-separated)"
                name="modulesEnabled"
                value={formData.modulesEnabled || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.needsOnlineClasses || false}
                        onChange={handleChange}
                        name="needsOnlineClasses"
                    />
                }
                label="Needs Online Classes"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.needsPaymentIntegration || false}
                        onChange={handleChange}
                        name="needsPaymentIntegration"
                    />
                }
                label="Needs Payment Integration"
            />
        </Box>
    );
};

export default Step8;