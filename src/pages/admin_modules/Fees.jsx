import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const FeesPage = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ studentId: '', amount: '', paid: false, dueDate: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentFeeId, setCurrentFeeId] = useState(null);

    const fetchFees = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/fees', { headers: { Authorization: `Bearer ${token}` } });
            setFees(data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch fees');
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/students', { headers: { Authorization: `Bearer ${token}` } });
            setStudents(data.data);
        } catch (error) {
            toast.error('Failed to fetch students');
        }
    };

    useEffect(() => {
        fetchFees();
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (isEditing) {
                await axios.put(`/api/admin/fees/${currentFeeId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Fee updated successfully');
            } else {
                await axios.post('/api/admin/fees', formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Fee added successfully');
            }
            fetchFees();
            resetForm();
        } catch (error) {
            toast.error('Failed to save fee');
        }
    };

    const handleEdit = (fee) => {
        setFormData({ studentId: fee.studentId._id, amount: fee.amount, paid: fee.paid, dueDate: fee.dueDate });
        setIsEditing(true);
        setCurrentFeeId(fee._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/admin/fees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Fee deleted successfully');
            fetchFees();
        } catch (error) {
            toast.error('Failed to delete fee');
        }
    };

    const resetForm = () => {
        setFormData({ studentId: '', amount: '', paid: false, dueDate: '' });
        setIsEditing(false);
        setCurrentFeeId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Manage Fees</h1>
            <div className="mb-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="studentId" value={formData.studentId} onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student._id} value={student._id}>{student.name} - {student.class}</option>
                        ))}
                    </select>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" className="p-2 border rounded" required />
                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="p-2 border rounded" required />
                    <div className="flex items-center">
                        <input type="checkbox" name="paid" checked={formData.paid} onChange={handleChange} className="mr-2" />
                        <label>Paid</label>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">{isEditing ? 'Update' : 'Add'}</button>
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
            {loading ? <p>Loading...</p> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Student</th>
                                <th className="py-2 px-4 border-b">Amount</th>
                                <th className="py-2 px-4 border-b">Due Date</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fees.map(fee => (
                                <tr key={fee._id}>
                                    <td className="py-2 px-4 border-b">{fee.studentId.name}</td>
                                    <td className="py-2 px-4 border-b">{fee.amount}</td>
                                    <td className="py-2 px-4 border-b">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">{fee.paid ? 'Paid' : 'Unpaid'}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleEdit(fee)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                                        <button onClick={() => handleDelete(fee._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FeesPage;