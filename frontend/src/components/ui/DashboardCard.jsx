import React from 'react';

export const DashboardCard = ({ title, value, icon, bgColorClass = 'bg-slate-100', textColorClass = 'text-slate-700', subValue, linkTo, setCurrentPage }) => (
    <div className={`flex min-h-[150px] flex-col justify-between rounded-xl bg-white p-5 shadow-lg transition-shadow hover:shadow-xl md:p-6 ${linkTo ? 'cursor-pointer' : ''}`}
        onClick={linkTo && setCurrentPage ? () => setCurrentPage(linkTo) : undefined}>
        <div className="flex items-start space-x-3 md:space-x-4">
            <div className={`flex-shrink-0 rounded-full p-3.5 ${bgColorClass}`}>{React.cloneElement(icon, { size: 24, className: textColorClass })}</div>
            <div className="flex-1">
                <p className="truncate text-sm font-medium text-gray-500" title={title}>{title}</p>
                <p className="text-2xl font-bold text-gray-800 md:text-3xl">{value}</p>
                {subValue && <p className="mt-0.5 text-xs text-gray-400">{subValue}</p>}
            </div>
        </div>
    </div>
);