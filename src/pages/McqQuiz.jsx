import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdd } from "../hooks/useAdd";
import { useFetch } from "../hooks/useFetch";
import Galileo from "../assets/Galileo.jpg";
import Thomas from "../assets/Thomas.jpg";
import Newton from "../assets/Newton.jpeg";
import Babbage from "../assets/Babbage.jpeg";

const McqQuiz = () => {

	const apiUrl = import.meta.env.VITE_API_URL;
	const { userId } = useParams();
	const [timeLeft, setTimeLeft] = useState(0.5 * 60);
	const [timerStarted, setTimerStarted] = useState(false);

	const questions = [
		{
			q: "What is the capital of France?",
			options: [
				{ type: "text", value: "Berlin" },
				{ type: "text", value: "Madrid" },
				{ type: "text", value: "Paris" },
				{ type: "text", value: "Rome" }
			],
			answer: "Paris",
			marks: 1
		},
		{
			q: "What will be the output of this JavaScript code?\nlet x = 5;\nlet y = '5';\nconsole.log(x == y);\nconsole.log(x === y);\n",
			options: [
				{ type: "text", value: "true true" },
				{ type: "text", value: "true false" },
				{ type: "text", value: "false true" },
				{ type: "text", value: "false false" }
			],
			answer: "true false",
			marks: 1

		},
		{
			q: "Which is the largest mammal?",
			options: [
				{ type: "text", value: "African Elephant" },
				{ type: "text", value: "Blue Whale" },
				{ type: "text", value: "Giraffe" },
				{ type: "text", value: "Hippopotamus" }
			],
			answer: "Blue Whale",
			marks: 1
		},
		{
			q: "What is the capital of Japan?",
			options: [
				{ type: "text", value: "Seoul" },
				{ type: "text", value: "Beijing" },
				{ type: "text", value: "Tokyo" },
				{ type: "text", value: "Bangkok" }
			],
			answer: "Tokyo",
			marks: 1
		},
		{
			q: "Which ocean is the largest?",
			options: [
				{ type: "text", value: "Atlantic" },
				{ type: "text", value: "Indian" },
				{ type: "text", value: "Pacific" },
				{ type: "text", value: "Arctic" }
			],
			answer: "Pacific",
			marks: 1
		},
		{
			q: "Who discovered gravity?",
			options: [
				{ type: "text", value: "Albert Einstein" },
				{ type: "text", value: "Isaac Newton" },
				{ type: "text", value: "Galileo Galilei" },
				{ type: "text", value: "Nikola Tesla" }
			],
			answer: "Isaac Newton",
			marks: 1
		},
		{
			q: "Which is the tallest mountain?",
			options: [
				{ type: "text", value: "Mount Everest" },
				{ type: "text", value: "K2" },
				{ type: "text", value: "Kangchenjunga" },
				{ type: "text", value: "Makalu" }
			],
			answer: "Mount Everest",
			marks: 1
		},
		{
			q: "What is the hardest natural substance?",
			options: [
				{ type: "text", value: "Gold" },
				{ type: "text", value: "Diamond" },
				{ type: "text", value: "Iron" },
				{ type: "text", value: "Platinum" }
			],
			answer: "Diamond",
			marks: 1
		},
		{
			q: "Which gas do plants absorb?",
			options: [
				{ type: "text", value: "Oxygen" },
				{ type: "text", value: "Nitrogen" },
				{ type: "text", value: "Carbon Dioxide" },
				{ type: "text", value: "Helium" }
			],
			answer: "Carbon Dioxide",
			marks: 1
		},
		{
			q: "Which is the fastest land animal?",
			options: [
				{ type: "text", value: "Cheetah" },
				{ type: "text", value: "Tiger" },
				{ type: "text", value: "Horse" },
				{ type: "text", value: "Leopard" }
			],
			answer: "Cheetah",
			marks: 1
		},

		{
			q: "Choose the correct form: She ___ to school every day.",
			options: [
				{ type: "text", value: "go" },
				{ type: "text", value: "goes" },
				{ type: "text", value: "gone" },
				{ type: "text", value: "going" }
			],
			answer: "goes",
			marks: 1
		},
		{
			q: "Select the correct article: He bought ___ apple.",
			options: [
				{ type: "text", value: "a" },
				{ type: "text", value: "an" },
				{ type: "text", value: "the" },
				{ type: "text", value: "no article" }
			],
			answer: "an",
			marks: 1
		},
		{
			q: "Which is the correct past tense of 'write'?",
			options: [
				{ type: "text", value: "writed" },
				{ type: "text", value: "wrote" },
				{ type: "text", value: "written" },
				{ type: "text", value: "writes" }
			],
			answer: "wrote",
			marks: 1
		},
		{
			q: "Choose the correct pronoun: This is ___ book.",
			options: [
				{ type: "text", value: "me" },
				{ type: "text", value: "mine" },
				{ type: "text", value: "I" },
				{ type: "text", value: "my" }
			],
			answer: "my",
			marks: 1
		},
		{
			q: "Which sentence is correct?",
			options: [
				{ type: "text", value: "He don’t like tea." },
				{ type: "text", value: "He doesn’t like tea." },
				{ type: "text", value: "He doesn’t likes tea." },
				{ type: "text", value: "He don’t likes tea." }
			],
			answer: "He doesn’t like tea.",
			marks: 1
		},
		{
			q: "Identify the adjective: The sky is blue.",
			options: [
				{ type: "text", value: "sky" },
				{ type: "text", value: "is" },
				{ type: "text", value: "blue" },
				{ type: "text", value: "the" }
			],
			answer: "blue",
			marks: 1
		},
		{
			q: "Select the correct preposition: The cat is ___ the table.",
			options: [
				{ type: "text", value: "in" },
				{ type: "text", value: "on" },
				{ type: "text", value: "at" },
				{ type: "text", value: "into" }
			],
			answer: "on",
			marks: 1
		},
		{
			q: "What is the plural of 'child'?",
			options: [
				{ type: "text", value: "childs" },
				{ type: "text", value: "children" },
				{ type: "text", value: "childes" },
				{ type: "text", value: "childrens" }
			],
			answer: "children",
			marks: 1
		},
		{
			q: "Which sentence is in passive voice?",
			options: [
				{ type: "text", value: "The boy kicked the ball." },
				{ type: "text", value: "The ball was kicked by the boy." },
				{ type: "text", value: "The boy is kicking the ball." },
				{ type: "text", value: "The boy kicks the ball." }
			],
			answer: "The ball was kicked by the boy.",
			marks: 1
		},
		{
			q: "Fill in the blank: She has been living here ___ 2010.",
			options: [
				{ type: "text", value: "for" },
				{ type: "text", value: "since" },
				{ type: "text", value: "from" },
				{ type: "text", value: "by" }
			],
			answer: "since",
			marks: 1
		},
		{
			q: "Which is a conjunction?",
			options: [
				{ type: "text", value: "Quickly" },
				{ type: "text", value: "And" },
				{ type: "text", value: "Sky" },
				{ type: "text", value: "Blue" }
			],
			answer: "And",
			marks: 1
		},
		{
			q: "Identify the adverb: She sings beautifully.",
			options: [
				{ type: "text", value: "She" },
				{ type: "text", value: "sings" },
				{ type: "text", value: "beautifully" },
				{ type: "text", value: "song" }
			],
			answer: "beautifully",
			marks: 1
		},
		{
			q: "What is the comparative of 'good'?",
			options: [
				{ type: "text", value: "gooder" },
				{ type: "text", value: "better" },
				{ type: "text", value: "best" },
				{ type: "text", value: "more good" }
			],
			answer: "better",
			marks: 1
		},
		{
			q: "Choose the correct sentence:",
			options: [
				{ type: "text", value: "She enjoy reading books." },
				{ type: "text", value: "She enjoys reading books." },
				{ type: "text", value: "She enjoying reading books." },
				{ type: "text", value: "She enjoyed reading book." }
			],
			answer: "She enjoys reading books.",
			marks: 1
		},
		{
			q: "Select the correct question tag: You are coming, ___?",
			options: [
				{ type: "text", value: "isn’t you" },
				{ type: "text", value: "aren’t you" },
				{ type: "text", value: "don’t you" },
				{ type: "text", value: "won’t you" }
			],
			answer: "aren’t you",
			marks: 1
		},
		{
			q: "Choose the synonym of 'happy'.",
			options: [
				{ type: "text", value: "Sad" },
				{ type: "text", value: "Joyful" },
				{ type: "text", value: "Angry" },
				{ type: "text", value: "Tired" }
			],
			answer: "Joyful",
			marks: 1
		},
		{
			q: "Choose the antonym of 'difficult'.",
			options: [
				{ type: "text", value: "Easy" },
				{ type: "text", value: "Hard" },
				{ type: "text", value: "Tough" },
				{ type: "text", value: "Complicated" }
			],
			answer: "Easy",
			marks: 1
		},
		{
			q: "Which tense is this sentence in? She is eating.",
			options: [
				{ type: "text", value: "Simple Present" },
				{ type: "text", value: "Present Continuous" },
				{ type: "text", value: "Present Perfect" },
				{ type: "text", value: "Past Continuous" }
			],
			answer: "Present Continuous",
			marks: 1
		},
		{
			q: "Choose the correct reported speech: He said, 'I am tired'.",
			options: [
				{ type: "text", value: "He said he was tired." },
				{ type: "text", value: "He said he is tired." },
				{ type: "text", value: "He said I am tired." },
				{ type: "text", value: "He said that he will tired." }
			],
			answer: "He said he was tired.",
			marks: 1
		},
		{
			q: "Which is the correct sentence?",
			options: [
				{ type: "text", value: "She don’t know the answer." },
				{ type: "text", value: "She doesn’t knows the answer." },
				{ type: "text", value: "She doesn’t know the answer." },
				{ type: "text", value: "She not know the answer." }
			],
			answer: "She doesn’t know the answer.",
			marks: 1
		},
		{
			q: "Which of these photo is Charles Babbage?",
			options: [
				{ type: "image", value: Babbage },
				{ type: "image", value: Newton },
				{ type: "image", value: Galileo },
				{ type: "image", value: Thomas }
			],
			answer: Babbage,
			marks: 1
		}
	]

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
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
	};

	useEffect(() => {
		answersRef.current = answers;
	}, [answers]);

	useEffect(() => {
		const checkAlreadyAttended = async () => {
			const response = await fetchData(`${apiUrl}/participants/alreadyAttended`, { userId });
			if (response?.attended) { setAlreadyAttendedFlag(true) }
		}
		checkAlreadyAttended();
	}, [apiUrl, userId]);

	const handleSelect = (qIndex, option) => {
		setAnswers((prev) => ({ ...prev, [qIndex]: option }));
		if (qIndex === currentUnanswered) {
			setCurrentUnanswered(null);
		}
	}

	const scores = useMemo(() => {
		return Object.keys(answers).reduce(
			(total, key) => total + (answers[key] === questions[key].answer ? 1 : 0),
			0
		);
	}, [answers]);

	const handleStart = async () => {
		const response = await fetchData(`${apiUrl}/participants/startRights`, { userId });
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
							userId, scores: finalScore, answers: allAnswers
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
		const response = await addData(`${apiUrl}/participants/quizSave`, { userId, scores, answers })
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
						Quiz Completed Successfully!
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
				<div className={`mb-6  ${!started ? "flex items-center justify-between" : "text-center"}`}>
					<h1 className="text-2xl font-bold text-gray-800">
						Stylify Web Design Quiz
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
								<h2 className="font-semibold text-gray-800 mb-4" style={{ whiteSpace: "pre-line" }}>
									{qIndex + 1}. {q.q}
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
									{q.options.map((option, oIndex) => (
										<label
											key={oIndex}
											className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${answers[qIndex] === option.value
												? "border-blue-500 bg-blue-50"
												: "border-gray-300 hover:border-blue-400"
												}`}
										>
											<input
												type="radio"
												name={`q${qIndex}`}
												value={option.value}
												checked={answers[qIndex] === option.value}
												onChange={() => handleSelect(qIndex, option.value)}
												className="w-4 h-4 text-blue-500"
											/>
											{option.type === "text" ? (
												<span className="text-gray-700">{option.value}</span>
											) : (
												<img
													src={option.value}
													alt={`Option ${oIndex + 1}`}
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