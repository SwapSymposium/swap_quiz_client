import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import axios from 'axios';

function FileUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [file1, setFile1] = useState(null);
    const [studentFile, setStudentFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => { setFile1(e.target.files[0]) }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file1) { alert('Please select a file'); return; }
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file1);

        try {
            const res = await axios.post(`${apiUrl}/api/timeTable/timetable`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }); alert(res.data);
        } catch (err) {
            const message = err?.response?.data || 'Upload Failed'; alert(message);
        } finally { setLoading(false) }
    }

    const handleStudentUpload = async (e) => {
        e.preventDefault();
        if (!studentFile) {
            alert('Please select a student file'); return;
        }
        const formData = new FormData();
        formData.append('file', studentFile);
        try {
            setLoading(true);
            const res = await axios.post(`${apiUrl}/api/timeTable/studentupload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(res.data);
        } catch (err) {
            setLoading(false);
            const message = err?.response?.data || 'Student upload failed';
            alert(message); return;
        }
        setLoading(false);
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p>Participants File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input type="file" name="file1" onChange={handleFileChange} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {file1 ? file1.name : 'Click to select a file'}
                            </span>
                        </div>
                    </label>
                    <button onClick={handleUpload} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Upload
                    </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
                    <p>Questions File</p>
                    <label className="w-full text-center cursor-pointer">
                        <input type="file" name="studentFile" onChange={(e) => setStudentFile(e.target.files[0])} className="hidden" />
                        <div className="flex flex-col items-center gap-2">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                            <span className="text-sm text-gray-600">
                                {studentFile ? studentFile.name : 'Click to select a file'}
                            </span>
                        </div>
                    </label>
                    <button onClick={handleStudentUpload} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Upload
                    </button>
                </div>
            </div>
            {loading && <LoadingModal loading={loading} />}
        </div>
    );
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