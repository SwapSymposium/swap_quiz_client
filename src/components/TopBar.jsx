import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const menuRoutes = [
    { path: '/layout/:role/:eventName/:teamId/participantsList', name: 'Participants List' },
    { path: '/layout/:role/:eventName/:teamId/fileUpload', name: 'File Upload' },
    { path: '/layout/:role/:eventName/:teamId/imageUpload', name: 'Image Upload' },
    { path: '/layout/:role/:eventName/:teamId/guidelines', name: 'Guidelines' },
    { path: '/layout/:role/:eventName/:teamId/quiz', name: 'MCQ Quiz' },
    { path: '/layout/:role/:eventName/:teamId/settings', name: 'Settings' },
    { path: '/layout/:role/:eventName/:teamId/report', name: 'Quiz Report' },
]

function Topbar({ onClick }) {

    const location = useLocation();
    const navigate = useNavigate();
    let currentMenu = 'Menu';

    menuRoutes.forEach((route) => {
        const pathRegex = new RegExp('^' + route.path.replace(/:[^\s/]+/g, '[\\w-]+') + '$')
        if (pathRegex.test(location.pathname)) { currentMenu = route.name }
    })

    const handleLogout = () => { sessionStorage.clear(); navigate("/", { replace: true })}

    return (
        <div className='py-2 px-3 flex items-center justify-between bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500'>
            <button onClick={onClick} className='p-1 rounded hover:bg-white/20 transition'>
                <Menu color='white' size={24} />
            </button>
            <label className='text-white font-semibold text-lg'>{currentMenu}</label>
            <button onClick={handleLogout} className='p-1.5 rounded hover:bg-white/20 transition'>
                <LogOut color='white' size={22} />
            </button>
        </div>
    )
}

export default Topbar;