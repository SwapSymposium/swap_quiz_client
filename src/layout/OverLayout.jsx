import React, { useState } from 'react';
import Topbar from '../components/TopBar';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

function OverLayout() {

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            {/* Overlay for Mobile/Interaction */}
            {isSideBarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsSideBarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <SideBar isOpen={isSideBarOpen} onClose={() => setIsSideBarOpen(false)} />

            {/* Main Content Area */}
            <div className={`relative flex flex-col min-h-screen transition-all duration-300 ${isSideBarOpen ? 'blur-[2px]' : ''}`}>
                <Topbar onClick={() => setIsSideBarOpen(true)} />
                <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default OverLayout;