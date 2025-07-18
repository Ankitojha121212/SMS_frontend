import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]); // For linking fees to students
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [formValues, setFormValues] = useState({
    studentId: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    paymentDate: '',
    transactionId: '',
    description: '',
  });
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      if (user.role === 'school') {
        fetchAllFees();
        fetchAllStudents();
      } else if (user.role === 'parent') {
        fetchParentFees();
      } else if (user.role === 'student') {
        fetchStudentFees(user.id); // Assuming user.id is studentId for student role
      }
    }
  }, [user]);

  const fetchAllFees = async () => {
    try {
      const response = await fetchData('fees', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFees(response);
    } catch (error) {
      console.error('Error fetching all fees:', error);
    }
  };

  const fetchAllStudents = async () => {
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

  const fetchParentFees = async () => {
    try {
      // First, fetch the parent's linked students
      const parentData = await fetchData(`parents/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const studentIds = parentData.studentId.map(s => s._id);

      let allParentFees = [];
      for (const studentId of studentIds) {
        const response = await fetchData(`fees/student/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        allParentFees = [...allParentFees, ...response];
      }
      setFees(allParentFees);
    } catch (error) {
      console.error('Error fetching parent fees:', error);
    }
  };

  const fetchStudentFees = async (studentId) => {
    try {
      const response = await fetchData(`fees/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFees(response);
    } catch (error) {
      console.error('Error fetching student fees:', error);
    }
  };

  const handleOpenDialog = (fee = null) => {
    setCurrentFee(fee);
    if (fee) {
      setFormValues({
        studentId: fee.studentId._id || '',
        amount: fee.amount || '',
        dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
        status: fee.status || 'pending',
        paymentDate: fee.paymentDate ? new Date(fee.paymentDate).toISOString().split('T')[0] : '',
        transactionId: fee.transactionId || '',
        description: fee.description || '',
      });
    } else {
      setFormValues({
        studentId: '',
        amount: '',
        dueDate: '',
        status: 'pending',
        paymentDate: '',
        transactionId: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentFee(null);
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
      if (currentFee) {
        // Update fee
        await fetchData(`fees/${currentFee._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      } else {
        // Create new fee
        await fetchData('fees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formValues),
        });
      }
      fetchAllFees();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving fee:', error);
      alert('Error saving fee: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async (feeId) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await fetchData(`fees/${feeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchAllFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
        alert('Error deleting fee: ' + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fees Management
        </Typography>

        {user && user.role === 'school' && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">Manage Fees</Typography>
              <Button variant="contained" onClick={() => handleOpenDialog()}>Add New Fee</Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee._id}>
                      <TableCell>{fee.studentId?.fullName || 'N/A'}</TableCell>
                      <TableCell>{fee.amount}</TableCell>
                      <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{fee.status}</TableCell>
                      <TableCell>{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpenDialog(fee)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(fee._id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
              <DialogTitle>{currentFee ? 'Edit Fee Record' : 'Add New Fee Record'}</DialogTitle>
              <DialogContent>
                <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select
                      name="studentId"
                      value={formValues.studentId}
                      onChange={handleChange}
                      label="Student"
                      disabled={!!currentFee} // Cannot change student for existing fee record
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
                    name="amount"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={formValues.amount}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    name="dueDate"
                    label="Due Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formValues.dueDate}
                    onChange={handleChange}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formValues.status}
                      onChange={handleChange}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                    </Select>
                  </FormControl>
                  {formValues.status === 'paid' && (
                    <TextField
                      margin="dense"
                      name="paymentDate"
                      label="Payment Date"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formValues.paymentDate}
                      onChange={handleChange}
                    />
                  )}
                  {formValues.status === 'paid' && (
                    <TextField
                      margin="dense"
                      name="transactionId"
                      label="Transaction ID"
                      type="text"
                      fullWidth
                      value={formValues.transactionId}
                      onChange={handleChange}
                    />
                  )}
                  <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth
                    value={formValues.description}
                    onChange={handleChange}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">{currentFee ? 'Update' : 'Add'}</Button>
              </DialogActions>
            </Dialog>
          </Paper>
        )}

        {user && (user.role === 'parent' || user.role === 'student') && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Your Fee Statements</Typography>
            {fees.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment Date</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow key={fee._id}>
                        <TableCell>{fee.studentId?.fullName || 'N/A'}</TableCell>
                        <TableCell>{fee.amount}</TableCell>
                        <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{fee.status}</TableCell>
                        <TableCell>{fee.paymentDate ? new Date(fee.paymentDate).toLocaleDateString() : 'N/A'}</TableCell>
                        <TableCell>{fee.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No fee records found.</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default FeesPage;
