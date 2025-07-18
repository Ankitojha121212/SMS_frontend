import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState([]); // To store available classes
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      // Fetch classes based on user role (e.g., teacher's assigned classes or all classes for school admin)
      // For now, hardcode some classes for demonstration
      setClasses(['Class 1', 'Class 2', 'Class 3']);

      if (user.role === 'teacher' && selectedClass) {
        fetchStudentsByClass(selectedClass);
      } else if (user.role === 'school') {
        // School admin can view/mark attendance for any class
        // Fetch all students initially or based on selectedClass
        if (selectedClass) {
          fetchStudentsByClass(selectedClass);
        } else {
          fetchAllStudents();
        }
      } else if (user.role === 'student') {
        fetchStudentAttendance(user.id);
      } else if (user.role === 'parent') {
        // Fetch children's attendance
        // This would require fetching the parent's linked students first
        fetchParentChildrenAttendance();
      }
    }
  }, [user, selectedClass]);

  const fetchAllStudents = async () => {
    try {
      const response = await fetchData('students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response);
    } catch (error) {
      console.error('Error fetching all students:', error);
    }
  };

  const fetchStudentsByClass = async (className) => {
    try {
      // Assuming a backend endpoint to get students by class
      const response = await fetchData(`students?class=${className}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStudents(response);
      // Initialize attendance state for fetched students
      const initialAttendance = {};
      response.forEach(student => {
        initialAttendance[student._id] = 'present'; // Default to present
      });
      setAttendance(initialAttendance);
    } catch (error) {
      console.error(`Error fetching students for class ${className}:`, error);
    }
  };

  const fetchStudentAttendance = async (studentId) => {
    try {
      const response = await fetchData(`attendance/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Process and display student's attendance records
      console.log('Student attendance:', response);
      setAttendance(response); // For student view, attendance will be an array of records
    } catch (error) {
      console.error('Error fetching student attendance:', error);
    }
  };

  const fetchParentChildrenAttendance = async () => {
    try {
      // First, fetch the parent's linked students
      const parentData = await fetchData(`parents/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const studentIds = parentData.studentId.map(s => s._id);

      const childrenAttendance = {};
      for (const studentId of studentIds) {
        const response = await fetchData(`attendance/student/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        childrenAttendance[studentId] = response;
      }
      console.log('Children attendance:', childrenAttendance);
      setAttendance(childrenAttendance); // For parent view, attendance will be an object of records per child
    } catch (error) {
      console.error('Error fetching parent children attendance:', error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prevAttendance => ({
      ...prevAttendance,
      [studentId]: status,
    }));
  };

  const handleSubmitAttendance = async () => {
    try {
      const attendanceRecords = Object.keys(attendance).map(studentId => ({
        studentId,
        date: selectedDate,
        status: attendance[studentId],
        class: selectedClass, // Assuming class is selected for marking
      }));

      for (const record of attendanceRecords) {
        await fetchData('attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(record),
        });
      }
      alert('Attendance marked successfully!');
      // Optionally, refresh data or clear form
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Error marking attendance: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Management
        </Typography>

        {user && (user.role === 'teacher' || user.role === 'school') && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>Mark Attendance</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <TextField
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
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
              <Button variant="contained" onClick={() => fetchStudentsByClass(selectedClass)} disabled={!selectedClass}>Load Students</Button>
            </Box>

            {students.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>
                          <FormControl fullWidth>
                            <Select
                              value={attendance[student._id] || 'present'}
                              onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                            >
                              <MenuItem value="present">Present</MenuItem>
                              <MenuItem value="absent">Absent</MenuItem>
                              <MenuItem value="late">Late</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {students.length > 0 && (
              <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmitAttendance}>Submit Attendance</Button>
            )}
          </Paper>
        )}

        {user && (user.role === 'student' || user.role === 'parent') && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Your Attendance Records</Typography>
            {/* This section will display attendance records for students/parents */}
            {user.role === 'student' && attendance.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Class</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>{record.class}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : user.role === 'parent' && Object.keys(attendance).length > 0 ? (
              Object.keys(attendance).map(studentId => (
                <Box key={studentId} sx={{ mb: 3 }}>
                  <Typography variant="h6">{students.find(s => s._id === studentId)?.fullName || 'Unknown Student'}</Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Class</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendance[studentId].map((record) => (
                          <TableRow key={record._id}>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.status}</TableCell>
                            <TableCell>{record.class}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))
            ) : (
              <Typography>No attendance records found.</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default AttendancePage;
