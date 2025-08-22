import React, { useState } from 'react';
import Topbar from '../components/TopBar';
import SideBar from '../components/SideBar';
import { Outlet } from 'react-router-dom';

function OverLayout() 
{
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    return (  
        <div className="relative min-h-screen overflow-hidden">
            {isSideBarOpen && ( <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-10" onClick={() => setIsSideBarOpen(false)}></div> )}
            {isSideBarOpen && <SideBar onClose={() => setIsSideBarOpen(false)} />}
            <div className={`relative z-0 transition duration-300 ${isSideBarOpen ? 'opacity-50 pointer-events-none' : ''}`}>
                <Topbar onClick={() => setIsSideBarOpen(true)} />
                <main> <Outlet /> </main>
            </div>
        </div>
    );
}

export default OverLayout;