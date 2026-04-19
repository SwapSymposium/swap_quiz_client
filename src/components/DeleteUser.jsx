import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useDelete } from '../hooks/useDelete';
const apiUrl = import.meta.env.VITE_API_URL;

function DeleteUser({ onClose, selectedUser, selectedEvent }) {

    const { deleteData, loading } = useDelete();

    const handleSubmit = async () => {
        const response = await deleteData(`${apiUrl}/api/admin/deleteUser`, { event: selectedEvent })
        if (response !== null) {
            alert('User deleted successfully');
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 relative z-[10000]">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mb-6 mx-auto">
                    <FontAwesomeIcon icon={faTrashAlt} />
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900">Confirm Deletion</h3>
                <p className="text-gray-500 text-center mt-3 leading-relaxed">
                    Are you sure you want to delete <span className="font-bold text-red-600 underline">{selectedUser}</span> Event?
                </p>
                <p className="text-gray-400 text-center text-sm mt-2">
                    This action cannot be undone.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteUser;