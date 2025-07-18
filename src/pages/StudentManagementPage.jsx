import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    dob: '',
    class: '',
    admissionNo: '',
    rollNo: '',
    academicYear: '',
    phone: '',
    address: '',
    parentId: '',
    transportOpted: false,
    hostelOpted: false,
    profilePhoto: '',
  });
  const user = getCurrentUser();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetchData('students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleOpenDialog = (student = null) => {
    setCurrentStudent(student);
    if (student) {
      setFormValues({
        fullName: student.fullName || '',
        email: student.userId.email || '',
        password: '', // Password should not be pre-filled for security
        gender: student.gender || '',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
        class: student.class || '',
        admissionNo: student.admissionNo || '',
        rollNo: student.rollNo || '',
        academicYear: student.academicYear || '',
        phone: student.phone || '',
        address: student.address || '',
        parentId: student.parentId?._id || '',
        transportOpted: student.transportOpted || false,
        hostelOpted: student.hostelOpted || false,
        profilePhoto: student.profilePhoto || '',
      });
    } else {
      setFormValues({
        fullName: '',
        email: '',
        password: '',
        gender: '',
        dob: '',
        class: '',
        admissionNo: '',
        rollNo: '',
        academicYear: '',
        phone: '',
        address: '',
        parentId: '',
        transportOpted: false,
        hostelOpted: false,
        profilePhoto: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStudent(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentStudent) {
        // Update student
        await fetchData(`students/${currentStudent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      } else {
        // Create new student
        await fetchData('students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      }
      fetchStudents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await fetchData(`students/${studentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Error deleting student: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography component="h1" variant="h5">
            Student Management
          </Typography>
          {user && user.role === 'school' && (
            <Button variant="contained" onClick={() => handleOpenDialog()}>Add New Student</Button>
          )}
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Admission No.</TableCell>
                <TableCell>Roll No.</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>{student.userId?.email}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.admissionNo}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(student)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(student._id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{currentStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
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
                disabled={!!currentStudent} // Disable email edit for existing students
              />
              {!currentStudent && (
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
                name="class"
                label="Class"
                type="text"
                fullWidth
                value={formValues.class}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="admissionNo"
                label="Admission No."
                type="text"
                fullWidth
                value={formValues.admissionNo}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="rollNo"
                label="Roll No."
                type="text"
                fullWidth
                value={formValues.rollNo}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="academicYear"
                label="Academic Year"
                type="text"
                fullWidth
                value={formValues.academicYear}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="phone"
                label="Phone"
                type="text"
                fullWidth
                value={formValues.phone}
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
              {/* ParentId field - will need to be populated with actual parent options later */}
              <TextField
                margin="dense"
                name="parentId"
                label="Parent ID (Optional)"
                type="text"
                fullWidth
                value={formValues.parentId}
                onChange={handleChange}
              />
              <FormControl margin="dense" fullWidth>
                <InputLabel>Transport Opted</InputLabel>
                <Select
                  name="transportOpted"
                  value={formValues.transportOpted}
                  onChange={handleChange}
                  label="Transport Opted"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
              <FormControl margin="dense" fullWidth>
                <InputLabel>Hostel Opted</InputLabel>
                <Select
                  name="hostelOpted"
                  value={formValues.hostelOpted}
                  onChange={handleChange}
                  label="Hostel Opted"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
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
            <Button onClick={handleSubmit} variant="contained">{currentStudent ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default StudentManagementPage;
