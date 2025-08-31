import { useState } from "react";
import { deleteDataAPI } from "../services/api";

export const useDelete = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (apiUrl, formData) => {
        setLoading(true); setError(null);
        try {
            await deleteDataAPI(apiUrl, formData);
            setLoading(false); return;
        } catch (error) {
            setError(error.message || 'Error occurred');
            setLoading(false); return null;
        }
    }
    return { deleteData, loading, error }
}