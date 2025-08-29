import axios from 'axios';

export const login = async (apiUrl, teamId, password) => {
    const response = await axios.post(`${apiUrl}`, { teamId, password })
    return response;
}

export const verifyTokenAPI = async (apiUrl, teamId) => {
    const token = sessionStorage.getItem('authToken')
    if (!token) return;
    try {
        const response = await axios.post(`${apiUrl}/api/user/verifyToken`, { teamId }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        // console.log(response)
        return response;
    } catch (error) {
        console.log('Error in Verifying Token : ', error)
        return null;
    }
}

export const addDataAPI = async (apiUrl, formData) => {
    const response = await axios.post(`${apiUrl}`, formData);
    return response;
}

export const fetchDataAPI = async (apiUrl, formData) => {
    const response = await axios.post(`${apiUrl}`, formData )
    return response;
}

export const EditDataAPI = async (apiUrl, formData) => {
    const response = await axios.put(`${apiUrl}`, formData)
    return response;
}

export const deleteDataAPI = async (apiUrl, id) => {
    await axios.delete(`${apiUrl}`, { data: { id } }); return;
}