import React from 'react';
import { Typography, Box, Container } from '@mui/material';

function StudyMaterialPage() {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Study Material
        </Typography>
        <Typography variant="body1">
          This page will provide access to study materials, notes, and resources.
        </Typography>
      </Box>
    </Container>
  );
}

export default StudyMaterialPage;
