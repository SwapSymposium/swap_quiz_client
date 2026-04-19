import React from 'react';
import {
    Users,
    Database,
    AlertTriangle,
    ShieldCheck,
    ChevronRight,
    Info,
    Trash2,
    RefreshCw
} from 'lucide-react';

function SuperAdminGuideLines() {

    const tableTags = ['Participant', 'Rules', 'Questions', 'Answers'];

    return (
        <div className="text-slate-900">
            <div className="mx-auto">

                {/* Header Section */}
                <header className="relative mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                Super Admin <span className="text-blue-600">Menu Guidelines</span>
                            </h1>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 left-0 w-24 h-1 bg-blue-600 rounded-full"></div>
                </header>

                <div className="grid grid-cols-2 gap-8">
                    {/* Section 1: User & Event Management */}
                    <section className="group bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                        <div className="p-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">1. User Manage</h2>
                                        <p className="text-slate-500">Administrative control over core event structures.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                        <Info className="w-4 h-4 text-blue-500" /> Operational Scope
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        This menu is used for the <span className="text-slate-900 font-semibold">creation, editing, and deletion of events</span>.
                                    </p>
                                </div>

                                <div className="relative p-5 bg-rose-50 border border-rose-100 rounded-xl">
                                    <div className="flex gap-4">
                                        <div className="shrink-0">
                                            <AlertTriangle className="w-6 h-6 text-rose-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-rose-900 uppercase tracking-wide">Action Warning</h4>
                                            <p className="mt-1 text-sm text-rose-700 leading-snug">
                                                Deletion means <span className="font-bold underline">permanently deleting all records </span>related to a specific event.
                                                Please backup if needed, as this action cannot be reversed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Data Scrubbing */}
                    <section className="group bg-white rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md overflow-hidden">
                        <div className="p-8">
                            <div className="flex items-center gap-5 mb-8">
                                <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors text-amber-600">
                                    <Database className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">2. Data Deletion</h2>
                                    <p className="text-slate-500">Targeted data clearing without architectural impact.</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Target Entities</h4>
                                        <p className="text-sm text-slate-400">
                                            This menu is used to delete specific table data for a specific event without accessing the database directly.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {tableTags.map((table) => (
                                        <div
                                            key={table}
                                            className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm group/tag hover:border-blue-400 transition-colors"
                                        >
                                            <span className="text-sm font-mono text-slate-700">{table}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminGuideLines;