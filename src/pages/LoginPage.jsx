import React, { useState, useRef, useEffect } from "react";
import JmcLogo from "../assets/JmcLogo.jpg";
import Jmc75 from "../assets/Jmc75.png";
import Swap from "../assets/SwapWM.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginForm() {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [teamId, setTeamId] = useState("");
    const [password, setPassword] = useState("");
    const { loginUser, error, setError } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teamId || !password) {
            setError("Username and Password must be filled.");
            return;
        } else {
            const data = await loginUser(`${apiUrl}/user/login`, teamId, password);
            if (data?.data?.user?.role && data?.data?.user?.event) {
                const roleType = localStorage.getItem('role');
                const eventName = localStorage.getItem('event');
                if (roleType === 'ADMIN') {
                    navigate(`/layout/${roleType}/${eventName}/${teamId}/participantsList`);
                }
                else if (roleType === 'SUPERADMIN') {

                }
                else {

                }
            }
        }
    }

    useEffect(() => { usernameRef.current?.focus() }, []);

    return (
        <div className="min-h-screen flex font-sans">

            {/* Left Branding Section */}
            <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-600 text-white p-10 shadow-2xl relative overflow-hidden">
                {/* Decorative blurred shapes */}
                <div className="absolute inset-0 opacity-25 pointer-events-none">
                    <div className="absolute w-96 h-96 bg-sky-600 rounded-full blur-[140px] top-[-50px] left-[-60px] animate-pulse"></div>
                    <div className="absolute w-80 h-80 bg-indigo-500 rounded-full blur-[140px] bottom-[-60px] right-[-60px] animate-pulse delay-200"></div>
                </div>
                {/* Logos */}
                <div className="flex items-center gap-8 mb-8 relative z-10">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300">
                        <img
                            src={JmcLogo}
                            alt="JMC Logo"
                            className="w-30 h-32"
                        />
                    </div>
                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300">
                        <img
                            src={Jmc75}
                            alt="75 Years"
                            className="w-32 h-32"
                        />
                    </div>
                </div>
                {/* College Name */}
                <p className="text-2xl font-bold tracking-wide text-center mb-4 drop-shadow-md">
                    JAMAL MOHAMED COLLEGE
                </p>
                <p className="text-md font-medium mb-3 opacity-80">( AUTONOMOUS )</p>
                {/* Accreditation */}
                <p className="text-md font-semibold mb-3 text-center leading-relaxed">
                    Accredited with <span className="font-bold text-yellow-300">A++ Grade by NAAC</span> (4th Cycle)
                    with CGPA <span className="font-bold">3.69</span> out of 4.0
                </p>
                {/* Affiliation */}
                <p className="text-md font-medium mb-3 opacity-80">(Affiliated to Bharathidasan University)</p>
                <p className="text-md font-medium mb-6 opacity-80">TIRUCHIRAPPALLI - 620 020.</p>
                {/* Department */}
                <p className="text-lg font-semibold text-center px-6 py-3 bg-white/10 rounded-xl 
                    shadow-md border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                    PG & RESEARCH DEPARTMENT OF COMPUTER SCIENCE
                </p>
            </div>

            {/* Right Login Section */}
            <div
                className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 relative bg-gray-50 overflow-hidden"
            >
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute w-72 h-72 bg-sky-300 rounded-full blur-3xl top-[-40px] left-[-40px]"></div>
                    <div className="absolute w-64 h-64 bg-indigo-300 rounded-full blur-3xl bottom-[-50px] right-[-50px]"></div>
                </div>
                <div className="w-full max-w-md relative rounded-2xl shadow-2xl border-t-4 border-blue-500 overflow-hidden bg-white">
                    <div
                        className="absolute inset-0 flex items-center justify-center opacity-8"
                        style={{
                            backgroundImage: `url(${Swap})`,
                            backgroundSize: "280px",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                    <div className="relative z-10 p-8 lg:p-10">
                        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                            SWAP STYLIFY
                        </h2>
                        <p className="text-gray-500 text-center mb-6">
                            Please login with your credentials
                        </p>
                        {error && <p className="text-red-500 text-md mb-6">{error}</p>}
                        <div className="relative mb-8">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="absolute left-4 top-4.5 text-blue-600"
                            />
                            <input
                                type="text"
                                ref={usernameRef}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        passwordRef.current?.focus();
                                    }
                                }}
                                className="w-full pl-12 pr-4 py-3 border border-gray-500 rounded-lg outline-none text-gray-700 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="USERNAME"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                                required
                            />
                        </div>
                        <div className="relative mb-8">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="absolute left-4 top-4.5 text-blue-600"
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                ref={passwordRef}
                                value={password}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                className="w-full pl-12 pr-4 py-3 border border-gray-500 rounded-lg outline-none text-gray-700 placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="PASSWORD"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 pr-1 text-gray-500 cursor-pointer"
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                <FontAwesomeIcon className='text-sm' icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-600 
                                text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-[1.01] 
                                flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FontAwesomeIcon icon={faLock} />
                            <span className="">LOGIN</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginForm;