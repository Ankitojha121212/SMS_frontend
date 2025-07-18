import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step6 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        dispatch(setFormData({ [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 6: Infrastructure & Staff
            </Typography>
            <TextField
                label="Total Students"
                name="totalStudents"
                type="number"
                value={formData.totalStudents || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Teachers"
                name="totalTeachers"
                type="number"
                value={formData.totalTeachers || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Total Non-Teaching Staff"
                name="totalNonTeachingStaff"
                type="number"
                value={formData.totalNonTeachingStaff || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.hasHostel || false}
                        onChange={handleChange}
                        name="hasHostel"
                    />
                }
                label="Has Hostel"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.hasTransport || false}
                        onChange={handleChange}
                        name="hasTransport"
                    />
                }
                label="Has Transport"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.hasSmartClasses || false}
                        onChange={handleChange}
                        name="hasSmartClasses"
                    />
                }
                label="Has Smart Classes"
            />
            <TextField
                label="Number of Labs"
                name="noOfLabs"
                type="number"
                value={formData.noOfLabs || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Number of Libraries"
                name="noOfLibraries"
                type="number"
                value={formData.noOfLibraries || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Sports Facilities (comma-separated)"
                name="sportsFacilities"
                value={formData.sportsFacilities || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step6;