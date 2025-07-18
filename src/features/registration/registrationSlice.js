import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sessionId: null,
    currentStep: 1,
    formData: {},
};

const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        setSessionId: (state, action) => {
            state.sessionId = action.payload;
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        setFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        resetRegistration: () => initialState,
    },
});

export const {
    setSessionId,
    setCurrentStep,
    setFormData,
    resetRegistration,
} = registrationSlice.actions;

export default registrationSlice.reducer;