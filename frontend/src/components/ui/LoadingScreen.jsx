import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
        <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-white" />
        </div>
    </div>
);
