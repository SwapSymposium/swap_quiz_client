import { useState } from "react";
import { addDataAPI } from "../services/api";

export const useAdd = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addData = async (apiUrl, formData) => {
        setLoading(true); setError(null);
        try {
            const data = await addDataAPI(apiUrl, formData);
            setLoading(false); return data;
        } catch (error) {
            setError(error.response?.data?.message || 'Error occurred');
            setLoading(false); return null;
        }
    }
    return { addData, loading, error }
}