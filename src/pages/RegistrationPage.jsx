import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Container, Paper, Box, Button, Typography, Stepper, Step, StepLabel } from '@mui/material';
import Step1 from '../components/registration/Step1';
import Step2 from '../components/registration/Step2';
import Step3 from '../components/registration/Step3';
import Step4 from '../components/registration/Step4';
import Step5 from '../components/registration/Step5';
import Step6 from '../components/registration/Step6';
import Step7 from '../components/registration/Step7';
import Step8 from '../components/registration/Step8';
import Step9 from '../components/registration/Step9';
import Step10 from '../components/registration/Step10';
import {
    setSessionId,
    setCurrentStep,
    setFormData,
    resetRegistration,
} from '../features/registration/registrationSlice';

const API_URL = 'http://localhost:5000/api/register';

const steps = [
    'Basic Information',
    'Detailed Information',
    'Address',
    'Contact Persons',
    'Academics',
    'Infrastructure & Staff',
    'Branding & Customization',
    'App & Module Preferences',
    'Document Upload',
    'Legal & Review',
];

const RegistrationPage = () => {
    const dispatch = useDispatch();
    const { sessionId, currentStep, formData } = useSelector(
        (state) => state.registration
    );

    useEffect(() => {
        const initializeSession = async () => {
            const storedSessionId = localStorage.getItem('registrationSessionId');
            if (storedSessionId) {
                try {
                    const res = await axios.get(`${API_URL}/${storedSessionId}`);
                    if (res.data.success) {
                        dispatch(setSessionId(storedSessionId));
                        dispatch(setFormData(res.data.data.data));
                        dispatch(setCurrentStep(res.data.data.currentStep));
                        return;
                    }
                } catch (error) {
                    console.error('Failed to fetch session, creating a new one.', error);
                }
            }

            const newSessionId = uuidv4();
            dispatch(resetRegistration());
            dispatch(setSessionId(newSessionId));
            localStorage.setItem('registrationSessionId', newSessionId);
        };

        initializeSession();
    }, [dispatch]);

    const nextStep = () => {
        axios.post(`${API_URL}/incomplete`, {
            sessionId,
            currentStep: currentStep + 1,
            data: formData,
        }).catch(err => {
            console.error('Failed to save incomplete registration', err);
            alert('There was an error saving your progress. Please try again.');
        });
        dispatch(setCurrentStep(currentStep + 1));
    };

    const prevStep = () => {
        dispatch(setCurrentStep(currentStep - 1));
    };

    const handleSubmit = () => {
        axios
            .post(`${API_URL}/complete`, { sessionId, data: formData })
            .then(() => {
                localStorage.removeItem('registrationSessionId');
                alert('Registration complete!');
                dispatch(resetRegistration());
            })
            .catch(err => {
                console.error('Failed to submit registration', err);
                alert('There was an error submitting your registration.');
            });
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1 />;
            case 2:
                return <Step2 />;
            case 3:
                return <Step3 />;
            case 4:
                return <Step4 />;
            case 5:
                return <Step5 />;
            case 6:
                return <Step6 />;
            case 7:
                return <Step7 />;
            case 8:
                return <Step8 />;
            case 9:
                return <Step9 />;
            case 10:
                return <Step10 />;
            default:
                return <Step1 />;
        }
    };

    return (
        <Container component="main" maxWidth="lg" className="p-4">
            <Paper sx={{
                paddingX:16,
                paddingY:10
            }} elevation={6} className="p-8 flex flex-col items-center space-y-6 w-full">
                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    School Registration
                </Typography>
                <Stepper activeStep={currentStep - 1} alternativeLabel className="mb-8">
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box className="w-full">
                    {renderStep()}
                </Box>
                <Box className={`flex ${currentStep <= 1 ? "justify-end" : "justify-between"} w-full mt-8`}>
                    {currentStep > 1 && (
                        <Button
                            onClick={prevStep}
                            variant="outlined"
                        >
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length && (
                        <Button
                            onClick={nextStep}
                            variant="contained"
                        >
                            Next
                        </Button>
                    )}
                    {currentStep === steps.length && (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default RegistrationPage;