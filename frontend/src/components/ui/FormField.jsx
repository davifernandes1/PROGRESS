import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export const FormField = ({ label, name, type = 'text', value, onChange, required = false, children, placeholder, disabled = false, rows = 3, error, helperText, autoComplete }) => {
    const commonClasses = "mt-1 block w-full py-2.5 px-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors";
    const errorClasses = error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
            {type === 'select' ? (
                <select id={name} name={name} value={value || ''} onChange={onChange} required={required} disabled={disabled} className={`${commonClasses} ${errorClasses}`}>{children}</select>
            ) : type === 'textarea' ? (
                <textarea id={name} name={name} value={value || ''} onChange={onChange} required={required} rows={rows} placeholder={placeholder} disabled={disabled} className={`${commonClasses} ${errorClasses}`}></textarea>
            ) : (
                <input type={type} id={name} name={name} value={value || ''} onChange={onChange} required={required} placeholder={placeholder} disabled={disabled} className={`${commonClasses} ${errorClasses}`} autoComplete={autoComplete} />
            )}
            {error && <p className="mt-1 flex items-center text-xs text-red-600"><AlertCircle size={14} className="mr-1" />{error}</p>}
            {!error && helperText && <p className="mt-1 flex items-center text-xs text-gray-500"><Info size={14} className="mr-1" />{helperText}</p>}
        </div>
    );
};