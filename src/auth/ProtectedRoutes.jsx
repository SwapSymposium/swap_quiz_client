import { Navigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { verifyTokenAPI } from "../services/api";

const ProtectedRoute = ({ children }) => {

    const [isValid, setIsValid] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const verifyToken = async () => {
            const result = await verifyTokenAPI(userId);
            console.log(result)
            if (result && result.status === 200) { setIsValid(true) }
            else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('role');
                setIsValid(false)
            }
        }
        verifyToken()
    }, [])

    if (isValid === null) { return <div>Loading...</div> }

    return isValid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;