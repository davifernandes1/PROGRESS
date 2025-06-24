import React from 'react';
import { Loader2, Archive } from 'lucide-react';

export const Table = ({ headers, data, renderRow, keyField = "id", isLoading = false, emptyMessage = "Nenhum dado encontrado.", searchTerm = "" }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center rounded-lg bg-white py-10 shadow">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }
    if (!data.length) {
        return (
            <div className="rounded-lg bg-white py-12 text-center shadow">
                <Archive size={56} className="mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500">{emptyMessage}</p>
                {searchTerm && <p className="mt-2 text-sm text-gray-400">Verifique o termo de busca ou os filtros aplicados.</p>}
            </div>
        );
    }
    return (
        <div className="overflow-x-auto rounded-lg bg-white shadow-md custom-scrollbar">
            <table className="min-w-[800px] w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>{headers.map((h, i) => <th key={h.key || i} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 ${h.className || ''}`}>{h.label}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((item) => renderRow(item, item[keyField]))}
                </tbody>
            </table>
        </div>
    );
};
