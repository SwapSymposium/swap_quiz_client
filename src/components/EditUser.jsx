import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faClose, faUserEdit, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useEdit } from '../hooks/useEdit';

const apiUrl = import.meta.env.VITE_API_URL;

function EditUser({ onClose, selectedUser }) {

    const [formData, setFormData] = useState({
        teamId: '',
        event: '',
        password: '',
        contactNo: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                teamId: selectedUser.teamId,
                event: selectedUser.event,
                password: '',
                contactNo: selectedUser.contactNo,
            });
        }
    }, [selectedUser]);

    const { editData, loading, error } = useEdit();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = { ...formData };

        // If password field is empty, don't send it (keep existing password)
        if (!dataToSend.password || dataToSend.password.trim() === '') {
            delete dataToSend.password;
        }

        const data = await editData(`${apiUrl}/api/admin/editUser`, dataToSend);
        if (data !== null) {
            alert('User updated successfully');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 animate-slideUp relative z-[10000]">
                {/* Header - Matching Add User Modal */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-t-2xl px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <FontAwesomeIcon icon={faUserEdit} className="text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Edit User</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-300 hover:text-white transition-colors"
                    >
                        <FontAwesomeIcon icon={faClose} size="lg" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    name="event"
                                    value={formData.event}
                                    readOnly
                                    disabled
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Team ID
                                </label>
                                <input
                                    type="text"
                                    name="teamId"
                                    value={formData.teamId}
                                    readOnly
                                    disabled
                                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter new password (optional)"
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Contact Number
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Buttons - Matching Add User Modal */}
                        <div className="flex gap-6 pt-4 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.teamId || !formData.event || !formData.contactNo}
                                className="flex-1 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} />
                                        Update User
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUser;