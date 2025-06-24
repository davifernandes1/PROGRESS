import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout, Table, Button } from '../../components/ui';
import { PDIModal, PDIViewModal } from '../../components/pdis';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/styleUtils';
import { Eye, Edit } from 'lucide-react';

export const ManagerTeamPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, users } = useData();
    const [loading, setLoading] = useState(true);
    const [showPDIModal, setShowPDIModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPDI, setSelectedPDI] = useState(null);

    const teamPDIs = useMemo(() => {
        if (!currentUser) return [];
        return pdis
            .filter(pdi => pdi.managerId === currentUser.id)
            .map(pdi => ({ ...pdi, collaboratorName: users.find(u => u.id === pdi.collaboratorId)?.name || 'N/A' }))
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }, [currentUser, pdis, users]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, [teamPDIs]);

    const handleViewPDI = (pdi) => { setSelectedPDI(pdi); setShowViewModal(true); };
    const handleEditPDI = (pdi) => { setSelectedPDI(pdi); setShowPDIModal(true); };

    const tableHeaders = [
        { label: "Título PDI", key: "title" }, { label: "Colaborador", key: "collaboratorName" },
        { label: "Status", key: "status" }, { label: "Progresso", key: "progress" }, { label: "Prazo", key: "dueDate" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderRow = (pdi) => (
        <tr key={pdi.id} className="hover:bg-gray-50/50">
            <td className="px-5 py-4"><div className="text-sm font-semibold">{pdi.title}</div><div className="text-xs text-gray-500">{pdi.objectives?.length || 0} objetivo(s)</div></td>
            <td className="px-5 py-4 text-sm">{pdi.collaboratorName}</td>
            <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span></td>
            <td className="px-5 py-4"><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div><span className="text-xs">{pdi.progress || 0}%</span></td>
            <td className="px-5 py-4 text-sm">{formatDate(pdi.dueDate)}</td>
            <td className="px-5 py-4 text-right space-x-1.5">
                <Button onClick={() => handleViewPDI(pdi)} variant="ghost" size="sm" title="Visualizar PDI"><Eye size={16} /></Button>
                <Button onClick={() => handleEditPDI(pdi)} variant="ghost" size="sm" title="Editar PDI"><Edit size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="PDIs da Equipe">
            <div className="space-y-6">
                <Table headers={tableHeaders} data={teamPDIs} renderRow={renderRow} isLoading={loading} emptyMessage="Nenhum PDI encontrado para sua equipe." />
            </div>
            <PDIModal isOpen={showPDIModal} onClose={() => setShowPDIModal(false)} pdiToEdit={selectedPDI} />
            {selectedPDI && <PDIViewModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} pdi={selectedPDI} />}
        </MainLayout>
    );
};