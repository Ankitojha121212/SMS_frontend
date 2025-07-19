import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', classAssigned: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentTeacherId, setCurrentTeacherId] = useState(null);

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/teachers', { headers: { Authorization: `Bearer ${token}` } });
            setTeachers(data.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch teachers');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (isEditing) {
                await axios.put(`/api/admin/teachers/${currentTeacherId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Teacher updated successfully');
            } else {
                await axios.post('/api/admin/teachers', formData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success('Teacher added successfully');
            }
            fetchTeachers();
            resetForm();
        } catch (error) {
            toast.error('Failed to save teacher');
        }
    };

    const handleEdit = (teacher) => {
        setFormData({ name: teacher.name, email: teacher.email, phone: teacher.phone, subject: teacher.subject, classAssigned: teacher.classAssigned });
        setIsEditing(true);
        setCurrentTeacherId(teacher._id);
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/api/admin/teachers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Teacher deleted successfully');
            fetchTeachers();
        } catch (error) {
            toast.error('Failed to delete teacher');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', subject: '', classAssigned: '' });
        setIsEditing(false);
        setCurrentTeacherId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Manage Teachers</h1>
            <div className="mb-4">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="p-2 border rounded" required />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="p-2 border rounded" />
                    <input type="text" name="classAssigned" value={formData.classAssigned} onChange={handleChange} placeholder="Class Assigned" className="p-2 border rounded" />
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
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Subject</th>
                                <th className="py-2 px-4 border-b">Class Assigned</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher._id}>
                                    <td className="py-2 px-4 border-b">{teacher.name}</td>
                                    <td className="py-2 px-4 border-b">{teacher.email}</td>
                                    <td className="py-2 px-4 border-b">{teacher.phone}</td>
                                    <td className="py-2 px-4 border-b">{teacher.subject}</td>
                                    <td className="py-2 px-4 border-b">{teacher.classAssigned}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleEdit(teacher)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                                        <button onClick={() => handleDelete(teacher._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
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

export default TeachersPage;