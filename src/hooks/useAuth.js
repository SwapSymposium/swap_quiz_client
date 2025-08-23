import { useState } from 'react';
import { login } from '../services/api';

export const useAuth = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginUser = async (apiUrl, teamId, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(apiUrl, teamId, password);
            if (response?.data.status === 200 && response?.data?.token) {
                sessionStorage.setItem('authToken', response.data.token);
                if (response.data.user.role && response.data.user.event) {
                    sessionStorage.setItem('role', response.data.user.role);
                    sessionStorage.setItem('event', response.data.user.event);
                }
            }
            setLoading(false);
            return response;
        } catch (error) {
            setError(error.response?.data?.message || 'Login Failed');
            setLoading(false);
            return null;
        }
    }
    
    return { loginUser, loading, error, setError }
}