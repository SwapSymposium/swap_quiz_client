import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle, faDatabase, faCalendarAlt, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from '../hooks/useFetch';
import { useDelete } from '../hooks/useDelete';

function DataDeletion() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({ event: '', tableName: '' });
    const [eventsData, setEventsData] = useState([]);
    const [isConfirming, setIsConfirming] = useState(false);

    const { fetchData, loading: fetchingEvents, error } = useFetch();
    const { deleteData, loading: deleting } = useDelete();

    useEffect(() => { fetchEvents() }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetchData(`${apiUrl}/api/admin/fetchEvents`, {});
            if (response?.data) setEventsData(response.data);
        } catch (err) { console.error("Error fetching events", err) }
    }

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const initiateDelete = () => {
        if (!formData.event || !formData.tableName) return alert("Please select both Event and Table");
        setIsConfirming(true);
    };

    const handleFinalDelete = async () => {
        try {
            const response = await deleteData(`${apiUrl}/api/admin/dataDeletion`, formData);
            if (response !== null) {
                // Success feedback
                setIsConfirming(false);
                setFormData({ event: "", tableName: "" });
            }
        } catch (err) {
            console.error('Error in deleting data ', err);
            alert("Server error: Could not delete data.");
        }
    }

    return (
        <div className="flex flex-col items-center">

            {/* Header Section */}
            <div className="w-full text-center my-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Data Deletion Management</h2>
                <p className="text-gray-500 mt-2">Purge specific event data from the central database.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-red-100 max-w-5xl w-full overflow-hidden">

                {/* Danger Banner */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-4">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                    </div>
                    <div>
                        <h3 className="text-red-800 font-bold text-sm uppercase tracking-wider">Danger Zone</h3>
                        <p className="text-red-600/80 text-xs">Actions here are permanent and cannot be undone.</p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                Target Event
                            </label>
                            <select
                                name="event"
                                value={formData.event}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-gray-700"
                            >
                                <option value="">Select Event</option>
                                {eventsData.map((item, index) => (
                                    <option key={index} value={item.event}>{item.event}</option>
                                ))}
                            </select>
                        </div>

                        {/* Table Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FontAwesomeIcon icon={faDatabase} className="text-gray-400" />
                                Data Table
                            </label>
                            <select
                                name="tableName"
                                value={formData.tableName}
                                onChange={handleChange}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-gray-700"
                            >
                                <option value="">Select Table</option>
                                <option value="Participants">PARTICIPANTS</option>
                                <option value="Rules">RULES</option>
                                <option value="Answers">ANSWERS</option>
                                <option value="Questions">QUESTIONS</option>
                            </select>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                        <p className="font-semibold text-gray-600 mb-1">Impact Analysis:</p>
                        Selecting a table will remove all associated records tied to the chosen event ID. This may affect reporting and historical analytics.
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                        <button
                            onClick={initiateDelete}
                            disabled={deleting || fetchingEvents}
                            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {deleting ? (
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                            ) : (
                                <FontAwesomeIcon icon={faTrash} />
                            )}
                            {deleting ? "Purging Records..." : "Delete Permanently"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom Modal for Final Confirmation */}
            {isConfirming && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 relative z-[10000]">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mb-6 mx-auto">
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900">Final Confirmation</h3>
                        <p className="text-gray-500 text-center mt-3 leading-relaxed">
                            You are about to delete <span className="font-bold text-red-600 underline">{formData.tableName}</span> records for <span className="font-bold text-gray-900">{formData.event}</span>. This cannot be undone.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={() => setIsConfirming(false)}
                                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalDelete}
                                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-red-200"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataDeletion;