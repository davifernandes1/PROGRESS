import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const NotificationContainer = ({ notifications, removeNotification }) => (
    <div className="fixed top-5 right-5 z-[200] space-y-3 w-80">
        {notifications.map(({ id, message, type }) => {
            const isSuccess = type === 'success';
            const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
            const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
            const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';
            const Icon = isSuccess ? CheckCircle : AlertCircle;

            return (
                <div key={id} className={`relative flex items-start space-x-3 p-4 rounded-lg shadow-lg border ${bgColor} animate-fadeInRight`}>
                    <Icon className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>{isSuccess ? 'Sucesso!' : 'Erro!'}</p>
                        <p className={`text-sm ${textColor} mt-0.5`}>{message}</p>
                    </div>
                    <button onClick={() => removeNotification(id)} className={`absolute top-2 right-2 p-1 rounded-full hover:bg-black/10`}>
                        <X size={16} className={textColor} />
                    </button>
                </div>
            );
        })}
    </div>
);