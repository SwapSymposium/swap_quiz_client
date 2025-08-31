import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useFetch } from '../hooks/useFetch';
import { useDelete } from '../hooks/useDelete';

function DataDeletion() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({ event: '', tableName: '' });
    const [eventsData, setEventsData] = useState([]);
    const { fetchData, loading, error } = useFetch();
    const { deleteData } = useDelete();

    useEffect(() => { fetchEvents() }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetchData(`${apiUrl}/api/admin/fetchEvents`, {});
            if (response?.data) setEventsData(response.data);
        } catch (err) { console.log("Error fetching events", err) }
    }

    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }) }

    const handleDelete = async () => {
        if (!formData.event || !formData.tableName) { return alert("Please select both Event and Table") }
        try {
            const response = await deleteData(`${apiUrl}/api/admin/dataDeletion`, formData);
            if (response !== null) {
                alert(`${formData.tableName} deleted successfully for event ${formData.event}`);
                setFormData({ event: "", tableName: "" });
            }
        } catch (err) {
            console.error('Error in deleting data ', err);
            alert("Server error: Could not delete data.");
        }
    }

    return (
        <div className="p-6 min-h-screen flex items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold border-b pb-3 text-red-600 text-center">
                    Data Deletion
                </h2>
                {error && (<span className="text-red-600 mb-4 block">{error}</span>)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-md text-gray-600 font-medium mb-2.5">
                            Select Event :
                        </label>
                        <select
                            name="event"
                            value={formData.event}
                            onChange={handleChange}
                            className="p-3 w-70 text-md bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option value="">-- Choose Event --</option>
                            {eventsData.map((item, index) => (
                                <option key={index} value={item.event}>
                                    {item.event}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-md text-gray-600 font-medium mb-2.5">
                            Select Table :
                        </label>
                        <select
                            name="tableName"
                            value={formData.tableName}
                            onChange={handleChange}
                            className="p-3 w-70 text-md bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <option value="">-- Choose Table --</option>
                            <option value="Participants">Participants</option>
                            <option value="Rules">Rules</option>
                            <option value="Answers">Answers</option>
                            <option value="Questions">Questions</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end pt-6 border-t">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center justify-center w-full md:w-48 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        {loading ? "Deleting..." : "Delete Data"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DataDeletion;
