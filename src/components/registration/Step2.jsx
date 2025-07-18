import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Typography, MenuItem } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step2 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        dispatch(setFormData({ [e.target.name]: e.target.value }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 2: Detailed Information
            </Typography>
            <TextField
                label="School Code"
                name="schoolCode"
                value={formData.schoolCode || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Type"
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="school">School</MenuItem>
                <MenuItem value="college">College</MenuItem>
                <MenuItem value="university">University</MenuItem>
                <MenuItem value="coaching">Coaching</MenuItem>
            </TextField>
            <TextField
                label="Established Year"
                name="establishedYear"
                type="number"
                value={formData.establishedYear || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Ownership"
                name="ownership"
                value={formData.ownership || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="government">Government</MenuItem>
                <MenuItem value="aided">Aided</MenuItem>
                <MenuItem value="trust">Trust</MenuItem>
            </TextField>
            <TextField
                label="Board"
                name="board"
                value={formData.board || ''}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
        </Box>
    );
};

export default Step2;