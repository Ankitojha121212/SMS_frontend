import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    if (user && user.role === 'school') {
      // In a real application, you would fetch available classes from the backend
      setClasses(['Class 1', 'Class 2', 'Class 3', 'Class 4']);
    }
  }, [user]);

  const generateAttendanceReport = async () => {
    if (!selectedClass || !startDate || !endDate) {
      alert('Please select a class, start date, and end date.');
      return;
    }

    try {
      // Assuming a backend endpoint like /api/attendance/report?class=X&startDate=Y&endDate=Z
      const response = await fetchData(`attendance/report?class=${selectedClass}&startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAttendanceReport(response);
    } catch (error) {
      console.error('Error generating attendance report:', error);
      alert('Error generating attendance report: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports & Results
        </Typography>

        {user && user.role === 'school' && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Attendance Reports</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" onClick={generateAttendanceReport}>Generate Report</Button>
            </Box>

            {attendanceReport.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceReport.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{record.studentId?.fullName || 'N/A'}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No attendance report generated or no data available for the selected criteria.</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ReportsPage;
