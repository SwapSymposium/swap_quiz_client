import { useState } from "react";
import { deleteDataAPI } from "../services/user";

export const useDelete = (apiUrl, id) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (apiUrl, id) => {

        setLoading(true); setError(null);

        try {
            await deleteDataAPI(apiUrl, id);
            setLoading(false); return;
        } catch (error) {
            setError(error.message || 'Error occurred');
            setLoading(false); return null;
        }
    }
    return { deleteData, loading, error }
}