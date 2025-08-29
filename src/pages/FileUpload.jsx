import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";

function FileUpload() {

	const apiUrl = import.meta.env.VITE_API_URL;
	const [rules, setRules] = useState(null);
	const [questionsFile, setQuestionsFile] = useState(null);
	const [userFile, setUserFile] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleRulesFileChange = (e) => setRules(e.target.files[0]);
	const handleQuestionsFileChange = (e) => setQuestionsFile(e.target.files[0]);
	const handleUserFileChange = (e) => setUserFile(e.target.files[0]);

	// Rule File Upload

	const handleUploadRules = async (e) => {
		e.preventDefault();
		if (!rules) return alert("Please select a Rules file");
		setLoading(true);
		const formData = new FormData();
		formData.append("file", rules);
		try {
			const res = await axios.post(`${apiUrl}/api/rules/uploadrules`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			alert("Rules Uploaded Successfully!");
		} catch (err) { alert("Rules Upload Failed") }
		finally { setLoading(false) }
	}

	// Question File Upload

	const handleUploadQuestions = async (e) => {
		e.preventDefault();
		if (!questionsFile) return alert("Please select a Questions file");
		setLoading(true);
		const formData = new FormData();
		formData.append("file", questionsFile);
		try {
			const res = await axios.post(`${apiUrl}/api/questions/uploadquestion`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			alert("Questions Uploaded Successfully!");
		} catch (err) { alert("Questions Upload Failed") }
		finally { setLoading(false) }
	}

	// Participants File Upload

	const handleUploadUser = async (e) => {
		e.preventDefault();
		if (!userFile) return alert("Please select a User file");
		setLoading(true);
		const formData = new FormData();
		formData.append("file", userFile);
		try {
			const res = await axios.post(`${apiUrl}/api/users/uploadusers`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			alert("User Uploaded Successfully!")
		} catch (err) { alert("User Upload Failed") }
		finally { setLoading(false) }
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
				{/* User Upload */}
				<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
					<p className="font-semibold">Participants File</p>
					<label className="w-full text-center cursor-pointer">
						<input type="file" name="userfile" onChange={handleUserFileChange} className="hidden" />
						<div className="flex flex-col items-center gap-2">
							<UploadCloud className="h-10 w-10 text-blue-500" />
							<span className="text-sm text-gray-600">
								{userFile ? userFile.name : "Click to select a Participants file"}
							</span>
						</div>
					</label>
					<button
						onClick={handleUploadUser}
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
					>
						{loading ? "Uploading..." : "Upload Participants"}
					</button>
				</div>
				{/* Questions Upload */}
				<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
					<p className="font-semibold">Questions File</p>
					<label className="w-full text-center cursor-pointer">
						<input type="file" name="questionsfile" onChange={handleQuestionsFileChange} className="hidden" />
						<div className="flex flex-col items-center gap-2">
							<UploadCloud className="h-10 w-10 text-blue-500" />
							<span className="text-sm text-gray-600">
								{questionsFile ? questionsFile.name : "Click to select a Questions file"}
							</span>
						</div>
					</label>
					<button
						onClick={handleUploadQuestions}
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
					>
						{loading ? "Uploading..." : "Upload Questions"}
					</button>
				</div>
				{/* Rules Upload */}
				<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col items-center gap-4 hover:shadow-lg transition">
					<p className="font-semibold">Rules File</p>
					<label className="w-full text-center cursor-pointer">
						<input type="file" name="rulesfile" onChange={handleRulesFileChange} className="hidden" />
						<div className="flex flex-col items-center gap-2">
							<UploadCloud className="h-10 w-10 text-blue-500" />
							<span className="text-sm text-gray-600">
								{rules ? rules.name : "Click to select a Rules file"}
							</span>
						</div>
					</label>
					<button
						onClick={handleUploadRules}
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
					>
						{loading ? "Uploading..." : "Upload Rules"}
					</button>
				</div>
			</div>
			{loading && <LoadingModal loading={loading} />}
		</div>
	)
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