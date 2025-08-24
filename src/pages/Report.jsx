import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function Report() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem('event');
    const { loading, error, data, fetchData } = useFetch();

    const getStudentReport = async () => { await fetchData(`${apiUrl}/report/student`, { event }) }

    const handleDownload = () => {

        const headers = [
            'S No', 'Team ID', 'Participants', 'Participant Count',
            'Contact No', 'Department', 'College', 'Scores', 'Updated At'
        ];

        const sheetData = [
            headers,
            ...data.data.map((user, index) => [
                index + 1, user.teamId,
                user.participants?.join(", ") || "",
                user.participants?.length || 0,
                user.contactNo || "", user.deptName,
                user.clgName, user.scores,
                new Date(user.updatedAt).toLocaleString()
            ])
        ]

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        saveAs(blob, 'Scores Report.xlsx');
    }

    // console.log(data)

    return (
        <div className='p-6 w-full space-y-6'>
            {/* Button */}
            <div className='flex justify-end'>
                <button
                    onClick={getStudentReport}
                    className="bg-blue-600 w-44 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Get Student Report
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center py-4 text-blue-600 font-semibold">
                    Loading Staff Report ...
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="text-center py-4 text-red-500 font-semibold">
                    Error: {error}
                </div>
            )}

            {/* Table */}
            {!loading && !error && data?.data?.length > 0 && (
                <div className="overflow-x-auto flex flex-col">
                    <button
                        onClick={handleDownload}
                        className="mb-6 w-40 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Download Excel
                    </button>
                    <div className="overflow-x-auto">
                        <table className="text-center w-full bg-white rounded shadow-md border border-gray-300 border-collapse">
                            <thead className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white overflow-auto">
                                <tr>
                                    {[
                                        "S No", "Team Id", "Participants",
                                        "Scores", "Updated At", "Department", "College",
                                    ].map((header, idx) => (
                                        <th key={idx} className="px-4 h-14 py-2 border border-gray-300 font-semibold whitespace-nowrap">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((user, index) => (
                                    <tr
                                        key={index}
                                        className={`h-12 transition-colors uppercase duration-200 hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                                    >
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{index + 1}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.teamId}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">
                                            {user.participants.map((participant, i) => (
                                                <div key={i}>{participant}</div>
                                            ))}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.scores}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{new Date(user.updatedAt).toLocaleString()}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.deptName}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-md whitespace-nowrap">{user.clgName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* No Data */}
            {!loading && !error && data?.length === 0 && (
                <div className="text-center text-gray-500 py-4">No student report available.</div>
            )}

        </div>
    )
}

export default Report