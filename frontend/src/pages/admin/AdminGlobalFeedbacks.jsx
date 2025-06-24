import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout, Table, Button, ConfirmationModal } from '../../components/ui';
import { FeedbackModal } from '../../components/feedback/FeedbackModal';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDateTime } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/styleUtils';
import { PlusCircle, Search, Edit, Trash as TrashIcon } from 'lucide-react';

export const AdminGlobalFeedbacks = ({ setCurrentPage, currentPage }) => {
    const { feedbacks, users, deleteFeedback } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeedbacks = useMemo(() => {
        return feedbacks
            .map(fb => ({
                ...fb,
                collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name || 'N/A',
                managerName: users.find(u => u.id === fb.managerId)?.name || 'N/A',
            }))
            .filter(fb => {
                const lowerSearch = searchTerm.toLowerCase();
                return !searchTerm || fb.collaboratorName.toLowerCase().includes(lowerSearch) || fb.managerName.toLowerCase().includes(lowerSearch) || fb.feedbackText.toLowerCase().includes(lowerSearch);
            })
            .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
    }, [feedbacks, users, searchTerm]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, []);

    const handleAdd = () => { setEditingFeedback(null); setShowFeedbackModal(true); };
    const handleEdit = (fb) => { setEditingFeedback(fb); setShowFeedbackModal(true); };
    const requestDelete = (fb) => { setFeedbackToDelete(fb); };

    const confirmDelete = async () => {
        if (!feedbackToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deleteFeedback(feedbackToDelete.id);
        addNotification("Feedback excluído.", "success");
        setIsDeleteLoading(false);
        setFeedbackToDelete(null);
    };

    const tableHeaders = [
        { label: "Data", key: "date" }, { label: "Gestor", key: "manager" }, { label: "Colaborador", key: "collaborator" },
        { label: "Tipo", key: "type" }, { label: "Feedback (Prévia)", key: "preview" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderRow = (fb) => (
        <tr key={fb.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-4 text-sm text-gray-500">{formatDateTime(fb.dateSubmitted)}</td>
            <td className="px-5 py-4 text-sm font-medium text-gray-700">{fb.managerName}</td>
            <td className="px-5 py-4 text-sm font-medium text-gray-700">{fb.collaboratorName}</td>
            <td className="px-5 py-4"><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(fb.type)}`}>{fb.type || '-'}</span></td>
            <td className="px-5 py-4 text-sm text-gray-600 max-w-xs truncate" title={fb.feedbackText}>{fb.feedbackText}</td>
            <td className="px-5 py-4 space-x-2.5 text-right">
                <Button onClick={() => handleEdit(fb)} variant="ghost" size="sm"><Edit size={16} /></Button>
                <Button onClick={() => requestDelete(fb)} variant="ghost" size="sm"><TrashIcon size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento Global de Feedbacks">
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <div className="relative w-full sm:max-w-md">
                        <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-md w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <Button onClick={handleAdd} variant="primary" iconLeft={<PlusCircle size={18} />}>Novo Feedback</Button>
                </div>
                <Table headers={tableHeaders} data={filteredFeedbacks} renderRow={renderRow} isLoading={loading} emptyMessage="Nenhum feedback encontrado." searchTerm={searchTerm} />
            </div>
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} feedbackToEdit={editingFeedback} isAdminCreating={true} />
            <ConfirmationModal isOpen={!!feedbackToDelete} onClose={() => setFeedbackToDelete(null)} onConfirm={confirmDelete} isLoading={isDeleteLoading} title="Excluir Feedback" message="Tem certeza que deseja excluir este feedback?" />
        </MainLayout>
    );
};
