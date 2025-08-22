import { useState } from "react";
import { fetchDataAPI } from "../services/api";

export const useFetch = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchData = async (apiUrl, formData) => {
        setLoading(true); 
        setError(null);
        try {
            const response = await fetchDataAPI(apiUrl, formData);
            setLoading(false); 
            setData(response); 
            return response;
        } catch (error) {
            setError(error.message || 'Error Occured');
            setLoading(false); return null
        }
    }
    return { fetchData, loading, error, data }
}