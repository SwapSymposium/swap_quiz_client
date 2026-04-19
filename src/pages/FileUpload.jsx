import React, { useState } from "react";
import { UploadCloud, Download } from "lucide-react";
import axios from "axios";

function FileUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [rules, setRules] = useState(null);
    const [questionsFile, setQuestionsFile] = useState(null);
    const [userFile, setUserFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const eventName = sessionStorage.getItem('event');

    const handleRulesFileChange = (e) => setRules(e.target.files[0]);
    const handleQuestionsFileChange = (e) => setQuestionsFile(e.target.files[0]);
    const handleUserFileChange = (e) => setUserFile(e.target.files[0]);

    const downloadSampleParticipants = () => {
        const headers = ['swapId', 'teamId', 'password', 'participants[0]', 'participants[1]', 'contactNo', 'deptName', 'clgName'];
        const sampleData = [
            ['SWAP001', 'STYLIFY01', 'STYLIFY@123', 'John Doe', 'Jane Smith', '1234567890', 'CS', 'Sample College'],
            ['SWAP002', 'STYLIFY02', 'STYLIFY@123', 'Alice Johnson', '', '0987654321', 'IT', 'Demo College']
        ];

        const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
        downloadCSV(csvContent, 'participants_sample.csv');
    };

    const downloadSampleQuestions = () => {
        const headers = ['questionNo', 'question', 'questionType', 'options[0]', 'options[1]', 'options[2]', 'options[3]', 'answer', 'mark'];
        const sampleData = [
            [1, 'What is React?', 'text', 'Library', 'Framework', 'Language', 'Tool', 'Library', 1],
            [2, 'Explain useState hook', 'text', '', '', '', '', 'useState is a React hook for state management', 1],
            [3, 'Which image shows Charles Babbage?', 'image', '', '', '', '', '', 5]
        ];

        const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
        downloadCSV(csvContent, 'questions_sample.csv');
    };

    const downloadSampleRules = () => {
        const headers = ['points', 'subpoints[0]', 'subpoints[1]'];
        const sampleData = [
            ['📌 Question Format', 'The quiz contains 1-mark, 2-mark, and 5-mark questions from HTML, CSS, and JavaScript.', 'Each participant must attempt all questions.'],
            ['⏳ Time Limit & Auto-Submission', 'The quiz will be conducted online with a fixed time limit.', 'Once the timer ends, the system will auto-submit your answers.'],
            ['🖊️ Submission Guidelines', 'Ensure you click Submit before the timer ends to avoid accidental loss.', 'Avoid refreshing, reloading, or closing the quiz window — it may result in loss of progress.']
        ];

        const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
        downloadCSV(csvContent, 'rules_sample.csv');
    };

    const downloadHeaderParticipants = () => {
        const headers = ['swapId', 'teamId', 'password', 'participants[0]', 'participants[1]', 'contactNo', 'deptName', 'clgName'];
        const csvContent = headers.join(',');
        downloadCSV(csvContent, 'participants_header.csv');
    };

    const downloadHeaderQuestions = () => {
        const headers = ['questionNo', 'question', 'questionType', 'options[0]', 'options[1]', 'options[2]', 'options[3]', 'answer', 'mark'];
        const csvContent = headers.join(',');
        downloadCSV(csvContent, 'questions_header.csv');
    };

    const downloadHeaderRules = () => {
        const headers = ['points', 'subpoints[0]', 'subpoints[1]'];
        const csvContent = headers.join(',');
        downloadCSV(csvContent, 'rules_header.csv');
    };

    const downloadCSV = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Rule File Upload with event name
    const handleUploadRules = async (e) => {
        e.preventDefault();
        if (!rules) return alert("Please select a Rules file");
        if (!eventName) return alert("Event name not found. Please select an event first.");

        setLoading(true);
        const formData = new FormData();
        formData.append("file", rules);
        formData.append("eventName", eventName);

        try {
            await axios.post(`${apiUrl}/api/rules/uploadrules`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Rules Uploaded Successfully!");
            setRules(null);
        } catch (err) {
            console.log('Error in uploading rules : ', err);
            alert("Rules Upload Failed")
        }
        finally { setLoading(false) }
    }

    // Question File Upload with event name
    const handleUploadQuestions = async (e) => {
        e.preventDefault();
        if (!questionsFile) return alert("Please select a Questions file");
        if (!eventName) return alert("Event name not found. Please select an event first.");

        setLoading(true);
        const formData = new FormData();
        formData.append("file", questionsFile);
        formData.append("eventName", eventName);

        try {
            await axios.post(`${apiUrl}/api/questions/uploadquestion`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Questions Uploaded Successfully!");
            setQuestionsFile(null);
        } catch (err) {
            console.log('Error in uploading questions : ', err);
            alert("Questions Upload Failed")
        }
        finally { setLoading(false) }
    }

    // Participants File Upload with event name
    const handleUploadUser = async (e) => {
        e.preventDefault();
        if (!userFile) return alert("Please select a User file");
        if (!eventName) return alert("Event name not found. Please select an event first.");

        setLoading(true);
        const formData = new FormData();
        formData.append("file", userFile);
        formData.append("eventName", eventName);

        try {
            await axios.post(`${apiUrl}/api/users/uploadusers`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Participants Uploaded Successfully!");
            setUserFile(null);
        } catch (err) {
            console.log('Error in uploading participants : ', err);
            alert("Participants Upload Failed")
        }
        finally { setLoading(false) }
    }

    return (
        <div>
            {!eventName && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="text-yellow-700 text-sm">
                        ⚠️ No event selected. Please select an event before uploading files.
                    </p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
                {/* User Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p className="font-semibold text-lg">Participants File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input type="file" name="userfile" onChange={handleUserFileChange} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {userFile ? userFile.name : "Click to select a Participants file"}
                            </span>
                        </div>
                    </label>
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={handleUploadUser}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !eventName || !userFile}
                        >
                            {loading ? "Uploading..." : "Upload Participants"}
                        </button>
                    </div>
                    <div className="flex gap-4 w-full mt-2">
                        <button
                            onClick={downloadSampleParticipants}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Sample Data
                        </button>
                        <button
                            onClick={downloadHeaderParticipants}
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Header File
                        </button>
                    </div>
                </div>

                {/* Questions Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p className="font-semibold text-lg">Questions File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input type="file" name="questionsfile" onChange={handleQuestionsFileChange} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {questionsFile ? questionsFile.name : "Click to select a Questions file"}
                            </span>
                        </div>
                    </label>
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={handleUploadQuestions}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !eventName || !questionsFile}
                        >
                            {loading ? "Uploading..." : "Upload Questions"}
                        </button>
                    </div>
                    <div className="flex gap-4 w-full mt-2">
                        <button
                            onClick={downloadSampleQuestions}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Sample Data
                        </button>
                        <button
                            onClick={downloadHeaderQuestions}
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Header File
                        </button>
                    </div>
                </div>

                {/* Rules Upload */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p className="font-semibold text-lg">Rules File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input type="file" name="rulesfile" onChange={handleRulesFileChange} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {rules ? rules.name : "Click to select a Rules file"}
                            </span>
                        </div>
                    </label>
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={handleUploadRules}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !eventName || !rules}
                        >
                            {loading ? "Uploading..." : "Upload Rules"}
                        </button>
                    </div>
                    <div className="flex gap-4 w-full mt-2">
                        <button
                            onClick={downloadSampleRules}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Sample Data
                        </button>
                        <button
                            onClick={downloadHeaderRules}
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Header File
                        </button>
                    </div>
                </div>
            </div>
            {loading && <LoadingModal loading={loading} />}
        </div>
    )
}

const LoadingModal = ({ loading }) => {
    if (!loading) return null;
    return (
        <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold">Uploading...</h2>
                <div className="mt-2 animate-spin border-4 border-blue-400 border-t-transparent rounded-full h-10 w-10 mx-auto"></div>
            </div>
        </div>
    )
}

export default FileUpload;