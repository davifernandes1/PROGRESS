import React, { useState, useEffect } from 'react';
import { MainLayout, Table, Button, ConfirmationModal } from '../../components/ui';
import { PDIModal, PDIViewModal } from '../../components/pdis';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/styleUtils';
import { PlusCircle, Eye, Edit, Trash as TrashIcon } from 'lucide-react';

export const AdminGlobalPDIs = ({ setCurrentPage, currentPage }) => {
    const { pdis, users, deletePdi } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showPDIModal, setShowPDIModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPDI, setSelectedPDI] = useState(null);
    const [pdiToDelete, setPdiToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, [pdis]);

    const handleAddPDI = () => { setSelectedPDI(null); setShowPDIModal(true); };
    const handleEditPDI = (pdi) => { setSelectedPDI(pdi); setShowPDIModal(true); };
    const handleViewPDI = (pdi) => { setSelectedPDI(pdi); setShowViewModal(true); };
    const requestDeletePDI = (pdi) => { setPdiToDelete(pdi); };

    const confirmDeletePDI = async () => {
        if (!pdiToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deletePdi(pdiToDelete.id);
        addNotification("PDI excluído com sucesso.", "success");
        setIsDeleteLoading(false);
        setPdiToDelete(null);
    };

    const tableHeaders = [
        { label: "Título", key: "title" }, { label: "Colaborador", key: "collaborator" }, { label: "Gestor", key: "manager" },
        { label: "Status PDI", key: "status" }, { label: "Progresso", key: "progress" }, { label: "Prazo", key: "dueDate" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderPDIRow = (pdi) => {
        const collaborator = users.find(u => u.id === pdi.collaboratorId);
        const manager = users.find(u => u.id === pdi.managerId);
        const progress = pdi.progress || 0;
        return (
            <tr key={pdi.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-gray-800">{pdi.title}</div>
                    <div className="text-xs text-gray-500">{pdi.objectives?.length || 0} objetivo(s)</div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">{collaborator?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{manager?.name || 'N/A'}</td>
                <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span></td>
                <td className="px-5 py-4 text-sm text-gray-500">
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                    <span className="text-xs">{progress}%</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{formatDate(pdi.dueDate)}</td>
                <td className="px-5 py-4 space-x-1.5 text-right">
                    <Button onClick={() => handleViewPDI(pdi)} variant="ghost" size="sm" title="Visualizar PDI" className="text-gray-600 hover:text-gray-800"><Eye size={16} /></Button>
                    <Button onClick={() => handleEditPDI(pdi)} variant="ghost" size="sm" title="Editar PDI" className="text-blue-600 hover:text-blue-700"><Edit size={16} /></Button>
                    <Button onClick={() => requestDeletePDI(pdi)} variant="ghost" size="sm" title="Excluir PDI" className="text-red-500 hover:text-red-600"><TrashIcon size={16} /></Button>
                </td>
            </tr>
        );
    };

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento Global de PDIs">
            <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-medium text-gray-700">Todos os Planos de Desenvolvimento</h2>
                    <Button onClick={handleAddPDI} variant="primary" iconLeft={<PlusCircle size={18} />}>Novo PDI</Button>
                </div>
                <Table headers={tableHeaders} data={pdis} renderRow={renderPDIRow} isLoading={loading} emptyMessage="Nenhum PDI encontrado." />
            </div>
            <PDIModal isOpen={showPDIModal} onClose={() => setShowPDIModal(false)} pdiToEdit={selectedPDI} />
            {selectedPDI && <PDIViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} pdi={selectedPDI} />}
            <ConfirmationModal
                isOpen={!!pdiToDelete}
                onClose={() => setPdiToDelete(null)}
                onConfirm={confirmDeletePDI}
                isLoading={isDeleteLoading}
                title="Excluir PDI"
                message={`Tem certeza que deseja excluir o PDI "${pdiToDelete?.title}"?`}
            />
        </MainLayout>
    );
};