import { Navigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { verifyTokenAPI } from "../services/api";
const apiUrl = import.meta.env.VITE_API_URL

const ProtectedRoute = ({ children }) => {

    const [isValid, setIsValid] = useState(null);
    const { teamId } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            const result = await verifyTokenAPI(apiUrl, teamId);
            if (result && result.status === 200) { setIsValid(true) }
            else {
                sessionStorage.removeItem('authToken');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('event');
                setIsValid(false)
            }
        }
        verifyToken()
    }, [])

    if (isValid === null) {
        return (
            <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-lg font-semibold">Uploading...</h2>
                    <div className="mt-2 animate-spin border-4 border-blue-400 border-t-transparent rounded-full h-10 w-10 mx-auto"></div>
                </div>
            </div>
        )
    }

    return isValid ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;