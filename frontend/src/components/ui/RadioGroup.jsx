import React from 'react';
import { AlertCircle } from 'lucide-react';

export const RadioGroup = ({ name, value, onChange, options, legend, required = false, disabled = false, error }) => (
    <fieldset className="mb-4" disabled={disabled}>
        {legend && <legend className="block text-sm font-medium text-gray-700 mb-1.5">{legend}{required && <span className="text-red-500 ml-0.5">*</span>}</legend>}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
            {options.map(opt => (
                <label key={opt.value} className={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                    <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={onChange} disabled={disabled} className="form-radio h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-200" />
                    <span className={`ml-2 text-sm ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>{opt.label}</span>
                </label>
            ))}
        </div>
        {error && <p className="mt-1 flex items-center text-xs text-red-600"><AlertCircle size={14} className="mr-1" />{error}</p>}
    </fieldset>
);