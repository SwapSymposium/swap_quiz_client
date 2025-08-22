import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverLayout from './layout/OverLayout';
import GuideLines from './pages/GuideLines';
import McqQuiz from './pages/McqQuiz';
import Settings from './pages/Settings';
import Report from './pages/Report';
import Manage from './pages/Manage';
import FileUpload from './pages/FileUpload';

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/layout/:roleType/:eventName/:teamId/*" element={<OverLayout />}>
					<Route path="guidelines" element={<GuideLines />} />
					<Route path="quiz" element={<McqQuiz />} />
					<Route path="settings" element={<Settings />} />
					<Route path="report" element={<Report />} />
					<Route path="participantsList" element={<Manage />} />
					<Route path="fileUpload" element={<FileUpload />} />
				</Route>
			</Routes>
		</Router>
	)
}

export default App;
