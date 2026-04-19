import React from 'react';
import { X } from 'lucide-react';
import { NavLink, useParams } from 'react-router-dom';
import Login from '../assets/login.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faGear, faUserGroup, faFileCircleCheck, faRightFromBracket, faFileUpload, faFileImage, faDatabase } from '@fortawesome/free-solid-svg-icons';

function SideBar({ isOpen, onClose }) {

    const { teamId } = useParams();
    const roleType = sessionStorage.getItem('role');
    const eventName = sessionStorage.getItem('event');

    const navItems = [
        { name: 'Participants List', path: `/layout/${roleType}/${eventName}/${teamId}/participantsList`, icon: faUserGroup, show: roleType === 'ADMIN' },
        { name: 'User Manage', path: `/layout/${roleType}/${eventName}/${teamId}/userManage`, icon: faUserGroup, show: roleType === 'SUPERADMIN' },
        { name: 'Data Deletion', path: `/layout/${roleType}/${eventName}/${teamId}/dataDeletion`, icon: faDatabase, show: roleType === 'SUPERADMIN' },
        { name: 'File Upload', path: `/layout/${roleType}/${eventName}/${teamId}/fileUpload`, icon: faFileUpload, show: roleType === 'ADMIN' },
        { name: 'Image Upload', path: `/layout/${roleType}/${eventName}/${teamId}/imageUpload`, icon: faFileImage, show: roleType === 'ADMIN' },
        { name: 'Guidelines', path: `/layout/${roleType}/${eventName}/${teamId}/participantsGuideLines`, icon: faClipboardList, show: roleType === 'PARTICIPANTS' },
        { name: 'Guidelines', path: `/layout/${roleType}/${eventName}/${teamId}/superAdminGuidelines`, icon: faClipboardList, show: roleType === 'SUPERADMIN' },
        { name: 'MCQ Quiz', path: `/layout/${roleType}/${eventName}/${teamId}/quiz`, icon: faFileCircleCheck, show: roleType === 'PARTICIPANTS' },
        { name: 'Settings', path: `/layout/${roleType}/${eventName}/${teamId}/settings`, icon: faGear, show: roleType === 'ADMIN' },
        { name: 'Quiz Report', path: `/layout/${roleType}/${eventName}/${teamId}/report`, icon: faClipboardList, show: roleType === 'ADMIN' },
        { name: 'Logout', path: '/', icon: faRightFromBracket, show: true },
    ];

    return (
        <aside className={`fixed top-0 left-0 h-full w-76 bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out border-r border-blue-100 ${isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
            {/* Header / Close */}
            <div className="p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">A</div>
                    <span className="text-blue-900 font-bold tracking-tight">AdminPanel</span>
                </div>
                <button onClick={onClose} className="text-blue-400 hover:text-blue-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Profile Section */}
            <div className="px-6 mb-8 mt-4">
                <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center border border-blue-100">
                    <div className="relative">
                        <img src={Login} alt="Profile" className="w-16 h-16 rounded-full border-2 border-blue-500 p-0.5 object-cover" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <h3 className="text-blue-900 font-bold mt-3 text-sm tracking-wide uppercase">{teamId}</h3>
                    <p className="text-blue-600 text-[10px] font-medium tracking-[0.2em] uppercase mt-1">{roleType}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-4 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                {navItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                            if (item.name === 'Logout') {
                                sessionStorage.removeItem('authToken');
                                sessionStorage.removeItem('role');
                                sessionStorage.removeItem('event');
                            }
                            onClose();
                        }}
                        className={({ isActive }) => `
                            group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                            ${isActive
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'}
                        `}
                    >
                        <FontAwesomeIcon icon={item.icon} className="text-lg min-w-[20px]" />
                        <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer decoration */}
            <div className="absolute bottom-6 left-6 right-6">
                <div className="h-[1px] bg-blue-100 w-full mb-4"></div>
                <p className="text-[10px] text-blue-400 text-center uppercase tracking-widest font-bold">Jmc Swap Quiz </p>
            </div>
        </aside>
    );
}

export default SideBar;