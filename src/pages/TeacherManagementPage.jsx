import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function TeacherManagementPage() {
  const [teachers, setTeachers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    qualification: '',
    subjectSpecialization: '',
    classesAssigned: '',
    joiningDate: '',
    experience: '',
    address: '',
    profilePhoto: '',
  });
  const user = getCurrentUser();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetchData('teachers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTeachers(response);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleOpenDialog = (teacher = null) => {
    setCurrentTeacher(teacher);
    if (teacher) {
      setFormValues({
        fullName: teacher.fullName || '',
        email: teacher.userId.email || '',
        password: '', // Password should not be pre-filled for security
        gender: teacher.gender || '',
        dob: teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : '',
        qualification: teacher.qualification || '',
        subjectSpecialization: teacher.subjectSpecialization.join(', ') || '',
        classesAssigned: teacher.classesAssigned.join(', ') || '',
        joiningDate: teacher.joiningDate ? new Date(teacher.joiningDate).toISOString().split('T')[0] : '',
        experience: teacher.experience || '',
        address: teacher.address || '',
        profilePhoto: teacher.profilePhoto || '',
      });
    } else {
      setFormValues({
        fullName: '',
        email: '',
        password: '',
        gender: '',
        dob: '',
        qualification: '',
        subjectSpecialization: '',
        classesAssigned: '',
        joiningDate: '',
        experience: '',
        address: '',
        profilePhoto: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTeacher(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formValues,
        subjectSpecialization: formValues.subjectSpecialization.split(',').map(s => s.trim()),
        classesAssigned: formValues.classesAssigned.split(',').map(c => c.trim()),
      };

      if (currentTeacher) {
        // Update teacher
        await fetchData(`teachers/${currentTeacher._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new teacher
        await fetchData('teachers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        });
      }
      fetchTeachers();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Error saving teacher: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (teacherId) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await fetchData(`teachers/${teacherId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Error deleting teacher: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography component="h1" variant="h5">
            Teacher Management
          </Typography>
          {user && user.role === 'school' && (
            <Button variant="contained" onClick={() => handleOpenDialog()}>Add New Teacher</Button>
          )}
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Qualification</TableCell>
                <TableCell>Subjects</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.fullName}</TableCell>
                  <TableCell>{teacher.userId?.email}</TableCell>
                  <TableCell>{teacher.qualification}</TableCell>
                  <TableCell>{teacher.subjectSpecialization.join(', ')}</TableCell>
                  <TableCell>{teacher.classesAssigned.join(', ')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(teacher)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(teacher._id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{currentTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
              <TextField
                margin="dense"
                name="fullName"
                label="Full Name"
                type="text"
                fullWidth
                value={formValues.fullName}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formValues.email}
                onChange={handleChange}
                disabled={!!currentTeacher} // Disable email edit for existing teachers
              />
              {!currentTeacher && (
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={formValues.password}
                  onChange={handleChange}
                />
              )}
              <FormControl margin="dense" fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formValues.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="dob"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formValues.dob}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="qualification"
                label="Qualification"
                type="text"
                fullWidth
                value={formValues.qualification}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="subjectSpecialization"
                label="Subject Specialization (comma-separated)"
                type="text"
                fullWidth
                value={formValues.subjectSpecialization}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="classesAssigned"
                label="Classes Assigned (comma-separated)"
                type="text"
                fullWidth
                value={formValues.classesAssigned}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="joiningDate"
                label="Joining Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formValues.joiningDate}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="experience"
                label="Experience (years)"
                type="number"
                fullWidth
                value={formValues.experience}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                value={formValues.address}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="profilePhoto"
                label="Profile Photo URL (Optional)"
                type="text"
                fullWidth
                value={formValues.profilePhoto}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">{currentTeacher ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default TeacherManagementPage;
