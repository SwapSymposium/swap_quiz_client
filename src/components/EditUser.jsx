import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useEdit } from '../hooks/useEdit';
const apiUrl = import.meta.env.VITE_API_URL;

function EditUser({ onClose, selectedUser }) {
    const [formData, setFormData] = useState({ teamId: '', event: '', password: '', contactNo: '' });

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                teamId: selectedUser.teamId,
                event: selectedUser.event,
                password: selectedUser.password,
                contactNo: selectedUser.contactNo,
            })
        }
    }, [selectedUser]);

    const { editData, loading, error } = useEdit()

    const handleChange = async (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleSubmit = async () => {
        if (!formData.teamId || !formData.event || !formData.password || !formData.contactNo) return alert('Fill all the fields');
        console.log(formData)
        const data = await editData(`${apiUrl}/api/admin/editUser`, formData);
        if (data !== null) { alert('User updated sucessfully'); onClose() }
    }

    return (
        <div className="p-6 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
                {error && <span className='text-red-600 mb-4 block'>{error}</span>}
                <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
                    <h2 className="text-xl font-bold border-b pb-2 text-center text-blue-500">Edit User</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-600 font-medium mb-1">Team Id</label>
                            <input
                                type="text"
                                name="teamId"
                                value={formData.teamId}
                                readOnly
                                autoComplete="off"
                                className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 font-medium mb-1">Event Name</label>
                            <input
                                type="text"
                                name="event"
                                autoComplete="off"
                                readOnly
                                value={formData.event}
                                onChange={handleChange}
                                className="p-3 w-full bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-1">Password</label>
                        <input
                            type="text"
                            name="password"
                            autoComplete="off"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 font-medium mb-1">Contact No</label>
                        <input
                            type="text"
                            name="contactNo"
                            autoComplete="off"
                            value={formData.contactNo}
                            onChange={handleChange}
                            className="p-3 w-full  border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            onClick={onClose}
                            className="flex items-center justify-center w-1/2 md:w-32 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                        >
                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center justify-center w-1/2 md:w-32 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditUser;