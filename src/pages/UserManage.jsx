import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSave,
    faClose,
    faEdit,
    faTrash,
    faUsers,
    faSearch,
    faFilter,
    faDownload,
    faUserPlus,
    faShieldAlt,
    faPhone,
    faCalendarAlt,
    faEye,
    faEyeSlash,
    faCheckCircle,
    faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { useFetch } from '../hooks/useFetch';
import EditUser from '../components/EditUser';
import DeleteUser from '../components/DeleteUser';

function UserManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState({});
    const [formData, setFormData] = useState({
        teamId: '', password: '', eventName: '', contactNo: '', email: ''
    })
    const { fetchData, loading, error, data } = useFetch();
    const [eventsData, setEventsData] = useState([]);
    const [isEditPopupOpen, setIsEditModalOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventFilter, setSelectedEventFilter] = useState('all');

    useEffect(() => { fetchEvents() }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetchData(`${apiUrl}/api/admin/getEvents`, {});
            if (response?.data?.events) { setEventsData(response.data.events) }
        } catch (err) { console.log("Error fetching events", err) }
    }

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const addEvent = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/admin/addEvents`, formData);
            if (response.data.success) {
                alert("Event Added Successfully");
                setIsModalOpen(false);
                setFormData({ teamId: '', password: '', eventName: '', contactNo: '', email: '' });
                fetchEvents();
            } else { alert(response.data.message || "Failed to save event") }
        } catch (err) { console.error("Error saving event:", err) }
    }

    const handleEdit = async (item) => {
        setIsEditModalOpen(true);
        setSelectedUser(item);
    }

    const handleDelete = async (teamId, event) => {
        setIsDeleteModalOpen(true);
        setSelectedUser(teamId)
        setSelectedEvent(event);
    }

    const togglePasswordVisibility = (teamId) => {
        setShowPassword(prev => ({ ...prev, [teamId]: !prev[teamId] }));
    }

    // Get unique events for filter
    const uniqueEvents = ['all', ...new Set(eventsData.map(user => user.event))];

    // Filter users based on search and event filter
    const filteredUsers = eventsData.filter(user => {
        const matchesSearch = user.teamId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.event?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.contactNo?.includes(searchTerm);
        const matchesEvent = selectedEventFilter === 'all' || user.event === selectedEventFilter;
        return matchesSearch && matchesEvent;
    });

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Team ID', 'Password', 'Event Name', 'Contact No'];
        const csvData = filteredUsers.map(user => [user.teamId, user.password, user.event, user.contactNo]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const totalUsers = eventsData.length;
    const totalEvents = uniqueEvents.length - 1;

    return (
        <div className="min-h-screen">

            {/* Header Section with Stats */}
            <div className="mb-8 relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-blue-700 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-slate-500 text-sm mt-0.5">Manage and oversee all registered users</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={exportToCSV}
                            className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 hover:border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            <span>Export</span>
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                            <FontAwesomeIcon icon={faUserPlus} />
                            <span>Add New User</span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">{totalUsers}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faUsers} className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Total Events</p>
                                <p className="text-2xl font-bold text-blue-700 mt-1">{totalEvents}</p>
                            </div>
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">Active Users</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">{filteredUsers.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by Team ID, Event, or Contact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                    />
                </div>
                <div className="relative min-w-[200px]">
                    <FontAwesomeIcon icon={faFilter} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
                    <select
                        value={selectedEventFilter}
                        onChange={(e) => setSelectedEventFilter(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all duration-200 bg-white shadow-sm appearance-none cursor-pointer"
                    >
                        {uniqueEvents.map(event => (
                            <option key={event} value={event}>
                                {event === 'all' ? 'All Events' : event}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Add User Modal - Enhanced */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideUp relative z-[10000]">
                        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-2xl px-6 py-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUserPlus} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Add New User</h2>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                <FontAwesomeIcon icon={faClose} size="lg" />
                            </button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={(e) => { e.preventDefault(); addEvent(); }}>
                                <div className="space-y-4">
                                    {/* Event Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Event Name</label>
                                        <input
                                            type="text"
                                            name="eventName"
                                            value={formData.eventName}
                                            placeholder="Enter event name"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Other fields in grid-2 layout */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Team ID</label>
                                            <input
                                                type="text"
                                                name="teamId"
                                                value={formData.teamId}
                                                placeholder="Enter team ID"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                placeholder="Enter password"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number</label>
                                            <input
                                                type="tel"
                                                name="contactNo"
                                                value={formData.contactNo}
                                                placeholder="Enter contact number"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                placeholder="Enter email address"
                                                onChange={handleChange}
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex gap-6 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                            Save User
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Table - Enhanced */}
            {!isModalOpen && (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                                <p className="text-slate-600 font-medium">Loading users...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <div className="flex flex-col items-center gap-2">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl text-red-400" />
                                <p className="text-red-500 font-semibold">Error: {error}</p>
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-700 to-blue-600">
                                        <tr className='text-center'>
                                            <th className="px-6 py-4 text-sm font-semibold text-white">#</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white">Team ID</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white">Password</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white">Event Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-white">Contact</th>
                                            <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((item, index) => (
                                                <tr key={index} className="text-center hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group">
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-semibold text-slate-400">#{index + 1}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center  gap-2">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                                                                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-xs" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-blue-700">{item.teamId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <code className="text-sm text-slate-600 bg-gray-100 px-2 py-1 rounded font-mono">
                                                                {showPassword[item.teamId] ? item.password : '••••••••'}
                                                            </code>
                                                            <button
                                                                onClick={() => togglePasswordVisibility(item.teamId)}
                                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                                            >
                                                                <FontAwesomeIcon icon={showPassword[item.teamId] ? faEyeSlash : faEye} size="sm" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                                                            {item.event}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center  justify-center gap-2">
                                                            <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-xs" />
                                                            <span className="text-sm text-slate-600">{item.contactNo}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="group relative flex items-center justify-center w-9 h-9 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-300 ease-out shadow-sm border border-blue-100 hover:border-blue-600 active:scale-95"
                                                                aria-label="Edit User"
                                                            >
                                                                <FontAwesomeIcon icon={faEdit} className="text-sm transition-transform" />
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(item.teamId, item.event)}
                                                                className="group relative flex items-center justify-center w-9 h-9 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300 ease-out shadow-sm border border-red-100 hover:border-red-600 active:scale-95"
                                                                aria-label="Delete User"
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} className="text-sm transition-transform" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faUsers} className="text-4xl text-slate-300" />
                                                        </div>
                                                        <p className="text-slate-500 font-medium text-lg">No users found</p>
                                                        <p className="text-slate-400 text-sm">Try adjusting your search or filter criteria</p>
                                                        <button
                                                            onClick={() => {
                                                                setSearchTerm('');
                                                                setSelectedEventFilter('all');
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="mt-2 text-slate-600 hover:text-blue-700 text-sm font-medium underline"
                                                        >
                                                            + Add your first user
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Enhanced Table Footer */}
                            {filteredUsers.length > 0 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <p className="text-sm text-slate-600">
                                        Showing <span className="font-semibold text-blue-700">{filteredUsers.length}</span> of{' '}
                                        <span className="font-semibold text-blue-700">{eventsData.length}</span> users
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            Clear search
                                        </button>
                                        {selectedEventFilter !== 'all' && (
                                            <button
                                                onClick={() => setSelectedEventFilter('all')}
                                                className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                Clear filter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Edit and Delete Modals */}
            {isEditPopupOpen && <EditUser
                onClose={() => { setIsEditModalOpen(false); fetchEvents() }}
                selectedUser={selectedUser}
            />}
            {isDeletePopupOpen && <DeleteUser
                onClose={() => { setIsDeleteModalOpen(false); fetchEvents() }}
                selectedUser={selectedUser} selectedEvent={selectedEvent}
            />}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-slideUp { animation: slideUp 0.4s ease-out; }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </div>
    )
}

export default UserManage;