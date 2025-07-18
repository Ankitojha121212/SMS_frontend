import React from 'react';
import { Typography, Container, Box } from '@mui/material';

function HomePage() {
  return (
    <Container component="main" maxWidth="md" className="flex items-center justify-center min-h-screen">
      <Box className="p-8 flex flex-col items-center space-y-6 w-full">
        <Typography component="h1" variant="h4">
          Welcome to the School Management System!
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the home page. Content will vary based on user role.
        </Typography>
      </Box>
    </Container>
  );
}

export default HomePage;
