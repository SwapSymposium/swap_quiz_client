import React from 'react';
import { Menu, LogOut } from 'lucide-react'
import { useLocation, matchPath, useNavigate } from 'react-router-dom';

function Topbar({ onClick }) {

    const location = useLocation();
    const navigate = useNavigate();

    let currentMenu = 'Menu';

    return (
        <div className='py-2 px-3 flex flex-row items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700'>
            <button onClick={onClick} className='p-1 rounded hover:bg-white/20 transition'><Menu color='white' size={24} /></button>
            <label className='text-white font-semibold text-lg '>{currentMenu}</label>
            <button onClick={() => navigate('/')} className='p-1.5 rounded hover:bg-white/20 transition'><LogOut color='white' size={22} /></button>
        </div>
    )
}

export default Topbar;