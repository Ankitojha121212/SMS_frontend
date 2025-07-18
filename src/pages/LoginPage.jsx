import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser, user } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginUser(email, password);
      if (user) {
        switch (user.role) {
          case 'school':
            navigate('/school-dashboard');
            break;
          case 'teacher':
            navigate('/teacher-dashboard');
            break;
          case 'parent':
            navigate('/parent-dashboard');
            break;
          case 'student':
            navigate('/student-dashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="flex items-center justify-center min-h-screen p-8 sm:p-10 md:p-12">
      <Paper elevation={6} className="p-8 flex flex-col items-center space-y-6 w-full md:w-3/4 lg:w-1/2 xl:w-1/3">
        <Typography component="h1" variant="h5" className="text-2xl font-bold">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="w-full space-y-4">
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Typography variant="body2" className="text-center">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;
