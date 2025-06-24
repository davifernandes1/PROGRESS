import React from 'react';
import { MainLayout } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDateTime } from '../../utils/dateUtils';
import { Archive } from 'lucide-react';

export const CollaboratorFeedbacks = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { feedbacks, users, pdis } = useData();
    const myFeedbacks = feedbacks.filter(fb => fb.collaboratorId === currentUser?.id)
        .map(fb => ({ ...fb, managerName: users.find(u => u.id === fb.managerId)?.name || 'N/A' }));

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus Feedbacks Recebidos">
            <div className="space-y-6">
                {myFeedbacks.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não recebeu feedbacks.</p></div> : myFeedbacks.map(fb => (
                    <div key={fb.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">Feedback de <span className="text-blue-600">{fb.managerName}</span></h3>
                            <span className="text-sm text-gray-500">{formatDateTime(fb.dateSubmitted)}</span>
                        </div>
                        {fb.pdiId && <p className="text-sm text-gray-600 mb-1"><strong>PDI:</strong> {pdis.find(p => p.id === fb.pdiId)?.title}</p>}
                        <p className="text-gray-700 bg-slate-50 p-3 rounded-md my-2 whitespace-pre-wrap">{fb.feedbackText}</p>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};