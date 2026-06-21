import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MainLayout } from '../../components/ui/MainLayout';
import { CheckCircle, Clock, Target, Calendar } from 'lucide-react';

export const CollaboratorPDIs = () => {
    const { pdis, updatePdi } = useData();
    const { currentUser } = useAuth();
    const { addNotification } = useNotification();
    const [loadingId, setLoadingId] = useState(null);

    // Filtra apenas os PDIs deste colaborador
    const myPdis = pdis.filter(p => p.collaboratorId === currentUser.id);

    const handleToggleObjective = async (pdi, objectiveId) => {
        setLoadingId(pdi.id);
        try {
            // Atualiza o status do objetivo selecionado
            const updatedObjectives = pdi.objectives.map(obj => {
                if (obj.id === objectiveId) {
                    return { ...obj, status: obj.status === 'concluido' ? 'pendente' : 'concluido' };
                }
                return obj;
            });

            // Recalcula o progresso
            const completedCount = updatedObjectives.filter(o => o.status === 'concluido').length;
            const total = updatedObjectives.length;
            const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            // Prepara os dados para o Backend
            const updatedPdi = {
                ...pdi,
                objectives: updatedObjectives,
                progress: newProgress,
                // Se chegou a 100%, muda o status geral automaticamente para Concluído
                status: newProgress === 100 ? 'Concluído' : pdi.status === 'Não Iniciado' && newProgress > 0 ? 'Em Andamento' : pdi.status
            };

            await updatePdi(pdi.id, updatedPdi);
            addNotification("Progresso atualizado com sucesso!", "success");
        } catch (error) {
            addNotification("Erro ao atualizar progresso.", "error");
        } finally {
            setLoadingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Concluído': return 'bg-green-100 text-green-800';
            case 'Em Andamento': return 'bg-blue-100 text-blue-800';
            case 'Pausado': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <MainLayout title="Meus Planos de Desenvolvimento">
            <div className="space-y-6">
                {myPdis.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow-sm border text-center text-gray-500">
                        <Target size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">Você ainda não possui Planos de Desenvolvimento.</p>
                        <p className="text-sm">Converse com seu gestor para iniciar um PDI.</p>
                    </div>
                ) : (
                    myPdis.map(pdi => (
                        <div key={pdi.id} className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${loadingId === pdi.id ? 'opacity-70' : ''}`}>
                            
                            {/* Cabeçalho do PDI */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{pdi.title}</h3>
                                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pdi.status)}`}>
                                        {pdi.status}
                                    </span>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                                    <Calendar size={16} className="mr-2" />
                                    <span>Prazo: {new Date(pdi.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Descrição Geral */}
                            {pdi.overallDescription && (
                                <p className="text-gray-600 mb-6 bg-slate-50 p-4 rounded-lg text-sm border-l-4 border-blue-500">
                                    {pdi.overallDescription}
                                </p>
                            )}

                            {/* Barra de Progresso */}
                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Progresso Geral</span>
                                    <span className="font-bold text-blue-600">{pdi.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pdi.progress || 0}%` }}></div>
                                </div>
                            </div>

                            {/* Lista de Objetivos */}
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                <CheckCircle size={18} className="mr-2 text-gray-400" /> 
                                Minhas Metas e Objetivos
                            </h4>
                            
                            <div className="space-y-3">
                                {pdi.objectives?.map(obj => (
                                    <label key={obj.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${obj.status === 'concluido' ? 'bg-green-50/30 border-green-200' : 'bg-white'}`}>
                                        <div className="flex-shrink-0 mt-1">
                                            <input 
                                                type="checkbox" 
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={obj.status === 'concluido'}
                                                onChange={() => handleToggleObjective(pdi, obj.id)}
                                                disabled={loadingId === pdi.id}
                                            />
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className={`text-sm font-medium ${obj.status === 'concluido' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                {obj.text}
                                            </p>
                                            {(obj.activityType || obj.estimatedDurationDays) && (
                                                <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                                    {obj.activityType && (
                                                        <span className="bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                            Tipo: {obj.activityType}
                                                        </span>
                                                    )}
                                                    {obj.estimatedDurationDays && (
                                                        <span className="flex items-center">
                                                            <Clock size={12} className="mr-1" />
                                                            {obj.estimatedDurationDays} dias estimados
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </MainLayout>
    );
};