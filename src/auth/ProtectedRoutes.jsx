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

    if (isValid === null) { return <div>Loading...</div> }

    return isValid ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;