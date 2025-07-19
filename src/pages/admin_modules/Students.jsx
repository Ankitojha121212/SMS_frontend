import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', class: '', rollNumber: '', section: '', gender: '', dateOfBirth: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudentId, setCurrentStudentId] = useState(null);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/students', { headers: { Authorization: `Bearer ${token}` } });
            if (Array.isArray(data.data)) {
                setStudents(data.data);
            } else {
                console.error("API response data.data is not an array:", data.data);
                setStudents([]); // Set to empty array to prevent map error
                toast.error('Invalid data received from server');
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch students');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (isEditing) {
                await axios.put(`/api/admin/students/${currentStudentId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Student updated successfully');
            } else {
                await axios.post('/api/admin/students', formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Student added successfully');
            }
            fetchStudents();
            resetForm();
        } catch (error) {
            toast.error('Failed to save student');
        }
    };

    const handleEdit = (student) => {
        setFormData({ name: student.name, class: student.class, rollNumber: student.rollNumber, section: student.section, gender: student.gender, dateOfBirth: student.dateOfBirth });
        setIsEditing(true);
        setCurrentStudentId(student._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/admin/students/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Student deleted successfully');
            fetchStudents();
        } catch (error) {
            toast.error('Failed to delete student');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', class: '', rollNumber: '', section: '', gender: '', dateOfBirth: '' });
        setIsEditing(false);
        setCurrentStudentId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Manage Students</h1>
            <div className="mb-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
                    <input type="text" name="class" value={formData.class} onChange={handleChange} placeholder="Class" className="p-2 border rounded" required />
                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll Number" className="p-2 border rounded" required />
                    <input type="text" name="section" value={formData.section} onChange={handleChange} placeholder="Section" className="p-2 border rounded" />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="p-2 border rounded" />
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
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Class</th>
                                <th className="py-2 px-4 border-b">Roll Number</th>
                                <th className="py-2 px-4 border-b">Section</th>
                                <th className="py-2 px-4 border-b">Gender</th>
                                <th className="py-2 px-4 border-b">Date of Birth</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(students) && students.map(student => (
                                <tr key={student._id}>
                                    <td className="py-2 px-4 border-b">{student.name}</td>
                                    <td className="py-2 px-4 border-b">{student.class}</td>
                                    <td className="py-2 px-4 border-b">{student.rollNumber}</td>
                                    <td className="py-2 px-4 border-b">{student.section}</td>
                                    <td className="py-2 px-4 border-b">{student.gender}</td>
                                    <td className="py-2 px-4 border-b">{new Date(student.dateOfBirth).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                                        <button onClick={() => handleDelete(student._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
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

export default StudentsPage;
