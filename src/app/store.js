import { configureStore } from '@reduxjs/toolkit';
import registrationReducer from '../features/registration/registrationSlice';

export const store = configureStore({
    reducer: {
        registration: registrationReducer,
    },
});