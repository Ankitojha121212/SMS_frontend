import React, { useState, useEffect } from 'react';
import { Typography, Box, Container, Paper, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { fetchData } from '../services/api';
import { getCurrentUser } from '../services/auth';

function FeesReceiptPage() {
  const [fees, setFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState('');
  const [receiptDetails, setReceiptDetails] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      if (user.role === 'parent') {
        fetchParentFees();
      } else if (user.role === 'student') {
        fetchStudentFees(user.id);
      }
    }
  }, [user]);

  const fetchParentFees = async () => {
    try {
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

  const handleFeeSelect = (event) => {
    const feeId = event.target.value;
    setSelectedFee(feeId);
    const fee = fees.find(f => f._id === feeId);
    setReceiptDetails(fee);
  };

  const handleDownloadReceipt = () => {
    if (receiptDetails) {
      // In a real application, you would generate a PDF here.
      // For demonstration, we'll just log the details and simulate a download.
      console.log('Downloading receipt for:', receiptDetails);
      alert('Simulating receipt download. Check console for details.');

      // Example of how you might trigger a download for a simple text file
      const receiptContent = `
        Fee Receipt\n
        Student Name: ${receiptDetails.studentId?.fullName || 'N/A'}
        Amount: ${receiptDetails.amount}
        Due Date: ${new Date(receiptDetails.dueDate).toLocaleDateString()}
        Status: ${receiptDetails.status}
        Payment Date: ${receiptDetails.paymentDate ? new Date(receiptDetails.paymentDate).toLocaleDateString() : 'N/A'}
        Transaction ID: ${receiptDetails.transactionId || 'N/A'}
        Description: ${receiptDetails.description || 'N/A'}
      `;
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${receiptDetails._id}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Fees Receipt
        </Typography>

        {user && (user.role === 'parent' || user.role === 'student') && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Select Fee Record for Receipt</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Fee</InputLabel>
              <Select
                value={selectedFee}
                label="Select Fee"
                onChange={handleFeeSelect}
              >
                {fees.map((fee) => (
                  <MenuItem key={fee._id} value={fee._id}>
                    {fee.studentId?.fullName || 'N/A'} - {fee.amount} ({new Date(fee.dueDate).toLocaleDateString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {receiptDetails && (
              <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px' }}>
                <Typography variant="h6" gutterBottom>Receipt Details</Typography>
                <Typography><strong>Student Name:</strong> {receiptDetails.studentId?.fullName || 'N/A'}</Typography>
                <Typography><strong>Amount:</strong> {receiptDetails.amount}</Typography>
                <Typography><strong>Due Date:</strong> {new Date(receiptDetails.dueDate).toLocaleDateString()}</Typography>
                <Typography><strong>Status:</strong> {receiptDetails.status}</Typography>
                <Typography><strong>Payment Date:</strong> {receiptDetails.paymentDate ? new Date(receiptDetails.paymentDate).toLocaleDateString() : 'N/A'}</Typography>
                <Typography><strong>Transaction ID:</strong> {receiptDetails.transactionId || 'N/A'}</Typography>
                <Typography><strong>Description:</strong> {receiptDetails.description || 'N/A'}</Typography>
                <Button variant="contained" sx={{ mt: 3 }} onClick={handleDownloadReceipt}>
                  Download Receipt
                </Button>
              </Box>
            )}

            {fees.length === 0 && (
              <Typography>No fee records available to generate receipts.</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default FeesReceiptPage;
