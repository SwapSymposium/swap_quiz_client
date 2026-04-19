import React, { useMemo, useCallback, useState } from 'react';
import { useParams, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { Menu, LogOut, Bell, UserCircle, ChevronDown, Settings, HelpCircle } from 'lucide-react';

const MENU_ROUTES = [
    { path: '/layout/:role/:eventName/:teamId/participantsList', name: 'Participants List', icon: 'users' },
    { path: '/layout/:role/:eventName/:teamId/fileUpload', name: 'File Upload', icon: 'file' },
    { path: '/layout/:role/:eventName/:teamId/imageUpload', name: 'Image Upload', icon: 'image' },
    { path: '/layout/:role/:eventName/:teamId/guidelines', name: 'Event Guidelines', icon: 'book' },
    { path: '/layout/:role/:eventName/:teamId/quiz', name: 'Assessment', icon: 'clipboard' },
    { path: '/layout/:role/:eventName/:teamId/settings', name: 'System Settings', icon: 'settings' },
    { path: '/layout/:role/:eventName/:teamId/report', name: 'Quiz Report', icon: 'chart' },
];

const USER_ROLES = {
    SUPERADMIN: 'Super Administrator',
    ADMIN: 'Administrator',
    USER: 'Participant',
    GUEST: 'Guest User'
};

const Topbar = ({ onClick, userName, userAvatar }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const { eventName, teamId } = useParams();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const role = sessionStorage.getItem('role');
    const displayName = userName || sessionStorage.getItem('userName') || role?.toLowerCase() || 'User';

    const currentMenuName = useMemo(() => {
        const activeRoute = MENU_ROUTES.find(route =>
            matchPath({ path: route.path, end: true }, location.pathname)
        );
        return activeRoute?.name || 'Dashboard';
    }, [location.pathname]);

    const breadcrumbs = useMemo(() => {
        const crumbs = [];
        if (eventName) {
            crumbs.push({ label: eventName.replace(/-/g, ' '), path: `/layout/${role}/${eventName}/${teamId}` });
        }
        if (currentMenuName !== 'Dashboard') {
            crumbs.push({ label: currentMenuName });
        }
        return crumbs;
    }, [eventName, currentMenuName, role, teamId]);

    const handleLogout = useCallback(async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                sessionStorage.clear();
                localStorage.removeItem('userPreferences');
                navigate("/", { replace: true });
            } catch (error) {
                console.error('Logout error:', error);
                sessionStorage.clear();
                navigate("/", { replace: true });
            }
        }
    }, [navigate]);

    const handleUserMenuToggle = () => setShowUserMenu(!showUserMenu);

    const getRoleDisplayName = () => {
        return USER_ROLES[role] || role?.toLowerCase() || 'User';
    };

    return (
        <header className="h-16 px-6 lg:px-8 flex items-center justify-between bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[100]">

            {/* Left Section: Navigation & Title */}
            <div className="flex items-center gap-4 lg:gap-6">
                <button
                    onClick={onClick}
                    className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Toggle menu"
                >
                    <Menu size={20} className="text-gray-600 hover:text-blue-600 transition-colors" />
                </button>

                <div className="flex flex-col justify-center">
                    {/* Breadcrumb Navigation */}
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center text-md text-gray-500" aria-label="Breadcrumb">
                            <span className="text-blue-600 font-medium">SWAP QUIZ</span>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    <span className="mx-2">/</span>
                                    <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                                        {crumb.label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav>
                    )}
                </div>
            </div>

            {/* Right Section: User Actions */}
            <div className="flex items-center gap-3 lg:gap-4">
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />

                {/* User Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={handleUserMenuToggle}
                        className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-expanded={showUserMenu}
                        aria-label="User menu"
                    >
                        {/* Avatar */}
                        <div className="relative">
                            {userAvatar ? (
                                <img
                                    src={userAvatar}
                                    alt={displayName}
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-200">
                                    <UserCircle size={20} className="text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        {/* User Info - Hidden on mobile */}
                        <div className="hidden lg:block text-left">
                            <p className="text-sm uppercase font-semibold text-gray-700 leading-tight">
                                {displayName}
                            </p>
                            <p className="text-xs text-gray-500">
                                {getRoleDisplayName()}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-200 hidden sm:block ${showUserMenu ? 'rotate-180' : ''
                                }`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 animate-in slide-in-from-top-2">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm uppercase font-semibold text-gray-900">{displayName}</p>
                                    <p className="text-xs text-blue-600 mt-1 capitalize">{getRoleDisplayName()}</p>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;