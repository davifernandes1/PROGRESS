import React from 'react';

export const FilterInput = ({ label, children, value, onChange, name, disabled = false, placeholder = "Selecionar..." }) => (
    <div className="w-full">
        {label && <label htmlFor={name} className="mb-1 block text-xs font-medium text-gray-600">{label}</label>}
        <select id={name} name={name} value={value || ""} onChange={onChange} disabled={disabled} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm disabled:cursor-not-allowed disabled:bg-gray-100">
            {placeholder && <option value="">{placeholder}</option>}
            {children}
        </select>
    </div>
);
