import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout, LoadingScreen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/dateUtils';
import { Archive, CheckSquare as CheckSquareIcon, Square } from 'lucide-react';

export const ManagerMyPDIs = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { pdis, updatePdi } = useData();
    const [loading, setLoading] = useState(true);

    const myPDIs = useMemo(() => {
        if (!currentUser) return [];
        return pdis.filter(pdi => pdi.collaboratorId === currentUser.id).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }, [currentUser, pdis]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 300); }, [myPDIs]);

    const handleObjectiveStatusChange = (pdiId, objectiveId, newStatus) => {
        const pdiToUpdate = myPDIs.find(p => p.id === pdiId);
        if (!pdiToUpdate) return;

        const updatedObjectives = pdiToUpdate.objectives.map(o => o.id === objectiveId ? { ...o, status: newStatus } : o);
        const completedCount = updatedObjectives.filter(o => o.status === 'concluido').length;
        const newProgress = Math.round((completedCount / updatedObjectives.length) * 100);

        let newPdiStatus = pdiToUpdate.status;
        if (newProgress === 100) newPdiStatus = 'Concluído';
        else if (newProgress > 0) newPdiStatus = 'Em Andamento';

        updatePdi(pdiId, { objectives: updatedObjectives, progress: newProgress, status: newPdiStatus });
    };

    if (loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus PDIs"><LoadingScreen /></MainLayout>;

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Meus PDIs">
            <div className="space-y-6">
                {myPDIs.length === 0 ?
                    <div className="text-center py-12 bg-white rounded-lg shadow"><Archive size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-xl text-gray-500">Você ainda não possui Planos de Desenvolvimento.</p></div>
                    : myPDIs.map(pdi => (
                        <div key={pdi.id} className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                                <div><h3 className="text-xl font-semibold text-gray-800">{pdi.title}</h3><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></div>
                                <div className="text-right"><p className="text-sm font-semibold text-blue-600">{pdi.progress || 0}%</p><div className="w-24 bg-gray-200 rounded-full h-2.5 mt-1"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pdi.progress || 0}%` }}></div></div></div>
                            </div>
                            <h4 className="text-md font-medium text-gray-700 mt-4 mb-2">Objetivos:</h4>
                            <ul className="space-y-2">{pdi.objectives.map(obj => (
                                <li key={obj.id} className="flex items-center p-3 rounded-md bg-slate-50 border border-slate-200">
                                    <button onClick={() => handleObjectiveStatusChange(pdi.id, obj.id, obj.status === 'concluido' ? 'em_andamento' : 'concluido')} className="mr-3">{obj.status === 'concluido' ? <CheckSquareIcon size={20} className="text-green-600" /> : <Square size={20} className="text-gray-400" />}</button>
                                    <span className={`text-sm ${obj.status === 'concluido' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{obj.text}</span>
                                </li>
                            ))}</ul>
                        </div>
                    ))}
            </div>
        </MainLayout>
    );
};
