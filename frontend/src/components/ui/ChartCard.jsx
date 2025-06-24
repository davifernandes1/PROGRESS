import React from 'react';

export const ChartCard = ({ title, children, actionButton, note }) => (
    <div className="rounded-xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-4 flex items-center justify-between md:mb-6">
            <h3 className="text-lg font-semibold text-gray-700 md:text-xl">{title}</h3>
            {actionButton}
        </div>
        <div className="h-72 w-full sm:h-80 md:h-96">{children}</div>
        {note && <p className="mt-3 text-center text-xs text-gray-400">{note}</p>}
    </div>
);
