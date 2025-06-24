import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStatusColor } from '../../utils/styleUtils';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children, setCurrentPage, currentPage, pageTitle }) => {
    const { currentUser } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className={currentUser ? "ml-60" : ""}>
                {currentUser && <Sidebar setCurrentPage={setCurrentPage} currentPage={currentPage} />}
                <header className="bg-white p-4 py-4 shadow-sm md:px-8">
                    <div className="mx-auto flex max-w-full items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800 md:text-2xl">{pageTitle}</h1>
                        {currentUser && (
                            <div className="text-sm text-gray-600">
                                Logado como: <span className="font-medium">{currentUser.name}</span>
                                <span className={`ml-2 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(currentUser.profile)}`}>
                                    {currentUser.roleDescription}
                                </span>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-full animate-fadeIn">{children}</div>
                </main>
            </div>
        </div>
    );
};
