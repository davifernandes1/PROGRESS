import React from 'react';

export const InfoCard = ({ title, value, icon, iconBgColor = 'bg-blue-100', iconTextColor = 'text-blue-600', isLoading = false }) => (
    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-md">
        <div className={`flex items-center justify-center rounded-full p-3 ${iconBgColor}`}>{React.cloneElement(icon, { size: 22, className: iconTextColor })}</div>
        <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{title}</p>
            {isLoading ? <div className="mt-1 h-7 w-16 animate-pulse rounded bg-gray-200"></div> : <p className="text-2xl font-semibold text-gray-800">{value}</p>}
        </div>
    </div>
);
