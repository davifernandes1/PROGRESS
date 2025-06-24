import React, { useState, useEffect } from 'react';
import { Modal, FormField } from '../ui';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export const FeedbackModal = ({ isOpen, onClose, feedbackToEdit, isAdminCreating = false, currentUserIdForManagerScreen }) => {
    const { users, pdis, addFeedback, updateFeedback } = useData();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (feedbackToEdit) {
                setFormData({ ...feedbackToEdit, meetingDate: feedbackToEdit.meetingDate?.split('T')[0] });
            } else {
                setFormData({
                    collaboratorId: '', managerId: isAdminCreating ? '' : currentUserIdForManagerScreen,
                    pdiId: '', feedbackText: '', type: 'Positivo', meetingDate: '', nextSteps: ''
                });
            }
        }
    }, [feedbackToEdit, isOpen, isAdminCreating, currentUserIdForManagerScreen]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async () => {
        if (!formData.collaboratorId || !formData.feedbackText) {
            addNotification("Colaborador e texto do feedback são obrigatórios.", "error");
            return;
        }
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));

        const payload = { ...formData, dateSubmitted: new Date().toISOString() };

        if (feedbackToEdit) {
            updateFeedback(feedbackToEdit.id, payload);
            addNotification("Feedback atualizado.", "success");
        } else {
            addFeedback({ ...payload, id: `fbSim${Date.now()}` });
            addNotification("Feedback enviado.", "success");
        }
        setLoading(false);
        onClose();
    };

    const collaborators = users.filter(u => u.profile === 'collaborator' || (isAdminCreating && u.profile === 'manager'));
    const managers = users.filter(u => u.profile === 'manager' || u.profile === 'admin');
    const relevantPDIs = pdis.filter(p => p.collaboratorId === formData.collaboratorId || !formData.collaboratorId);

    return (
        <Modal title={feedbackToEdit ? "Editar Feedback" : "Novo Feedback"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={feedbackToEdit ? "Salvar" : "Enviar"} isPrimaryActionLoading={loading} widthClass="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Para (Colaborador/Gestor)" name="collaboratorId" type="select" value={formData.collaboratorId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {collaborators.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </FormField>
                {isAdminCreating ? (
                    <FormField label="De (Gestor/Admin)" name="managerId" type="select" value={formData.managerId || ''} onChange={handleChange} required>
                        <option value="">Selecione...</option>
                        {managers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </FormField>
                ) : <FormField label="De (Você)" name="managerIdDisplay" value={users.find(u => u.id === currentUserIdForManagerScreen)?.name || ''} disabled />}
                <FormField label="PDI Relacionado (Opcional)" name="pdiId" type="select" value={formData.pdiId || ''} onChange={handleChange}>
                    <option value="">Nenhum PDI específico</option>
                    {relevantPDIs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </FormField>
                <FormField label="Tipo de Feedback" name="type" type="select" value={formData.type || ''} onChange={handleChange} required>
                    {["Positivo", "Construtivo", "Reconhecimento", "Alinhamento", "Outro"].map(t => <option key={t} value={t}>{t}</option>)}
                </FormField>
                <div className="md:col-span-2"><FormField label="Texto do Feedback" name="feedbackText" type="textarea" rows={5} value={formData.feedbackText || ''} onChange={handleChange} required placeholder="Descreva o feedback..." /></div>
                <FormField label="Data da Conversa (Opcional)" name="meetingDate" type="date" value={formData.meetingDate || ''} onChange={handleChange} />
                <div className="md:col-span-2"><FormField label="Próximos Passos (Opcional)" name="nextSteps" type="textarea" rows={3} value={formData.nextSteps || ''} onChange={handleChange} placeholder="Defina ações..." /></div>
            </div>
        </Modal>
    );
};