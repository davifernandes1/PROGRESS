import React from 'react';
import { MainLayout } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/dateUtils';
import { Archive, CheckSquare as CheckSquareIcon, Square } from 'lucide-react';

export const CollaboratorPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, updatePdi } = useData();
    const myPDIs = pdis.filter(p => p.collaboratorId === currentUser?.id);

    const handleObjectiveStatusChange = (pdiId, objectiveId, currentStatus) => {
        const pdiToUpdate = myPDIs.find(p => p.id === pdiId);
        if (!pdiToUpdate) return;

        const newStatus = currentStatus === 'concluido' ? 'em_andamento' : 'concluido';
        const updatedObjectives = pdiToUpdate.objectives.map(o => o.id === objectiveId ? { ...o, status: newStatus } : o);
        const completedCount = updatedObjectives.filter(o => o.status === 'concluido').length;
        const newProgress = Math.round((completedCount / updatedObjectives.length) * 100);

        let newPdiStatus = newProgress === 100 ? 'Concluído' : 'Em Andamento';

        updatePdi(pdiId, { objectives: updatedObjectives, progress: newProgress, status: newPdiStatus });
    };

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus Planos de Desenvolvimento">
            <div className="space-y-6">
                {myPDIs.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não possui Planos de Desenvolvimento.</p></div> : myPDIs.map(pdi => (
                    <div key={pdi.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                            <div><h3 className="text-xl font-semibold text-gray-800">{pdi.title}</h3><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></div>
                            <div className="text-right"><p className="text-sm font-semibold text-blue-600">{pdi.progress || 0}%</p><div className="w-24 bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div></div>
                        </div>
                        <h4 className="text-md font-medium text-gray-700 mt-4 mb-2">Objetivos:</h4>
                        <ul className="space-y-2">{pdi.objectives.map(obj => (
                            <li key={obj.id} className="flex items-center p-3 rounded-md bg-slate-50 border border-slate-200">
                                <button onClick={() => handleObjectiveStatusChange(pdi.id, obj.id, obj.status)} className="mr-3">{obj.status === 'concluido' ? <CheckSquareIcon size={20} className="text-green-600" /> : <Square size={20} className="text-gray-400" />}</button>
                                <span className={`text-sm ${obj.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{obj.text}</span>
                            </li>
                        ))}</ul>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};
