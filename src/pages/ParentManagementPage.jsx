import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function ParentManagementPage() {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]); // To fetch students for linking
  const [openDialog, setOpenDialog] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: [], // Array of student IDs
    relation: '',
    address: '',
    preferredLanguage: '',
    profilePhoto: '',
  });
  const user = getCurrentUser();

  useEffect(() => {
    fetchParents();
    fetchStudentsForLinking();
  }, []);

  const fetchParents = async () => {
    try {
      const response = await fetchData('parents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setParents(response);
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const fetchStudentsForLinking = async () => {
    try {
      const response = await fetchData('students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students for linking:', error);
    }
  };

  const handleOpenDialog = (parent = null) => {
    setCurrentParent(parent);
    if (parent) {
      setFormValues({
        fullName: parent.fullName || '',
        email: parent.userId.email || '',
        password: '', // Password should not be pre-filled for security
        studentId: parent.studentId.map(s => s._id) || [],
        relation: parent.relation || '',
        address: parent.address || '',
        preferredLanguage: parent.preferredLanguage || '',
        profilePhoto: parent.profilePhoto || '',
      });
    } else {
      setFormValues({
        fullName: '',
        email: '',
        password: '',
        studentId: [],
        relation: '',
        address: '',
        preferredLanguage: '',
        profilePhoto: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentParent(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleStudentChange = (e) => {
    const { value } = e.target;
    setFormValues({
      ...formValues,
      studentId: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentParent) {
        // Update parent
        await fetchData(`parents/${currentParent._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      } else {
        // Create new parent
        await fetchData('parents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      }
      fetchParents();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving parent:', error);
      alert('Error saving parent: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (parentId) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await fetchData(`parents/${parentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchParents();
      } catch (error) {
        console.error('Error deleting parent:', error);
        alert('Error deleting parent: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography component="h1" variant="h5">
            Parent Management
          </Typography>
          {user && user.role === 'school' && (
            <Button variant="contained" onClick={() => handleOpenDialog()}>Add New Parent</Button>
          )}
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Relation</TableCell>
                <TableCell>Linked Students</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parents.map((parent) => (
                <TableRow key={parent._id}>
                  <TableCell>{parent.fullName}</TableCell>
                  <TableCell>{parent.userId?.email}</TableCell>
                  <TableCell>{parent.relation}</TableCell>
                  <TableCell>{parent.studentId.map(s => s.fullName).join(', ')}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(parent)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(parent._id)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{currentParent ? 'Edit Parent' : 'Add New Parent'}</DialogTitle>
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
                disabled={!!currentParent} // Disable email edit for existing parents
              />
              {!currentParent && (
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
                <InputLabel>Linked Students</InputLabel>
                <Select
                  name="studentId"
                  multiple
                  value={formValues.studentId}
                  onChange={handleStudentChange}
                  label="Linked Students"
                  renderValue={(selected) => selected.map(id => students.find(s => s._id === id)?.fullName).join(', ')}
                >
                  {students.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      {student.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="relation"
                label="Relation to Student"
                type="text"
                fullWidth
                value={formValues.relation}
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
                name="preferredLanguage"
                label="Preferred Language"
                type="text"
                fullWidth
                value={formValues.preferredLanguage}
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
            <Button onClick={handleSubmit} variant="contained">{currentParent ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ParentManagementPage;
