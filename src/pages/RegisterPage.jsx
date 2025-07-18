import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signupUser } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signupUser({ name, email, password, role });
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="flex items-center justify-center min-h-screen p-8 sm:p-10 md:p-12">
      <Paper elevation={6} className="p-8 flex flex-col items-center space-y-6 w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        <Typography component="h1" variant="h5" className="text-2xl font-bold">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="w-full space-y-4">
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-label">Register As</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              label="Register As"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="school">School</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography variant="body2" className="text-center">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;
