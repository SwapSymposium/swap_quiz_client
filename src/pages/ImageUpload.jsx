import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import axios from "axios";

function ImageUpload() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const { eventName } = useParams();
    const [imageQuestions, setImageQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const { fetchData } = useFetch();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const responseData = await fetchData(`${apiUrl}/api/admin/imageQuestion`, { eventName });
                const questionsArray = responseData.data.data;
                setImageQuestions(
                    questionsArray.map((q, index) => ({
                        ...q, qno: index + 1, answer: "",
                        options: ["", "", "", ""],
                    }))
                )
            } catch (err) { console.error("Error fetching Image Questions : ", err) }
        };
        fetchQuestion();
    }, []);

    const handleOptionChange = (qIndex, optIndex, file) => {
        const updated = [...imageQuestions];
        updated[qIndex].options[optIndex] = file;
        setImageQuestions(updated);
    }

    const handleAnswerChange = (qIndex, value) => {
        const updated = [...imageQuestions];
        updated[qIndex].answer = value;
        setImageQuestions(updated);
    }

    const handleUpload = async (question) => {
        if (question.options.some((op) => op === "")) {
            alert(`Please upload all 4 options for Q${question.questionNo}`);
            return;
        }
        if (!question.answer) {
            alert(`Please select correct answer for Q${question.questionNo}`);
            return;
        }
        const formData = new FormData();
        formData.append("event", eventName);
        formData.append("questionNo", question.questionNo);
        formData.append("question", question.question);
        formData.append("answer", question.answer);
        question.options.forEach((file) => formData.append("options", file));
        try {
            setLoading(true);
            const res = await axios.post(`${apiUrl}/api/admin/imageUpload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(`Q${question.questionNo} uploaded successfully`);
            window.location.reload();
        } catch (err) {
            console.error("Upload failed : ", err);
            alert("Upload Failed");
        } finally { setLoading(false) }
    }

    return (
        <div className="">
            <div className="max-w-full mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Image Questions</h2>
                        <p className="text-gray-500 text-sm mt-1">Upload images for each option</p>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">
                        Total Questions: {imageQuestions.length}
                    </div>
                </div>

                {/* Questions Grid */}
                <div className="space-y-4">
                    {imageQuestions.length > 0 ? (
                        imageQuestions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Question Header */}
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                                {qIndex + 1}
                                            </span>
                                            <span className="text-sm font-medium text-gray-500">Q{q.questionNo}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <select
                                                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 bg-white"
                                                value={q.answer}
                                                onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                                            >
                                                <option value="">Correct Answer</option>
                                                <option value="1">Option 1</option>
                                                <option value="2">Option 2</option>
                                                <option value="3">Option 3</option>
                                                <option value="4">Option 4</option>
                                            </select>
                                            <button
                                                onClick={() => handleUpload(q)}
                                                disabled={loading}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${loading
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                    }`}
                                            >
                                                {loading ? "Uploading..." : "Submit"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Text */}
                                <div className="px-5 py-3 border-b border-gray-100">
                                    <p className="text-gray-800 font-medium">{q.question}</p>
                                </div>

                                {/* Options Grid */}
                                <div className="p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {q.options.map((_, optIndex) => (
                                            <div key={optIndex} className="border border-gray-200 rounded-lg p-3 hover:border-blue-600 transition-colors">
                                                <label className="block text-xs font-medium text-gray-500 mb-2">
                                                    Option {optIndex + 1}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="w-full text-sm text-gray-500
                                                        file:mr-2 file:py-1.5 file:px-3
                                                        file:rounded-md file:border-0
                                                        file:text-xs file:font-medium
                                                        file:bg-blue-50 file:text-blue-700
                                                        hover:file:bg-blue-100
                                                        cursor-pointer"
                                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.files[0])}
                                                    />
                                                    {q.uploadedImages?.[optIndex] && (
                                                        <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                            </svg>
                                                            Uploaded
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p className="text-gray-400 font-medium">No questions found</p>
                            <p className="text-gray-300 text-sm mt-1">Upload questions to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;