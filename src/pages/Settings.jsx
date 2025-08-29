import React, { useState, useEffect } from "react";
import { useEdit } from "../hooks/useEdit";
import { useFetch } from "../hooks/useFetch";

function Settings() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [allowTest, setAllowTest] = useState(false);
    const [time, setTime] = useState(40)
    const { editData, loading: editLoading, error: editError } = useEdit();
    const { fetchData, loading: fetchLoding, error: fetchError, data } = useFetch();
    const event = sessionStorage.getItem('event');

    useEffect(() => {
        const fetchTestAccess = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/admin/testAccessFetch`, { event });
                // console.log(response)
                if (response) {
                    setAllowTest(response.data.allowTest)
                    setTime(response.data.time)
                }
            } catch (error) { console.error("Error fetching test access:", error) }
        }
        fetchTestAccess()
    }, []);

    const handleTestAccess = async () => {
        const response = await editData(`${apiUrl}/api/admin/testAccessSave`, { allowTest, event, time })
        if (response.status === 200) { alert('Settings saved succesfully') }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

            {/* Maximum Time Input */}
            <div className="flex flex-wrap items-center justify-end w-full max-w-lg gap-2.5 mb-4">
                <label className="font-medium text-gray-700 text-lg">Maximum Time :</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(parseInt(e.target.value))}
                        className="w-20 h-10 p-2 border border-gray-300 rounded-md text-center text-gray-800 
                            focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 
                            transition-all"
                        min={0}
                    />
                    <span className="text-gray-600 text-lg font-medium">Minutes</span>
                </div>
            </div>


            {/* Card Container */}
            <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-lg border border-gray-200 overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 text-white rounded-t-xl p-5 -m-6 mb-6 shadow-lg">
                    <h1 className="text-xl font-bold">Test Access Policy</h1>
                    <p className="text-sm text-green-100 mt-1">
                        Manage participant access to the test
                    </p>
                </div>

                {/* Status Banner */}
                <div
                    className={`mb-6 p-3 rounded-lg text-center font-medium transition-all duration-300
                        ${allowTest
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {allowTest ? "✅ Test Access is Enabled" : "🚫 Test Access is Disabled"}
                </div>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border hover:shadow-md transition">
                    <span className="text-gray-800 font-medium">
                        Allow participants to start the test
                    </span>
                    <button
                        onClick={() => setAllowTest(!allowTest)}
                        className={`relative w-16 h-8 flex items-center rounded-full transition-colors duration-300 ${allowTest ? "bg-green-500" : "bg-gray-300"}`}
                    >
                        <span
                            className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${allowTest ? "translate-x-8" : ""}`}
                        />
                    </button>
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setAllowTest(false)}
                        className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTestAccess}
                        className="px-5 py-2 rounded-lg font-medium shadow-md transition bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                        disabled={editLoading}
                    >
                        {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );

}

export default Settings;
