import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faClose } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from '../hooks/useFetch';

function UserManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        teamId: '', password: '', eventName: '', contactNo: ''
    })
    const { fetchData, loading, error, data } = useFetch();
    const [eventsData, setEventsData] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetchData(`${apiUrl}/admin/getEvents`, {});
            if (response?.data?.events) { setEventsData(response.data.events) }
        } catch (err) { console.log("Error fetching events", err) }
    }

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const addEvent = async () => {
        try {
            const response = await axios.post(`${apiUrl}/admin/addEvents`, formData);
            if (response.data.success) {
                alert("Event Added Successfully");
                setIsModalOpen(false);
                setFormData({ teamId: '', password: '', eventName: '', contactNo: '' });
                fetchEvents();
            } else { alert(response.data.message || "Failed to save event") }
        } catch (err) { console.error("Error saving event:", err) }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-end mb-5">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add User</span>
                </button>
            </div>
            {/* Add User Modal */}
            {isModalOpen && (
                <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl mt-1 mb-4">
                        <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3 mb-6">
                            Add New User
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            <input
                                type="text"
                                name="teamId"
                                value={formData.teamId}
                                placeholder="User ID"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="Password"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                placeholder="Event Name"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                name="contactNo"
                                value={formData.contactNo}
                                placeholder="Contact No"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            <div className="flex justify-between gap-5">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-2 w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition"
                                >
                                    <FontAwesomeIcon icon={faClose} className="mr-2" />
                                    Cancel
                                </button>
                                <button
                                    onClick={addEvent}
                                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
                                >
                                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Table */}
            {!isModalOpen && (
                <div className="overflow-x-auto shadow rounded-lg bg-white p-4">
                    {loading && <div className="text-center py-4 text-blue-600 font-semibold">Loading...</div>}
                    {error && <div className="text-center py-4 text-red-600 font-semibold">Error: {error}</div>}

                    {!loading && !error && (
                        <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                            <thead className="bg-blue-500 text-white overflow-auto">
                                <tr className="h-12">
                                    <th className="px-4 py-2 border border-gray-300">S. No.</th>
                                    <th className="px-4 py-2 border border-gray-300">Event ID</th>
                                    <th className="px-4 py-2 border border-gray-300">Password</th>
                                    <th className="px-4 py-2 border border-gray-300">Event Name</th>
                                    <th className="px-4 py-2 border border-gray-300">Contact No</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventsData.length > 0 ? (
                                    eventsData.map((item, index) => (
                                        <tr className="border h-12" key={index}>
                                            <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.teamId}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.password}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.event}</td>
                                            <td className="px-4 py-2 border border-gray-200">{item.contactNo}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="h-12">
                                        <td colSpan={4} className="py-2 text-gray-500">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    )
}

export default UserManage;
