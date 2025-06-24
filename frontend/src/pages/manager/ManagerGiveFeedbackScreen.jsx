import React, { useState } from 'react';
import { MainLayout, Button } from '../../components/ui';
import { FeedbackModal } from '../../components/feedback/FeedbackModal';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDateTime } from '../../utils/dateUtils';
import { Send } from 'lucide-react';

export const ManagerGiveFeedbackScreen = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { users, pdis, feedbacks } = useData();
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const teamMembers = users.filter(u => u.managerId === currentUser?.id);
    const feedbacksGiven = feedbacks.filter(fb => fb.managerId === currentUser?.id)
        .map(fb => ({ ...fb, collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name || 'N/A' }))
        .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
        .slice(0, 5);

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Dar Feedback para Equipe">
            <div className="space-y-6">
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Registrar Novo Feedback</h2>
                    <Button onClick={() => setShowFeedbackModal(true)} variant="primary" iconLeft={<Send size={18} />}>Dar Feedback</Button>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Últimos Feedbacks Enviados</h3>
                    {feedbacksGiven.length > 0 ? (
                        <ul className="space-y-3">
                            {feedbacksGiven.map(fb => (
                                <li key={fb.id} className="p-3 bg-slate-50 rounded-md border">
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-gray-700">Para: <span className="font-medium">{fb.collaboratorName}</span> (<span className={`text-xs ${fb.type === 'Positivo' ? 'text-green-600' : 'text-yellow-700'}`}>{fb.type}</span>)</p>
                                        <span className="text-xs text-gray-400">{formatDateTime(fb.dateSubmitted)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 truncate italic">"{fb.feedbackText}"</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum feedback enviado recentemente.</p>
                    )}
                </div>
            </div>
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} users={teamMembers} pdis={pdis} isAdminCreating={false} currentUserIdForManagerScreen={currentUser?.id} />
        </MainLayout>
    );
};
