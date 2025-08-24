import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useFetch} from '../hooks/useFetch';


function UserManage() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userID, setUserID] = useState();
    const [password, setPassword] = useState();
    const [eventName, setEventName] = useState();
    const [eventsData, setEventsData] = useState([]);


    const {fetchData, loading, error, data} = useFetch()


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetchData(`${apiUrl}/admin/getEvents`, {});
                // console.log("respons", response.data.events)
                setEventsData(response.data.events)
            }
            catch (err) {
                console.log("Somthing errir while fetching events error")
            }
        }

        fetchEvents()
    }, [])

    const addEvent = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/admin/addEvents`, {
                userId: userID,
                password: password,
                eventName: eventName
            });

            if (response.data.success) {
                console.log("Event Saved:", response.data.data);
                window.alert("Event Added")
                setIsModalOpen(false);
                window.location.reload()

            } else {
                console.error("Failed to save:", response.data.message);
            }
        } catch (err) {
            console.error("Error saving event:", err);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Top Button */}
            <div className="flex justify-end mb-5">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow transition duration-200"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    <span>Add User</span>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow rounded-lg bg-white p-4">
                <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                    <thead className="bg-blue-500 text-white overflow-auto">
                        <tr className="h-12">
                            <th className="px-4 py-2 border border-gray-300">S. No.</th>
                            <th className="px-4 py-2 border border-gray-300">UserId</th>
                            <th className="px-4 py-2 border border-gray-300">Event Name</th>
                            <th className="px-4 py-2 border border-gray-300">Contact No</th>
                            {/* <th className="px-4 py-2 border border-gray-300">Edit</th>
                            <th className="px-4 py-2 border border-gray-300">Delete</th> */}

                        </tr>
                    </thead>
                    <tbody>

                        {eventsData.length > 0 && eventsData.map((item, index) => (
                            <tr className="border h-12" key={index}>
                                <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                                <td className="px-4 py-2 border border-gray-200">{item.teamId}</td>
                                <td className="px-4 py-2 border border-gray-200">{item.event}</td>
                                <td className="px-4 py-2 border border-gray-200">{item.contactNo}</td>

                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>

            {/* Popup Modal */}
            {isModalOpen && (
                <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                        <h2 className="text-xl font-semibold mb-4 text-center">Add User</h2>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">User ID</label>
                                <input
                                    required
                                    type="text"
                                    onChange={(e) => setUserID(e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    type="password"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event Name</label>
                                <input
                                    onChange={(e) => setEventName(e.target.value)}

                                    required
                                    type="text"
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    // type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                                    onClick={(e) => addEvent(e)}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManage;
