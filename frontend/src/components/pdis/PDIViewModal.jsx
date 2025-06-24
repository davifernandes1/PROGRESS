import React from 'react';
import { Modal, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { objectiveStatuses } from '../../constants';
import { formatDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/styleUtils';

export const PDIViewModal = ({ isOpen, onClose, pdi }) => {
    const { users } = useData();
    if (!pdi) return null;

    const collaborator = users.find(u => u.id === pdi.collaboratorId);
    const manager = users.find(u => u.id === pdi.managerId);

    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm text-gray-800">{value || "N/A"}</p>
        </div>
    );

    return (
        <Modal title="Detalhes do PDI" isOpen={isOpen} onClose={onClose} showActions={false} widthClass="max-w-2xl">
            <div className="space-y-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900">{pdi.title}</h4>
                    <p className="text-sm text-gray-600 mt-1 italic">"{pdi.overallDescription}"</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-b py-4">
                    <DetailItem label="Colaborador" value={collaborator?.name} />
                    <DetailItem label="Gestor Responsável" value={manager?.name} />
                    <DetailItem label="Status" value={<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pdi.status)}`}>{pdi.status}</span>} />
                    <DetailItem label="Prioridade" value={pdi.priority} />
                    <DetailItem label="Data de Início" value={formatDate(pdi.startDate)} />
                    <DetailItem label="Prazo Final" value={formatDate(pdi.dueDate)} />
                </div>
                <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Objetivos</h5>
                    <ul className="space-y-3">
                        {pdi.objectives.map(obj => (
                            <li key={obj.id} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-medium text-gray-800">{obj.text}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                    <span>Tipo: {obj.activityType}</span>
                                    <span>Status: {objectiveStatuses.find(s => s.value === obj.status)?.label}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-right mt-4">
                    <Button onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </Modal>
    );
};
