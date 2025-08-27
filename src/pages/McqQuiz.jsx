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
				const response = await fetchData(`${apiUrl}/participants/quizQustns`, { event });
				setQuestions(response.data.data);
			} catch (error) { console.error("Error fetching quiz questions : ", error) }
		}
		fetchQuizQuestions();
	}, [event]);

	useEffect(() => {
		const fetchTime = async () => {
			try {
				const response = await fetchData(`${apiUrl}/participants/fetchTime`, { event });
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
			const response = await fetchData(`${apiUrl}/participants/alreadyAttended`, { teamId });
			// console.log(response)
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
			(total, key) => total + (answers[key] === questions[key].answer ? 1 : 0), 0
		);
	}, [answers]);

	// console.log(event)

	const handleStart = async () => {
		const response = await fetchData(`${apiUrl}/participants/startRights`, { event });
		if (response && response.status === 200) {
			setStarted(false);
			setTimerStarted(true);
			const timer = setInterval(() => {
				setTimeLeft(prev => {
					if (prev <= 1) {
						clearInterval(timer); const allAnswers = { ...answersRef.current };
						questions.forEach((_, idx) => { if (allAnswers[idx] === null) { allAnswers[idx] = "Not Answered" } });
						const finalScore = Object.keys(allAnswers).reduce((total, key) => total + (allAnswers[key] === questions[key].answer ? 1 : 0), 0)
						addData(`${apiUrl}/participants/quizSave`, {
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
		// console.log(answers)
		const response = await addData(`${apiUrl}/participants/quizSave`, { teamId, scores, answers, event })
		if (response?.status === 200) { setAlreadyAttendedFlag(true) }
		else { setMessage("Error saving quiz. Please try again.") }
	}

	if (alreadyAttendedFlag) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-8">
				<div className="bg-gradient-to-r from-white via-green-50 to-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl text-center">
					<div className="flex justify-center mb-6">
						<div className="bg-green-100 rounded-full p-2 animate-bounce shadow-inner">
							<svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					</div>
					<h1 className="text-3xl font-extrabold text-green-700 mb-4 drop-shadow-sm">
						{event} Prelims Completed Successfully!
					</h1>
					<p className="text-gray-700 text-lg mb-6 leading-relaxed">
						Your answers have been submitted. Sit tight — results will be available soon!
					</p>
					<blockquote className="italic text-blue-700 border-l-4 border-blue-300 pl-4 py-3 bg-blue-50 rounded-lg shadow-sm mb-6">
						"Design is not just what it looks like and feels like.<br />
						Design is how it works." <br />
						<span className="font-semibold">– Steve Jobs</span>
					</blockquote>
					<button
						onClick={() => (window.location.href = "/")}
						className="mt-4 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 hover:scale-105 transition-all"
					>
						Go Back Home
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
			<div className="bg-white shadow-2xl rounded-xl p-8 w-full relative">
				<div className={`mb-6 ${!started ? "flex items-center justify-between" : "text-center"}`}>
					<h1 className="text-2xl font-bold text-gray-800">
						{event} Web Design Quiz
					</h1>
					{!started && (
						<div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
							</svg>
							<span className="font-bold text-lg">{formatTime(timeLeft)}</span>
						</div>
					)}
				</div>
				{started ? (
					<div className="text-center">
						<button
							onClick={handleStart}
							className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
						>
							Start Quiz
						</button>
						{message && <p className="text-red-500 text-md mt-6">{message}</p>}
					</div>
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
						}}
						className="space-y-8"
					>
						{questions.map((q, qIndex) => (
							<div
								key={qIndex}
								ref={(el) => (questionRefs.current[qIndex] = el)}
								className={`p-5 border rounded-lg shadow-sm transition-all ${currentUnanswered === qIndex
									? "border-red-500 bg-red-50"
									: "border-gray-300 hover:shadow-md"
									}`}
							>
								<h2
									className="font-semibold text-gray-800 mb-4"
									style={{ whiteSpace: "pre-line" }}
								>
									{qIndex + 1}. {q.question.replace(/\\n/g, "\n")}
								</h2>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
									{q.options.map((option, oIndex) => (
										<label
											key={oIndex}
											className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${answers[qIndex] === option
												? "border-blue-500 bg-blue-50"
												: "border-gray-300 hover:border-blue-400"
												}`}
										>
											<input
												type="radio"
												name={`q${qIndex}`}
												value={option}
												checked={answers[qIndex] === option}
												onChange={() => handleSelect(qIndex, option)}
												className="w-4 h-4 text-blue-500"
											/>
											{q.questionType === "text" ? (
												<span className="text-gray-700">{option}</span>
											) : (
												<img
													src={`http://localhost:5003/uploads/${option}`}
													alt={`${apiUrl}/uploads/${option}`}
													className="w-full h-96 object-contain rounded-lg border"
												/>
											)}
										</label>
									))}
								</div>
								{currentUnanswered === qIndex && (
									<p className="text-red-500 mt-3">This is required.</p>
								)}
							</div>
						))}
						<div className="text-right">
							<button
								type="submit"
								className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
							>
								Submit Quiz
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	)
}

export default McqQuiz;