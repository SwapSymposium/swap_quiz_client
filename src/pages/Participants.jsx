import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { useAdd } from '../hooks/useAdd';
import { useFetch } from '../hooks/useFetch';

function Participants() {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        teamId: '', password: 'JMC', participants: [''],
        contactNo: '', deptName: '', clgName: ''
    });
    const apiUrl = import.meta.env.VITE_API_URL;
    const event = localStorage.getItem('event');

    useEffect(() => {
        fetchData(`${apiUrl}/participants/fetchParticipants`, { event })
    }, [])

    const { fetchData, loading: fetchLoading, error: fetchError, data } = useFetch();
    const { addData, loading: addLoading, addError } = useAdd();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async () => {
        const payload = { ...formData, role: "PARTICIPANTS", event }
        const data = await addData(`${apiUrl}/participants/addUser`, payload);
        if (data) {
            alert('User added successfully');
            setIsAddModalOpen(false);
            fetchData(`${apiUrl}/participants/fetchParticipants`, { event });
        }
    }

    const handleParticipantChange = (index, value) => {
        const newParticipants = [...formData.participants];
        newParticipants[index] = value;
        setFormData({ ...formData, participants: newParticipants });
    }

    const addParticipantField = () => {
        setFormData({ ...formData, participants: [...formData.participants, ''] });
    }

    const removeParticipantField = (index) => {
        const newParticipants = formData.participants.filter((_, i) => i !== index);
        setFormData({ ...formData, participants: newParticipants });
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-end mb-5">
                <button onClick={() => setIsAddModalOpen(!isAddModalOpen)}
                    className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add User</span>
                </button>
            </div>
            {isAddModalOpen && (
                <div className="flex justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full mt-1 mb-4">
                        <h2 className="text-xl font-semibold text-blue-700 text-center border-b pb-3 mb-6">Add New User</h2>
                        {addError && <span className='text-red-600 mb-6 block'>{addError}</span>}
                        <div className="grid grid-cols-1 gap-6">
                            <input
                                autoComplete='off'
                                type="text"
                                value={formData.teamId}
                                name='teamId'
                                placeholder="Team Id"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {formData.participants.map((participant, index) => (
                                <div key={index} className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        value={participant}
                                        placeholder={`Participant ${index + 1}`}
                                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                                        className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
                                    />
                                    {formData.participants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeParticipantField(index)}
                                            className="bg-red-500 text-white px-6 py-1 font-semibold h-full rounded-md"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addParticipantField}
                                className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold"
                            >
                                Add Participant
                            </button>
                            <input
                                autoComplete='off'
                                type="text"
                                value={formData.contactNo}
                                name='contactNo'
                                placeholder="Contact No"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                autoComplete='off'
                                type="text"
                                value={formData.deptName}
                                placeholder="Department Name"
                                name='deptName'
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                autoComplete='off'
                                type="text"
                                value={formData.clgName}
                                name='clgName'
                                placeholder="College Name"
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <div className='flex justify-between gap-5'>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="mt-2 w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition">
                                    <FontAwesomeIcon icon={faClose} className='mr-2' />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition">
                                    <FontAwesomeIcon icon={faSave} className='mr-2' />
                                    <span>{addLoading ? 'Saving' : 'Save'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)
            }
            {!isAddModalOpen &&
                <>
                    {fetchLoading && (
                        <div className="text-center py-4 text-blue-600 font-semibold"> Loading Users ... </div>
                    )}
                    {fetchError && (
                        <div className="text-center py-4 text-red-500 font-semibold"> Error : {fetchError} </div>
                    )}
                    {!fetchLoading && !fetchError && (
                        <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                            <thead className="bg-blue-500 text-white overflow-auto">
                                <tr className='h-12'>
                                    <th className="px-4 py-2 border border-gray-300">S. No.</th>
                                    <th className="px-4 py-2 border border-gray-300">Team Id</th>
                                    <th className="px-4 py-2 border border-gray-300">Participants</th>
                                    <th className="px-4 py-2 border border-gray-300">Contact No</th>
                                    <th className="px-4 py-2 border border-gray-300">Department Name</th>
                                    <th className="px-4 py-2 border border-gray-300">College Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.data || []).length > 0 ? (
                                    (data.data).map((user, index) => (
                                        <tr key={user.teamId} className="border h-12">
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{index + 1}</td>
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.teamId}</td>
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">
                                                {user.participants.map((participant, i) => (
                                                    <div key={i}>{participant}</div>
                                                ))}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.contactNo}</td>
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.deptName}</td>
                                            <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.clgName}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className='h-12'>
                                        <td colSpan={7} className="py-2 text-gray-500">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </>
            }
        </div>
    )
}

export default Participants