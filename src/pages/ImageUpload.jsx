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
                const responseData = await fetchData(`${apiUrl}/admin/imageQuestion`, { eventName });
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
            const res = await axios.post(`${apiUrl}/admin/imageUpload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(`Q${question.questionNo} uploaded successfully`);
            console.error("Upload failed : ", err);
            alert("Upload Failed");
        } finally { setLoading(false) }
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="overflow-x-auto shadow rounded-lg bg-white p-4">
                <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr className="h-12">
                            <th className="px-4 py-2 border border-gray-300">S. No</th>
                            <th className="px-4 py-2 border border-gray-300">Qstn No</th>
                            <th className="px-4 py-2 border border-gray-300">Question</th>
                            <th className="px-4 py-2 border border-gray-300">Option 1</th>
                            <th className="px-4 py-2 border border-gray-300">Option 2</th>
                            <th className="px-4 py-2 border border-gray-300">Option 3</th>
                            <th className="px-4 py-2 border border-gray-300">Option 4</th>
                            <th className="px-4 py-2 border border-gray-300">Correct Answer</th>
                            <th className="px-4 py-2 border border-gray-300">Upload</th>
                        </tr>
                    </thead>
                    <tbody>
                        {imageQuestions.length > 0 ? (
                            imageQuestions.map((q, qIndex) => (
                                <tr key={qIndex} className="bg-white hover:bg-gray-50 border-b border-gray-300">
                                    <td className="px-4 py-3 text-center border text-gray-700 border-gray-300">{qIndex + 1}</td>
                                    <td className="px-4 py-3 text-center border text-gray-700 border-gray-300">Q{q.questionNo}</td>
                                    <td className="px-4 py-3 text-gray-700 white">{q.question}</td>
                                    {q.options.map((_, optIndex) => (
                                        <td key={optIndex} className="px-3 py-2 text-center border border-gray-300 rounded-md">
                                            <input
                                                type="file"
                                                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 hover:border-blue-400"
                                                onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.files[0])}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-3 py-2 text-center border border-gray-300 rounded-md">
                                        <select
                                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                            value={q.answer}
                                            onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
                                        >
                                            <option value="">Select</option>
                                            <option value="1">Option 1</option>
                                            <option value="2">Option 2</option>
                                            <option value="3">Option 3</option>
                                            <option value="4">Option 4</option>
                                        </select>
                                    </td>
                                    <td className="px-3 py-2 text-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => handleUpload(q)}
                                            disabled={loading}
                                            className={`w-full px-3 py-2 rounded-md font-semibold text-white transition ${loading
                                                ? "border-gray-300 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700 shadow-md"
                                                }`}
                                        >
                                            {loading ? "Uploading..." : "Upload"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="h-12">
                                <td colSpan={9} className="py-4 text-center text-gray-400">
                                    No questions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ImageUpload;