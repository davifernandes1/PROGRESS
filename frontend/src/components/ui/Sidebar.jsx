import React from 'react';
import { Home, Users, MessageSquare, LogOut, UserCheck, Target, Send, UserCog, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ setCurrentPage, currentPage }) => {
    const { currentUser, logout } = useAuth();
    const handleLogout = () => { logout(); };

    const getNavItems = (profile) => {
        switch (profile) {
            case 'admin': return [
                { name: 'Dashboard', page: 'admin-dashboard', icon: Home },
                { name: 'Usuários', page: 'admin-users', icon: Users },
                { name: 'PDIs', page: 'admin-pdis', icon: ClipboardList },
                { name: 'Feedbacks', page: 'admin-feedbacks', icon: MessageSquare },
            ];
            case 'manager': return [
                { name: 'Dashboard', page: 'manager-dashboard', icon: Home },
                { name: 'PDIs da Equipe', page: 'manager-team-pdis', icon: UserCheck },
                { name: 'Meus PDIs', page: 'manager-my-pdis', icon: Target },
                { name: 'Dar Feedback', page: 'manager-give-feedback', icon: Send },
            ];
            case 'collaborator': return [
                { name: 'Meus PDIs', page: 'collaborator-pdis', icon: Target },
                { name: 'Meus Feedbacks', page: 'collaborator-feedbacks', icon: MessageSquare },
            ];
            default: return [];
        }
    };

    const navItems = getNavItems(currentUser?.profile);

    return (
        <div className="fixed top-0 left-0 z-20 flex h-screen w-60 flex-col bg-slate-900 p-4 text-white shadow-lg print:hidden">
            <div className="mb-10 pt-3 text-center">
                <div className="flex items-center justify-center space-x-2.5">
                    <UserCog size={30} className="text-blue-400" />
                    <span className="text-2xl font-bold tracking-wider text-white">PROGRESS</span>
                </div>
            </div>
            <nav className="flex-grow space-y-2">
                {navItems.map(item => (
                    <button key={item.name} onClick={() => setCurrentPage(item.page)} title={item.name}
                        className={`group flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-150 ease-in-out ${currentPage === item.page ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-slate-700 hover:text-white'}`}>
                        <item.icon size={20} className="flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto border-t border-slate-700 pt-6">
                {currentUser && (
                    <div className="mb-3 flex items-center space-x-3 p-2">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                            {currentUser.name?.match(/\b(\w)/g)?.join('').substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="max-w-[130px] truncate font-semibold text-white" title={currentUser.name}>{currentUser.name}</p>
                            <p className="text-xs text-slate-400">{currentUser.roleDescription}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout} title="Sair"
                    className="group flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-all hover:bg-red-600 hover:text-white">
                    <LogOut size={18} className="flex-shrink-0" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
};
