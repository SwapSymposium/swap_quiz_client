import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import { FaCheckCircle } from "react-icons/fa";

function GuideLines() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem("event");
    const { teamId } = useParams();
    const [participants, setParticipants] = useState(null)
    const [rules, setRules] = useState([]);
    const { fetchData } = useFetch();

    useEffect(() => {
        const fetchRulesAndData = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/participants/rules`, { event, teamId })
                setParticipants(response.data.participants)
                setRules(response.data.rules);
            } catch (error) { console.error("Error fetching rules: ", error) }
        };
        fetchRulesAndData()
    }, [event])

    console.log(participants)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-4xl space-y-8">

                {/* Participants at the top */}
                {/* Participants at the top */}
                {participants && participants.length > 0 && (
                    <div className="bg-white shadow-md rounded-xl p-4 border  border-gray-100 flex flex-wrap justify-end items-center gap-2">
                        <span className="uppercase py-1 rounded-full text-md font-medium">Username :</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-md font-medium">
                            {participants.join(', ')}
                        </span>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-gray-800">Competition Guidelines</h1>
                    <p className="text-gray-600 mt-3">Please read the rules carefully before participating.</p>
                </div>

                {/* Rules Cards */}
                <div className="space-y-8 w-full">
                    {rules.map((rule) => (
                        <div
                            key={rule._id}
                            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
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