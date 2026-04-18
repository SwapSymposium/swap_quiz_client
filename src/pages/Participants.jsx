import React, { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus, faClose, faSave, faUserGroup, faPhone,
    faBuilding, faUniversity, faTrash, faSearch, faCopy,
    faIdCard, faUsers, faUser
} from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../hooks/useAdd';
import { useFetch } from '../hooks/useFetch';

function Participants() {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        teamId: '', password: 'JMC', participants: [''],
        contactNo: '', deptName: '', clgName: '', swapId: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem('event');

    const { fetchData, loading: fetchLoading, error: fetchError, data } = useFetch();
    const { addData, loading: addLoading, addError } = useAdd();

    useEffect(() => {
        if (event) fetchData(`${apiUrl}/api/participants/fetchParticipants`, { event });
    }, [event, apiUrl]);

    // Filter Logic
    const filteredData = useMemo(() => {
        const list = data?.data || [];
        if (!searchTerm) return list;
        return list.filter(user =>
            user.teamId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.clgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.participants?.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [data, searchTerm]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.teamId || !formData.participants[0]) return alert("Team ID and at least one member are required.");

        const payload = { ...formData, role: "PARTICIPANTS", event };
        const result = await addData(`${apiUrl}/api/participants/addUser`, payload);

        if (result) {
            alert('User added successfully');
            setIsAddModalOpen(false);
            setFormData({ teamId: '', password: 'JMC', participants: [''], contactNo: '', deptName: '', clgName: '', swapId: '' });
            fetchData(`${apiUrl}/api/participants/fetchParticipants`, { event });
        }
    };

    const handleParticipantChange = (index, value) => {
        const newParticipants = [...formData.participants];
        newParticipants[index] = value;
        setFormData(prev => ({ ...prev, participants: newParticipants }));
    };

    const addParticipantField = () => {
        setFormData(prev => ({ ...prev, participants: [...prev.participants, ''] }));
    };

    const removeParticipantField = (index) => {
        const newParticipants = formData.participants.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, participants: newParticipants }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Password copied to clipboard!');
    };

    return (
        <div className="font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Participant Directory</h1>
                    <p className="text-slate-500 mt-1">Manage registrations for <span className="text-blue-600 font-semibold">{event || 'Current Event'}</span></p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search teams, colleges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg w-64 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Team</span>
                    </button>
                </div>
            </div>

            {/* Modal - Full Screen Cover */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all duration-300 animate-slideUp">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUserGroup} className="text-blue-600 text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Add New Team</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Fill in the team details below</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {addError && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <p className="text-red-600 text-sm">{addError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Row 1: Swap ID & Team ID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            <FontAwesomeIcon icon={faIdCard} className="mr-2 text-blue-500" />
                                            Swap ID
                                        </label>
                                        <input
                                            autoComplete="off"
                                            type="text"
                                            value={formData.swapId}
                                            name="swapId"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
                                            Team ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            autoComplete="off"
                                            type="text"
                                            value={formData.teamId}
                                            name="teamId"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Participants - 2 Column Grid with delete button inside input */}
                                <div className="mb-5">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                        <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                                        Participants Name : <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {formData.participants.map((participant, index) => (
                                            <div key={index} className="relative">
                                                <input
                                                    type="text"
                                                    value={participant}
                                                    placeholder={`Participant ${index + 1} Name`}
                                                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                                                    className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                                    required={index === 0}
                                                />
                                                {formData.participants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeParticipantField(index)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} size="sm" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addParticipantField}
                                        className="w-full mt-5 py-2.5 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg text-gray-500 hover:text-blue-600 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        Add Another Participant
                                    </button>
                                </div>

                                {/* Row 3: Contact & Department */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-500" />
                                            Contact Number :
                                        </label>
                                        <input
                                            autoComplete="off"
                                            type="tel"
                                            value={formData.contactNo}
                                            name="contactNo"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500" />
                                            Department :
                                        </label>
                                        <input
                                            autoComplete="off"
                                            type="text"
                                            value={formData.deptName}
                                            name="deptName"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                            <FontAwesomeIcon icon={faUniversity} className="mr-2 text-blue-500" />
                                            College Name :
                                        </label>
                                        <input
                                            autoComplete="off"
                                            type="text"
                                            value={formData.clgName}
                                            name="clgName"
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                <input type="hidden" name="password" value={formData.password} />

                                {/* Actions */}
                                <div className="flex gap-6 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addLoading}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                                        {addLoading ? 'Saving...' : 'Save Team'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {fetchLoading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-medium tracking-wide">Fetching data...</p>
                    </div>
                ) : fetchError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 font-bold mb-2">Error loading participants</p>
                        <p className="text-slate-400 text-sm">{fetchError}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-10 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">S.No</th>
                                    <th className="px-10 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Identification</th>
                                    <th className="px-10 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Password</th>
                                    <th className="px-10 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Team Members</th>
                                    <th className="px-10 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Contact Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length > 0 ? (
                                    filteredData.map((user, index) => (
                                        <tr key={user.teamId} className="hover:bg-blue-50/40 transition-colors group">
                                            <td className="px-10 py-4 text-sm font-bold text-slate-300">{index + 1}</td>
                                            <td className="px-10 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-semibold text-blue-500 uppercase">Swap ID : {user.swapId || 'N/A'}</span>
                                                    <span className="text-sm font-bold text-slate-700">{user.teamId}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <code className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-sm font-mono">{user.password}</code>
                                                    <button onClick={() => copyToClipboard(user.password)} className="text-slate-300 transition-all">
                                                        <FontAwesomeIcon icon={faCopy} size="xs" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-10 py-4 text-center">
                                                <div className="flex flex-wrap justify-center gap-2.5">
                                                    {user.participants?.map((p, i) => (
                                                        <span key={i} className="bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg text-sm font-medium shadow-sm italic">
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-4">
                                                <div className="flex flex-col gap-1 text-[14px] text-slate-500">
                                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                                        <FontAwesomeIcon icon={faPhone} className="w-10 text-slate-300" /> {user.contactNo || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faBuilding} className="w-3 text-slate-300" /> {user.deptName || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 group">
                                                        <FontAwesomeIcon icon={faUniversity} className="w-3 text-slate-300 flex-shrink-0" />
                                                        <span
                                                            className="truncate max-w-[380px] relative"
                                                            title={user.clgName || 'N/A'}
                                                        >
                                                            {user.clgName || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center">
                                            <FontAwesomeIcon icon={faUserGroup} size="3x" className="text-slate-100 mb-4" />
                                            <p className="text-slate-400 font-medium">No participants found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default Participants;