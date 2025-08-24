import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { FaCheckCircle } from "react-icons/fa";

function GuideLines() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem("event");
    const [rules, setRules] = useState([]);
    const { fetchData } = useFetch();

    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetchData(`${apiUrl}/participants/rules`, { event })
                setRules(response.data);
            } catch (error) { console.error("Error fetching rules: ", error) }
        };
        fetchRules()
    }, [event])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-4xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800">Competition Guidelines</h1>
                    <p className="text-gray-600 mt-3">Please read the rules carefully before participating.</p>
                </div>

                {/* Rules Cards */}
                <div className="space-y-8">
                    {rules.map((rule) => (
                        <div
                            key={rule._id}
                            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
                                    {/* Placeholder icon */}
                                    <FaCheckCircle className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-800">{rule.title}</h2>
                            </div>
                            <p className="text-gray-700 mb-2">{rule.points}</p>
                            {rule.subpoints && rule.subpoints.length > 0 && (
                                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                    {rule.subpoints.map((point, idx) => (
                                        <li key={idx}>{point}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="inline-flex items-center gap-2 text-green-600 font-medium">
                        <FaCheckCircle /> Good luck to all participants!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GuideLines;