import React, { useEffect , useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Container, Paper, Box, Button, Typography, Stepper, Step, StepLabel } from '@mui/material';
import Step0 from '../components/registration/Step0';
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
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/register';

const steps = [
    'Account Setup',
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

    const { registerSchoolUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            // First, complete the registration on the backend
            await axios.post(`${API_URL}/complete`, { sessionId, data: formData });

            // Then, register the school user for authentication
            const registrationData = {
                ...formData,
                email: formData.email, // Ensure email is passed for user registration
                password: formData.password,
            };
            await registerSchoolUser(registrationData);

            localStorage.removeItem('registrationSessionId');
            alert('School registration complete! You are now logged in.');
            dispatch(resetRegistration());
            navigate('/school/admin'); // Redirect to admin dashboard
        } catch (err) {
            console.error('Failed to complete registration or login:', err);
            alert('There was an error completing your registration. Please try again.');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step0 />;
            case 2:
                return <Step1 />;
            case 3:
                return <Step2 />;
            case 4:
                return <Step3 />;
            case 5:
                return <Step4 />;
            case 6:
                return <Step5 />;
            case 7:
                return <Step6 />;
            case 8:
                return <Step7 />;
            case 9:
                return <Step8 />;
            case 10:
                return <Step9 />;
            case 11:
                return <Step10 />;
            default:
                return <Step0 />;
        }
    };

    return (
        <Container component="main" maxWidth="lg" className="p-4">
            <Paper elevation={6} className="p-8">
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
                <Box className="flex justify-between w-full mt-8">
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