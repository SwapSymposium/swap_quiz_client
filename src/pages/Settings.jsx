import React, { useState, useEffect } from "react";
import { useEdit } from "../hooks/useEdit";
import { useFetch } from "../hooks/useFetch";
import { Clock, Lock, Unlock, Save, X, AlertCircle, CheckCircle } from "lucide-react";

function Settings() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [allowTest, setAllowTest] = useState(false);
    const [time, setTime] = useState(40);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { editData, loading: editLoading, error: editError } = useEdit();
    const { fetchData, loading: fetchLoading, error: fetchError, data } = useFetch();
    const event = sessionStorage.getItem('event');

    useEffect(() => {
        const fetchTestAccess = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/admin/testAccessFetch`, { event });
                if (response) {
                    setAllowTest(response.data.allowTest);
                    setTime(response.data.time);
                }
            } catch (error) {
                console.error("Error fetching test access:", error);
                setErrorMessage("Failed to fetch settings");
                setShowError(true);
                setTimeout(() => setShowError(false), 5000);
            }
        };
        fetchTestAccess();
    }, []);

    const handleTestAccess = async () => {
        if (time <= 0) {
            setErrorMessage("Time must be greater than 0 minutes");
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
            return;
        }

        if (time > 180) {
            setErrorMessage("Maximum time cannot exceed 180 minutes");
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
            return;
        }

        const response = await editData(`${apiUrl}/api/admin/testAccessSave`, { allowTest, event, time });
        if (response.status === 200) {
            alert("Settings saved successfully!");;
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            setErrorMessage("Failed to save settings");
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
    };

    const handleCancel = () => {
        const fetchOriginal = async () => {
            const response = await fetchData(`${apiUrl}/api/admin/testAccessFetch`, { event });
            if (response) {
                setAllowTest(response.data.allowTest);
                setTime(response.data.time);
            }
        };
        fetchOriginal();
    };

    const handleTimeChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= 180) {
            setTime(value);
        } else if (value > 180) {
            setTime(180);
        } else if (value < 0) {
            setTime(0);
        }
    };

    const formatTimeDisplay = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} minutes`;
    };

    return (
        <div className="">
            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <span>Settings saved successfully!</span>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {showError && (
                <div className="fixed top-6 right-6 z-50 animate-slide-in">
                    <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}

            {/* Main Card */}
            <div className="relative w-full">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                    {/* Header with Gradient */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-8 py-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold mb-2">Test Access Policy</h1>
                            <p className="text-blue-100">
                                Configure participant access and time limits for the test
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Time Configuration Section */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" />
                                Maximum Test Duration
                            </label>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                value={time}
                                                onChange={handleTimeChange}
                                                className="w-28 h-12 px-3 border-2 border-gray-300 rounded-lg text-center text-gray-800 
                                                    font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                                                    transition-all"
                                                min={0}
                                                max={180}
                                                step={5}
                                            />
                                            <span className="text-gray-600 font-medium">Minutes</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-semibold">Duration Preview:</span> {formatTimeDisplay(time)}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-1">
                                                Max allowed: 180 minutes (3 hours)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Access Toggle */}
                        <div className="mb-8">
                            <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                                {allowTest ? (
                                    <Unlock className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Lock className="w-5 h-5 text-red-500" />
                                )}
                                Test Access Control
                            </label>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="text-gray-700 mb-1">
                                            {allowTest
                                                ? "Participants can start the test"
                                                : "Test access is currently restricted"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {allowTest
                                                ? "Participants will be able to access and submit the test"
                                                : "Participants will see a message that the test is not available"}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setAllowTest(!allowTest)}
                                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                            ${allowTest ? "bg-green-500" : "bg-gray-300"}`}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300
                                                ${allowTest ? "translate-x-9" : "translate-x-1"}`}
                                        />
                                    </button>
                                </div>

                                {/* Status Badge */}
                                <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium transition-all duration-300
                                    ${allowTest
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-red-100 text-red-800 border border-red-200"}`}
                                >
                                    {allowTest ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Test Access: ENABLED</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <X className="w-4 h-4" />
                                            <span>Test Access: DISABLED</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-6 border-t border-gray-200"></div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg 
                                    hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2
                                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleTestAccess}
                                disabled={editLoading}
                                className="px-6 py-2.5 rounded-lg font-medium shadow-md transition-all 
                                    bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 
                                    disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {editLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;