import React, { useState, useEffect } from "react";
import { useEdit } from "../hooks/useEdit";
import { useFetch } from "../hooks/useFetch";

function Settings() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [allowTest, setAllowTest] = useState(false);
    const { editData, loading: editLoading, error: editError } = useEdit();
    const { fetchData, loading: fetchLoding, error: fetchError, data } = useFetch();

    useEffect(() => {
        const fetchTestAccess = async () => {
            try {
                const response = await fetchData(`${apiUrl}/admin/testAccessFetch`, {});
                if (response) { setAllowTest(response.allowTest) }
            } catch (error) { console.error("Error fetching test access:", error) }
        }
        fetchTestAccess()
    }, []);

    const handleTestAccess = async () => {
        const response = await editData(`${apiUrl}/admin/testAccessSave`, { allowTest })
        if (response.status === 200) {
            alert('Settings saved succesfully');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-gray-200">
                {/* Status Banner */}
                <div
                    className={`mb-6 p-3 rounded-lg text-center font-medium 
                        ${allowTest
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                >
                    {allowTest ? "✅ Test Access is Enabled" : "🚫 Test Access is Disabled"}
                </div>

                {/* Title & Description */}
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                    Test Access Policy
                </h1>
                <p className="text-gray-500 mb-6">
                    Control whether participants can start the test. This setting applies
                    globally across all users.
                </p>

                {/* Toggle Switch */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                    <span className="text-gray-800 font-medium">
                        Allow participants to start the test
                    </span>
                    <button
                        onClick={() => setAllowTest(!allowTest)}
                        className={`relative w-14 h-7 flex items-center rounded-full transition-colors ${allowTest ? "bg-green-500" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`absolute left-1 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${allowTest ? "translate-x-7" : ""
                                }`}
                        ></span>
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        onClick={() => setAllowTest(false)}
                        className="px-5 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleTestAccess}
                        className={`px-5 py-2 rounded-md font-medium shadow transition bg-blue-600 text-white hover:bg-blue-700}`}
                    >
                        {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings;
