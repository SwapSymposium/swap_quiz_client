import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdd } from "../hooks/useAdd";
import { useFetch } from "../hooks/useFetch";

const McqQuiz = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem('event');
    const { teamId } = useParams();
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerStarted, setTimerStarted] = useState(false);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {

        const fetchQuizQuestions = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/participants/quizQustns`, { event });
                let fetchedQuestions = response.data.data;
                const shuffleArray = (array) => {
                    let arr = [...array];
                    for (let i = arr.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                    return arr;
                };
                fetchedQuestions = shuffleArray(fetchedQuestions);
                fetchedQuestions = fetchedQuestions.map((q) => {
                    if (!q.options || q.options.length === 0) return q;
                    const shuffledOptions = shuffleArray(q.options);
                    return {
                        ...q, options: shuffledOptions,
                        answer: shuffledOptions.find((opt) => opt === q.answer)
                    }
                })
                setQuestions(fetchedQuestions);
            } catch (error) { console.error("Error fetching quiz questions : ", error) }
        }
        fetchQuizQuestions();
    }, [event])

    useEffect(() => {
        const fetchTime = async () => {
            try {
                const response = await fetchData(`${apiUrl}/api/participants/fetchTime`, { event });
                const timeLimit = response.data.timeLimit;
                setTimeLeft(Number(timeLimit) > 0 ? Number(timeLimit) * 60 : 0);
            } catch (error) {
                console.error("Error fetching quiz time : ", error);
            }
        };
        fetchTime();
    }, [event]);

    const { addData } = useAdd();
    const { fetchData } = useFetch();

    const [currentUnanswered, setCurrentUnanswered] = useState(null);
    const [answers, setAnswers] = useState(() => {
        const initial = {};
        questions.forEach((_, idx) => { initial[idx] = null });
        return initial;
    });
    const answersRef = useRef(answers);

    const [started, setStarted] = useState(true);
    const [message, setMessage] = useState(null);
    const [alreadyAttendedFlag, setAlreadyAttendedFlag] = useState(false);

    const questionRefs = useRef([]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60); const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);

    useEffect(() => {
        const checkAlreadyAttended = async () => {
            const response = await fetchData(`${apiUrl}/api/participants/alreadyAttended`, { teamId });
            if (response?.data?.attended) { setAlreadyAttendedFlag(true) }
        }
        checkAlreadyAttended();
    }, [apiUrl, teamId]);

    const handleSelect = (qIndex, option) => {
        setAnswers((prev) => ({ ...prev, [qIndex]: option }));
        if (qIndex === currentUnanswered) {
            setCurrentUnanswered(null);
        }
    }

    const scores = useMemo(() => {
        return Object.keys(answers).reduce(
            (total, key) => total + (answers[key] === questions[key].answer ? questions[key].mark : 0), 0
        );
    }, [answers]);

    const handleStart = async () => {
        const response = await fetchData(`${apiUrl}/api/participants/startRights`, { event });
        if (response && response.status === 200) {
            setStarted(false);
            setTimerStarted(true);
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer); const allAnswers = { ...answersRef.current };
                        questions.forEach((_, idx) => { if (allAnswers[idx] === null) { allAnswers[idx] = "Not Answered" } });
                        const finalScore = Object.keys(allAnswers).reduce((total, key) => total + (allAnswers[key] === questions[key].answer ? questions[key].mark : 0), 0)
                        addData(`${apiUrl}/api/participants/quizSave`, {
                            teamId, scores: finalScore, answers: allAnswers, event
                        }).then((res) => {
                            if (res?.status === 200) setAlreadyAttendedFlag(true);
                            else setMessage("Error saving quiz. Please try again.");
                        })
                        return 0;
                    } return prev - 1;
                })
            }, 1000)
        } else { setMessage("Test has not been started yet.") }
    }

    const handleSubmit = async () => {
        const firstUnanswered = questions.findIndex((_, idx) => !answers[idx]);
        if (firstUnanswered !== -1) {
            setCurrentUnanswered(firstUnanswered);
            questionRefs.current[firstUnanswered]?.scrollIntoView({
                behavior: "smooth", block: "center"
            })
            return
        }
        const response = await addData(`${apiUrl}/api/participants/quizSave`, { teamId, scores, answers, event })
        if (response?.status === 200) { setAlreadyAttendedFlag(true) }
        else { setMessage("Error saving quiz. Please try again.") }
    }

    if (alreadyAttendedFlag) {
        return (
            <div className="">
                <div className="relative bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl p-10 border border-gray-200 w-fulltext-center overflow-hidden">
                    {/* Success Animation */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-300 rounded-full animate-ping opacity-75"></div>
                            <div className="relative bg-gradient-to-br from-green-600 to-green-700 rounded-full p-4 shadow-xl">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-800 bg-clip-text mb-4">
                        {event} Prelims Completed Successfully!
                    </h1>

                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        Your answers have been submitted. Sit tight — results will be available soon!
                    </p>

                    {/* Event Quote */}
                    {(() => {
                        const eventQuotes = {
                            STYLIFY: `"Design is not just what it looks like and feels like. Design is how it works." – Steve Jobs`,
                            BITHIT: "The real game starts at the draft table – are you ready?",
                            DBDETECTIVES: "A well-designed database is like a well-written book — everything is in its right place.",
                            PATCHMASTERS: "Every bug you solve today becomes the wisdom you carry tomorrow."
                        }
                        const defaultQuote = "Get ready to test your skills and have fun in the quiz!";
                        const quote = eventQuotes[event] || defaultQuote;
                        return (
                            <blockquote className="italic text-black border-l-4 border-green-400 pl-5 py-3 bg-gradient-to-r from-emerald-50 to-transparent rounded-r-xl shadow-sm mb-6 text-left">
                                {quote.split("\n").map((line, idx) => (
                                    <span key={idx}> {line} <br /> </span>
                                ))}
                            </blockquote>
                        )
                    })()}

                    <button
                        onClick={() => (window.location.href = "/")}
                        className="mt-4 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="">
            <div className="mx-auto">
                {/* Header Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl mb-8 p-6 border border-white/20">
                    <div className={`${!started ? "flex flex-col md:flex-row items-center justify-between gap-4" : "text-center"}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold bg-blue-600 to-slate-600 bg-clip-text text-transparent">
                                    {event} PRELIMS
                                </h1>
                                <p className="text-slate-500 text-sm mt-0.5 text-left">Multiple Choice Questions</p>
                            </div>
                        </div>

                        {!started && (
                            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-5 py-3 rounded-xl shadow-md flex items-center gap-3">
                                <div className="relative">
                                    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                    </svg>
                                    <span className="absolute inset-0 rounded-full animate-ping opacity-75"></span>
                                </div>
                                <span className="font-mono text-xl font-bold tracking-wider">{formatTime(timeLeft)}</span>
                                <span className="text-xs opacity-80">remaining</span>
                            </div>
                        )}
                    </div>
                </div>

                {started ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100">
                        <div className="mx-auto">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">Ready to Begin?</h2>
                            <p className="text-slate-500 mb-8">
                                You'll have {Math.floor(timeLeft / 60)} minutes to complete the quiz.
                                Make sure you have a stable internet connection.
                            </p>
                            <button
                                onClick={handleStart}
                                className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Start Quiz
                            </button>
                            {message && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-red-600 text-md flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="space-y-6"
                    >
                        {questions.map((q, qIndex) => (
                            <div
                                key={qIndex}
                                ref={(el) => (questionRefs.current[qIndex] = el)}
                                className={`group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${currentUnanswered === qIndex
                                    ? "ring-1 ring-red-500 shadow-red-100"
                                    : "ring-1 ring-slate-100"
                                    }`}
                            >
                                {/* Question Header */}
                                <div className={`px-6 py-4 border-b ${currentUnanswered === qIndex ? "bg-red-50 border-red-200" : "bg-gradient-to-r from-slate-50 to-white border-slate-100"}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${answers[qIndex]
                                            ? "bg-green-500 text-white"
                                            : currentUnanswered === qIndex
                                                ? "bg-red-500 text-white animate-pulse"
                                                : "bg-slate-200 text-slate-600"
                                            }`}>
                                            {qIndex + 1}
                                        </span>
                                        <h2 className="font-semibold text-slate-800 flex-1 whitespace-pre-wrap">
                                            {q.question.replace(/\\t/g, "     ").replace(/\\n/g, "\n")}
                                        </h2>
                                        {q.mark && (
                                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                {q.mark} Mark{q.mark > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((option, oIndex) => (
                                            <label
                                                key={oIndex}
                                                className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${answers[qIndex] === option
                                                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-md"
                                                    : "bg-gray-50 border-2 border-transparent hover:border-blue-300 hover:bg-blue-50/30"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`q${qIndex}`}
                                                    value={option}
                                                    checked={answers[qIndex] === option}
                                                    onChange={() => handleSelect(qIndex, option)}
                                                    className="w-4 h-4 text-blue-500 mt-0.5 cursor-pointer accent-blue-500"
                                                />
                                                {q.questionType === "text" ? (
                                                    <span className="text-slate-700 flex-1">{option}</span>
                                                ) : (
                                                    <img
                                                        src={`${apiUrl}/uploads/${option}`}
                                                        alt={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                        className="w-full max-h-64 object-contain rounded-lg border bg-white"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {currentUnanswered === qIndex && (
                                        <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span className="text-sm font-medium">This question requires an answer</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Submit Section */}
                        <div className="mt-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md p-5 border border-slate-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">

                                    <div className="text-sm text-slate-500">
                                        {Object.values(answers).filter(a => a !== null).length} / {questions.length} answered
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Submit Quiz
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default McqQuiz;