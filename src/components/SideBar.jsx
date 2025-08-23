import React from 'react';
import { X } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import Login from '../assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faGear, faUserGroup, faFileCircleCheck, faRightFromBracket, faFileUpload, faFileImage } from '@fortawesome/free-solid-svg-icons';

function SideBar({ onClose }) {

    const { teamId } = useParams();
    const roleType = localStorage.getItem('role');
    const eventName = localStorage.getItem('event');

    const navItems = [
        { name: 'Participants List', path: `/layout/${roleType}/${eventName}/${teamId}/participantsList`, icon: faUserGroup, show: roleType === 'ADMIN' },
        { name: 'File Upload', path: `/layout/${roleType}/${eventName}/${teamId}/fileUpload`, icon: faFileUpload, show: roleType === 'ADMIN' },
        { name: 'Image Upload', path: `/layout/${roleType}/${eventName}/${teamId}/imageUpload`, icon: faFileImage, show: roleType === 'ADMIN' },
        { name: 'Guidelines', path: `/layout/${roleType}/${eventName}/${teamId}/guidelines`, icon: faClipboardList, show: roleType === 'PARTICIPANTS' },
        { name: 'MCQ Quiz', path: `/layout/${roleType}/${eventName}/${teamId}/quiz`, icon: faFileCircleCheck, show: roleType === 'PARTICIPANTS' },
        { name: 'Settings', path: `/layout/${roleType}/${eventName}/${teamId}/settings`, icon: faGear, show: roleType === 'ADMIN' },
        { name: 'Quiz Report', path: `/layout/${roleType}/${eventName}/${teamId}/report`, icon: faClipboardList, show: roleType === 'ADMIN' },
        { name: 'Logout', path: '/', icon: faRightFromBracket, show: true },
    ];

    const renderNavItem = (item) => (
        
        <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
                `group flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-300
                ${isActive ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-500/50 hover:scale-103'}`
            }
        >
            {({ isActive }) => (
                <>
                    <div
                        className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-300
                            ${isActive
                                ? 'bg-gray-100 text-blue-600 shadow-md'
                                : 'bg-blue-600 text-white group-hover:text-white group-hover:bg-gradient-to-br group-hover:from-blue-400 group-hover:to-blue-600 group-hover:shadow-lg'
                            }`}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            className="transition-transform duration-300 group-hover:scale-105 text-md"
                        />
                    </div>
                    <span
                        className={`font-medium tracking-wide transition-colors duration-300 text-white  ${isActive ? '' : 'group-hover:text-white'}` }
                    >
                        {item.name}
                    </span>
                </>
            )}
        </NavLink>
    )

    return (
        <div
            className="fixed top-0 left-0 h-full w-72 py-6 px-4 
                    bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600
                    bg-opacity-95 backdrop-blur-xl
                    shadow-2xl border-r border-white/20
                    z-30 overflow-y-auto transition-transform duration-300"
        >
            <button
                className="absolute top-4 right-4 hover:bg-white/30 p-1 transition"
                onClick={onClose}
            >
                <X className="h-5 w-5 text-white" />
            </button>
            <div className="flex flex-col items-center gap-3 mt-12 mb-8">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-white/30 blur-lg"></div>
                    <img
                        src={Login}
                        alt="Profile"
                        className="w-20 h-20 rounded-full shadow-lg border-2 border-white relative z-10"
                    />
                </div>
                <span className="text-white font-bold text-md mt-3 uppercase tracking-wide">{teamId}</span>
            </div>
            <nav className="flex flex-col gap-2.5">
                {navItems.filter(item => item.show).map(renderNavItem)}
            </nav>
        </div>
    )
}

export default SideBar;