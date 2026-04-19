import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from "../hooks/useFetch";
import { FaCheckCircle, FaUserCircle, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

function ParticipantsGuideLines() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem("event");
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState(null);
    const [rules, setRules] = useState([]);
    const { fetchData, loading } = useFetch();
    const roleType = sessionStorage.getItem('role');
    const eventName = sessionStorage.getItem('event');

    useEffect(() => {
        const fetchRulesAndData = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/participants/rules`, { event, teamId });
                setParticipants(response.data.participants);
                setRules(response.data.rules);
            } catch (error) {
                console.error("Error fetching rules: ", error);
            }
        };
        fetchRulesAndData();
    }, [event, teamId]);

    return (
        <div className="">
            <div className="w-full">

                {/* User Context Bar */}
                {participants && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white shadow-sm border border-slate-200 rounded-2xl p-4 mb-10 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                                <FaUserCircle className="text-blue-600 text-xl" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Team Members</p>
                                <p className="text-slate-800 font-bold">{participants.join(' • ')}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                Verified Access
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">
                        {event} <span className="text-blue-600">Guidelines</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                        <FaExclamationTriangle className="text-amber-500" />
                        <p className="font-medium">Carefully review all instructions before beginning.</p>
                    </div>
                </header>

                {/* Rules List */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Loading rules...</div>
                    ) : (
                        rules.map((rule, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={rule._id || index}
                                className="group relative bg-white border border-slate-200 p-6 rounded-2xl transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5"
                            >
                                <div className="flex gap-5">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800 mb-3">{rule.points}</h3>
                                        {rule.subpoints && rule.subpoints.length > 0 && (
                                            <ul className="grid grid-cols-1 gap-2">
                                                {rule.subpoints.map((sub, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-slate-600 text-md leading-relaxed">
                                                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                        {sub}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Footer Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-16 pt-8 border-t border-slate-200 text-center"
                >
                    <div className="inline-flex flex-col items-center gap-6">
                        <p className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                            <FaCheckCircle className="animate-pulse" /> I understand and agree to follow these rules.
                        </p>

                        <button
                            onClick={() => navigate(`/layout/${roleType}/${eventName}/${teamId}/quiz`)}
                            className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg"
                        >
                            Start the Event
                            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ParticipantsGuideLines;