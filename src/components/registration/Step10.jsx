import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { setFormData } from '../../features/registration/registrationSlice';

const Step10 = () => {
    const dispatch = useDispatch();
    const { formData } = useSelector((state) => state.registration);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        dispatch(setFormData({ [name]: checked }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Step 10: Legal & Review
            </Typography>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.acceptsDataPolicy || false}
                        onChange={handleChange}
                        name="acceptsDataPolicy"
                    />
                }
                label="I accept the Data Policy"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.agreedToTerms || false}
                        onChange={handleChange}
                        name="agreedToTerms"
                    />
                }
                label="I agree to the Terms and Conditions"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formData.marketingConsent || false}
                        onChange={handleChange}
                        name="marketingConsent"
                    />
                }
                label="I consent to receive marketing communications"
            />

            <Box mt={4}>
                <Typography variant="h6">Review Information</Typography>
                <Divider sx={{ my: 2 }} />
                {Object.entries(formData).map(([key, value]) => (
                    <Typography key={key}>
                        <strong>{key}:</strong> {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
};

export default Step10;