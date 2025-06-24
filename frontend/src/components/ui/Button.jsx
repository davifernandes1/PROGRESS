import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ children, variant = 'primary', size = 'md', iconLeft, iconRight, disabled = false, isLoading = false, className = '', ...props }) => {
    const baseClasses = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 ease-in-out shadow-sm inline-flex items-center justify-center";
    const sizeClasses = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-base", };
    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400",
        secondary: "bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500 disabled:bg-slate-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
        outline: "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400 disabled:text-slate-400 disabled:border-slate-200",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400 disabled:text-slate-400",
    };
    return (
        <button type="button" disabled={disabled || isLoading}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${isLoading ? 'cursor-wait' : ''} ${disabled ? 'cursor-not-allowed opacity-70' : ''} ${className}`} {...props}>
            {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            {iconLeft && !isLoading && <span className="mr-2">{iconLeft}</span>}
            {children}
            {iconRight && !isLoading && <span className="ml-2">{iconRight}</span>}
        </button>
    );
};
