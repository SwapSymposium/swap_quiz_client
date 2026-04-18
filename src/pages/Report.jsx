import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileExcel,
    faDownload,
    faChartLine,
    faUsers,
    faIdCard,
    faUserGroup,
    faPhone,
    faBuilding,
    faUniversity,
    faClock
} from '@fortawesome/free-solid-svg-icons';

function Report() {

    const apiUrl = import.meta.env.VITE_API_URL;
    const event = sessionStorage.getItem('event');
    const { loading, error, data, fetchData } = useFetch();

    const getStudentReport = async () => { await fetchData(`${apiUrl}/api/report/student`, { event }) }

    const handleDownload = () => {

        const headers = [
            'S No', 'Swap ID', 'Team ID', 'Participants', 'Scores',
            'Contact No', 'Department', 'College', 'Updated At'
        ];

        const sheetData = [
            headers,
            ...(data?.data || []).map((user, index) => [
                index + 1, user.swapId, user.teamId,
                user.participants?.join(", ") || "",
                user.scores, user.contactNo || "",
                user.deptName, user.clgName,
                new Date(user.updatedAt).toLocaleString()
            ])
        ]

        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        });
        saveAs(blob, `${event || 'Event'}_Scores_Report.xlsx`);
    }

    const reportData = data?.data || [];

    return (
        <div className="font-sans text-slate-900">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Score Report</h1>
                    <p className="text-slate-500 mt-1">
                        View and export scores for <span className="text-blue-600 font-semibold">{event || 'Current Event'}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={getStudentReport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 font-bold"
                    >
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>Get Report</span>
                    </button>
                    {reportData.length > 0 && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-md shadow-green-200 transition-all active:scale-95 font-bold"
                        >
                            <FontAwesomeIcon icon={faFileExcel} />
                            <span>Export Excel</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Summary Cards when data is available */}
            {!loading && !error && reportData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wide">Total Teams</p>
                                <p className="text-2xl font-bold text-slate-800">{reportData.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserGroup} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wide">Total Participants</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {reportData.reduce((sum, user) => sum + (user.participants?.length || 0), 0)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faUsers} className="text-green-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wide">Avg Score</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {(reportData.reduce((sum, user) => sum + (user.scores || 0), 0) / reportData.length).toFixed(1)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faChartLine} className="text-amber-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wide">Highest Score</p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {Math.max(...reportData.map(user => user.scores || 0), 0)}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <FontAwesomeIcon icon={faDownload} className="text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                        <p className="text-slate-400 font-medium tracking-wide">Loading report data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faChartLine} className="text-red-500 text-2xl" />
                        </div>
                        <p className="text-red-500 font-bold mb-2">Error loading report</p>
                        <p className="text-slate-400 text-sm">{error}</p>
                    </div>
                ) : reportData.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faUsers} className="text-slate-300 text-3xl" />
                        </div>
                        <p className="text-slate-400 font-medium text-lg">No report data available</p>
                        <p className="text-slate-300 text-sm mt-1">Click "Get Report" to fetch participant scores</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">S.No</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Identification</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Team Members</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Scores</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Contact Details</th>
                                    <th className="px-6 py-4 text-[12px] font-bold text-slate-700 uppercase tracking-widest">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reportData.map((user, index) => (
                                    <tr key={user.teamId || index} className="hover:bg-blue-50/40 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-300">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] font-semibold text-blue-500 uppercase">
                                                    <FontAwesomeIcon icon={faIdCard} className="mr-1 text-blue-400" size="xs" />
                                                    Swap ID : {user.swapId || 'N/A'}
                                                </span>
                                                <span className="text-sm font-bold text-slate-700 mt-0.5">
                                                    <FontAwesomeIcon icon={faUserGroup} className="mr-1 text-slate-400" size="xs" />
                                                    {user.teamId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {user.participants?.map((p, i) => (
                                                    <span key={i} className="bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg text-sm font-medium shadow-sm">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2">
                                                <div className={`px-3 py-1.5 rounded-lg font-bold text-md ${user.scores > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : user.scores === 0
                                                        ? 'bg-gray-100 text-gray-500'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {user.scores ?? 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-[14px] text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faPhone} className="w-3 text-slate-300" />
                                                    <span className="font-medium text-slate-700">{user.contactNo || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faBuilding} className="w-3 text-slate-300" />
                                                    <span>{user.deptName || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 group">
                                                    <FontAwesomeIcon icon={faUniversity} className="w-3 text-slate-300 flex-shrink-0" />
                                                    <span
                                                        className="truncate max-w-[200px] relative"
                                                        title={user.clgName || 'N/A'}
                                                    >
                                                        {user.clgName || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                                                <FontAwesomeIcon icon={faClock} className="text-slate-300" />
                                                <span>{new Date(user.updatedAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default Report