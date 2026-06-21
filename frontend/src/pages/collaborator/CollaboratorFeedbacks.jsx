import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MainLayout } from '../../components/ui/MainLayout';
import { MessageSquare, Calendar, User } from 'lucide-react';

// 1. ADICIONADO: Receber setCurrentPage e currentPage
export const CollaboratorFeedbacks = ({ setCurrentPage, currentPage }) => {
    const { feedbacks, users } = useData();
    const { currentUser } = useAuth();

    const myFeedbacks = feedbacks.filter(f => f.collaboratorId === currentUser.id);

    const getManagerName = (managerId) => {
        const manager = users.find(u => u.id === managerId);
        return manager ? manager.name : 'Gestor Desconhecido';
    };

    return (
        // 2. ADICIONADO: Repassar as funções de navegação e corrigir para pageTitle
        <MainLayout 
            pageTitle="Meus Feedbacks Recebidos"
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myFeedbacks.length === 0 ? (
                    <div className="col-span-full bg-white p-10 rounded-xl shadow-sm border text-center text-gray-500">
                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Você ainda não recebeu nenhum feedback.</p>
                        <p className="text-sm">Eles aparecerão aqui assim que seu gestor registrar uma conversa.</p>
                    </div>
                ) : (
                    myFeedbacks.map(feedback => (
                        <div key={feedback.id} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    feedback.type === 'Positivo' ? 'bg-green-100 text-green-700' : 
                                    feedback.type === 'Construtivo' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {feedback.type}
                                </span>
                                
                                <div className="flex items-center text-xs text-gray-400">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(feedback.dateSubmitted || feedback.meetingDate).toLocaleDateString()}
                                </div>
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-6 flex-grow whitespace-pre-wrap leading-relaxed">
                                "{feedback.feedbackText}"
                            </p>
                            
                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm text-gray-600">
                                <User size={16} className="mr-2 text-gray-400" />
                                <span>Enviado por: <strong>{getManagerName(feedback.managerId)}</strong></span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </MainLayout>
    );
};