import React from "react";
import { FaClock, FaTimesCircle, FaTrophy, FaLaptopCode, FaCheckCircle } from "react-icons/fa";

function GuideLines() {

    const sections = [
        {
            icon: <FaClock className="text-blue-600 text-3xl" />,
            title: "Round 1 – Quiz",
            color: "blue",
            points: [
                <>
                    Contains MCQs, visual-based, and interactive questions from:
                    <ul className="ml-6 list-disc text-gray-600 mt-1">
                        <li>HTML, CSS, JavaScript basics</li>
                        <li>Web Design principles & UI/UX</li>
                        <li>Current web trends</li>
                    </ul>
                </>,
                "Time limit: 20 minutes",
                "Negative marking: -0.5 for each wrong answer",
                "Top scorers qualify for Round 2"
            ]
        },
        {
            icon: <FaLaptopCode className="text-indigo-600 text-3xl" />,
            title: "Round 2 – Reverse Engineering Challenge",
            color: "indigo",
            points: [
                "Recreate a reference design using HTML, CSS, and optional JavaScript",
                "Time limit: 50 minutes (40 mins base design + 10 mins modification)",
                "Mystery modification will be revealed halfway through",
                "No pre-built templates allowed",
                "Frameworks allowed only if specified beforehand",
                "Internet access limited to documentation sites (MDN, W3Schools)",
                <>
                    Final submission must include:
                    <ul className="ml-6 list-disc text-gray-600 mt-1">
                        <li>HTML, CSS, JS files</li>
                        <li>Linked assets (images, fonts)</li>
                    </ul>
                </>
            ]
        },
        {
            icon: <FaTrophy className="text-yellow-600 text-3xl" />,
            title: "Scoring & Tie-Breakers",
            color: "yellow",
            points: [
                "Round 1: Based on quiz score",
                <>
                    Round 2: Based on:
                    <ul className="ml-6 list-disc text-gray-600 mt-1">
                        <li>Accuracy to reference design (15 pts)</li>
                        <li>Responsiveness (5 pts)</li>
                        <li>Code cleanliness (5 pts)</li>
                        <li>Execution of modification (5 pts)</li>
                    </ul>
                </>,
                <>
                    In case of a tie:
                    <ul className="ml-6 list-disc text-gray-600 mt-1">
                        <li>First preference: Higher Round 2 score</li>
                        <li>Second preference: Bonus coding challenge</li>
                    </ul>
                </>
            ]
        },
        {
            icon: <FaTimesCircle className="text-red-600 text-3xl" />,
            title: "Disqualification Conditions",
            color: "red",
            points: [
                "Plagiarism detected in code",
                "Disrespectful behavior towards participants or organizers",
                "Failure to submit work within the given time"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-12">
            <div className="w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        Competition Guidelines
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Please read the rules carefully before participating.
                    </p>
                </div>
                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
                                    {section.icon}
                                </div>
                                <h2 className={`text-2xl font-semibold text-${section.color}-700`}>
                                    {section.title}
                                </h2>
                            </div>
                            <ul className="list-disc ml-6 space-y-2 text-gray-700">
                                {section.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
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