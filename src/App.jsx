import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OverLayout from './layout/OverLayout';
import GuideLines from './pages/GuideLines';
import McqQuiz from './pages/McqQuiz';
import Settings from './pages/Settings';
import Report from './pages/Report';
import Participants from './pages/Participants';
import FileUpload from './pages/FileUpload';
import ImageUpload from './pages/ImageUpload';
import ProtectedRoute from './auth/ProtectedRoutes';
import UserManage from './pages/UserManage';

function App() {

	return (
		<Router>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/layout/:roleType/:eventName/:teamId/*"
					element={<ProtectedRoute>
						<OverLayout />
					</ProtectedRoute>}
				>
					<Route path="guidelines" element={<GuideLines />} />
					<Route path="quiz" element={<McqQuiz />} />
					<Route path="settings" element={<Settings />} />
					<Route path="report" element={<Report />} />
					<Route path="participantsList" element={<Participants />} />
					<Route path="fileUpload" element={<FileUpload />} />
					<Route path="imageUpload" element={<ImageUpload />} />
					<Route path="usermanage" element={<UserManage />} />
				</Route>
			</Routes>
		</Router>
	)
}

export default App;
