import React, { useState, useEffect } from 'react';
import { Modal, FormField, RadioGroup, Button } from '../ui';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { objectiveStatuses } from '../../constants';
import { suggestWithAI } from '../../api/gemini';
import { Brain, PlusCircle, Trash as TrashIcon } from 'lucide-react';

export const PDIModal = ({ isOpen, onClose, pdiToEdit }) => {
    const { users, feedbacks, addPdi, updatePdi } = useData();
    const { addNotification } = useNotification();
    const initialObjective = () => ({ id: `obj_${Date.now()}_${Math.random().toString(16).slice(2)}`, text: '', status: 'pendente', activityType: '', estimatedDurationDays: null });
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (pdiToEdit) {
                setFormData({
                    ...pdiToEdit,
                    startDate: pdiToEdit.startDate?.split('T')[0] || '',
                    dueDate: pdiToEdit.dueDate?.split('T')[0] || '',
                    objectives: pdiToEdit.objectives?.length ? pdiToEdit.objectives : [initialObjective()]
                });
            } else {
                setFormData({
                    title: '', overallDescription: '', collaboratorId: '', managerId: '',
                    status: 'Pendente', priority: 'Média', department: '',
                    startDate: new Date().toISOString().split('T')[0], dueDate: '',
                    objectives: [initialObjective()]
                });
            }
            setErrors({});
        }
    }, [pdiToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleObjectiveChange = (index, field, value) => {
        const updatedObjectives = formData.objectives.map((obj, i) => i === index ? { ...obj, [field]: value } : obj);
        setFormData(prev => ({ ...prev, objectives: updatedObjectives }));
    };

    const addObjective = () => setFormData(prev => ({ ...prev, objectives: [...prev.objectives, initialObjective()] }));
    const removeObjective = (index) => {
        if (formData.objectives.length <= 1) return;
        setFormData(prev => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== index) }));
    };

    const handleAISuggest = async () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            addNotification("Chave da API da IA não configurada.", "error");
            return;
        }

        if (!formData.title?.trim() || !formData.collaboratorId) {
            addNotification("Título do PDI e Colaborador são necessários para sugestões.", "error");
            return;
        }
        setIsAiLoading(true);

        const collaborator = users.find(u => u.id === formData.collaboratorId);
        const collaboratorFeedbacks = feedbacks.filter(fb => fb.collaboratorId === formData.collaboratorId);
        
        const feedbackHistory = collaboratorFeedbacks.length > 0 
            ? collaboratorFeedbacks.map(fb => `- Tipo: ${fb.type}. Conteúdo: ${fb.feedbackText}`).join("\n")
            : "Nenhum feedback anterior registrado.";

        // --- PROMPT COM INSTRUÇÕES DE PRAZO REALISTA ---
        const prompt = `
            **Função:** Você é um Coach de Carreira Sênior e Agile, focado em desenvolvimento rápido e impactante. Sua tarefa é criar um Plano de Desenvolvimento Individual (PDI) conciso e acionável.

            **Contexto:**
            - Colaborador: ${collaborator.name}
            - Cargo: ${collaborator.jobTitle}
            - Objetivo Principal do PDI: "${formData.title}"
            - Histórico de Feedbacks:
              ${feedbackHistory}

            **Sua Tarefa:**
            1.  **Descrição Geral:** Com base em tudo, escreva uma descrição geral (2-3 frases) clara e motivacional para o PDI.
            2.  **Objetivos:** Crie 2 a 3 objetivos diretos. Para cada objetivo:
                - **text:** Descreva a meta a ser alcançada de forma específica. NÃO inclua datas ou durações no texto.
                - **activityType:** Sugira um tipo de atividade prático e relevante (Ex: "Projeto Prático", "Curso Aplicado", "Mentoria Técnica").
                - **estimatedDurationDays:** Forneça uma estimativa de dias **realista e curta (ex: entre 5 e 30 dias)**. Considere a complexidade da tarefa para um profissional com o cargo de **${collaborator.jobTitle}**. O objetivo é um PDI ágil.

            Responda **APENAS** com o objeto JSON, seguindo o schema.
        `;
        
        const pdiSuggestionSchema = {
            type: "OBJECT",
            properties: {
                suggestedOverallDescription: { 
                    type: "STRING",
                    description: "A descrição geral e profissional para o PDI."
                },
                suggestedObjectives: {
                    type: "ARRAY",
                    description: "A lista de objetivos sugeridos.",
                    items: {
                        type: "OBJECT",
                        properties: {
                            text: { type: "STRING" },
                            activityType: { type: "STRING" },
                            estimatedDurationDays: { type: "NUMBER" }
                        },
                        required: ["text", "activityType", "estimatedDurationDays"]
                    }
                }
            },
            required: ["suggestedOverallDescription", "suggestedObjectives"]
        };

        try {
            const parsedJson = await suggestWithAI(prompt, pdiSuggestionSchema, apiKey, 0.8);
            
            if (parsedJson.suggestedObjectives) {
                const totalDuration = parsedJson.suggestedObjectives.reduce((sum, obj) => sum + (obj.estimatedDurationDays || 0), 0);
                const startDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(startDate.getDate() + totalDuration);

                const newObjectives = parsedJson.suggestedObjectives.map(obj => ({
                    ...initialObjective(),
                    text: obj.text,
                    activityType: obj.activityType,
                    estimatedDurationDays: obj.estimatedDurationDays,
                }));

                setFormData(prev => ({
                    ...prev,
                    overallDescription: parsedJson.suggestedOverallDescription,
                    startDate: startDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    objectives: newObjectives
                }));
                addNotification("PDI preenchido com sugestões da IA!", "success");
            }

        } catch (error) {
            console.error("Erro ao usar IA:", error);
            addNotification(`Falha ao gerar sugestões: ${error.message}`, "error");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.collaboratorId || !formData.managerId) {
            addNotification("Título, Colaborador e Gestor são obrigatórios.", "error");
            return;
        }
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));

        const completedObjs = formData.objectives.filter(o => o.status === 'concluido').length;
        const progress = formData.objectives.length > 0 ? Math.round((completedObjs / formData.objectives.length) * 100) : 0;

        const payload = { ...formData, progress };

        if (pdiToEdit) {
            updatePdi(pdiToEdit.id, payload);
            addNotification("PDI atualizado com sucesso!", "success");
        } else {
            addPdi({ ...payload, id: `pdiSim${Date.now()}` });
            addNotification("PDI criado com sucesso!", "success");
        }
        setLoading(false);
        onClose();
    };

    const collaborators = users.filter(u => u.profile === 'collaborator');
    const managers = users.filter(u => u.profile === 'manager' || u.profile === 'admin');

    return (
        <Modal title={pdiToEdit ? "Editar PDI" : "Novo PDI"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={pdiToEdit ? "Salvar" : "Criar PDI"} isPrimaryActionLoading={loading} widthClass="max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Título do PDI" name="title" value={formData.title || ''} onChange={handleChange} required />
                <FormField label="Colaborador" name="collaboratorId" type="select" value={formData.collaboratorId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {collaborators.map(u => <option key={u.id} value={u.id}>{`${u.name} (${u.jobTitle})`}</option>)}
                </FormField>
                <FormField label="Gestor Responsável" name="managerId" type="select" value={formData.managerId || ''} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {managers.map(u => <option key={u.id} value={u.id}>{`${u.name} (${u.jobTitle})`}</option>)}
                </FormField>
                <FormField label="Status Geral" name="status" type="select" value={formData.status || ''} onChange={handleChange}>
                    {["Pendente", "Em Andamento", "Concluído", "Atrasado", "Cancelado"].map(s => <option key={s} value={s}>{s}</option>)}
                </FormField>
                <div className="md:col-span-2">
                    <FormField label="Descrição Geral (Contexto)" name="overallDescription" type="textarea" rows={3} value={formData.overallDescription || ''} onChange={handleChange} placeholder="Forneça um contexto geral ou use a IA para gerar..." />
                </div>
            </div>

            <hr className="my-6" />

            <div className="flex justify-between items-center mb-3">
                <h4 className="text-md font-semibold text-gray-700">Objetivos Específicos do PDI</h4>
                <Button onClick={handleAISuggest} variant="outline" size="sm" iconLeft={<Brain size={16} />} isLoading={isAiLoading} disabled={isAiLoading || !formData.title || !formData.collaboratorId}>
                    {isAiLoading ? "Gerando..." : "Sugerir com IA"}
                </Button>
            </div>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-4">
                {formData.objectives?.map((obj, index) => (
                    <div key={obj.id || index} className="p-4 border rounded-lg bg-slate-50 relative">
                        <FormField label={`Objetivo ${index + 1}`} name={`objective_text_${index}`} type="textarea" rows={2} value={obj.text || ''} onChange={e => handleObjectiveChange(index, 'text', e.target.value)} required placeholder="Descreva o objetivo específico..." />
                        <FormField label="Tipo de Atividade" name={`objective_activityType_${index}`} type="text" value={obj.activityType || ''} onChange={(e) => handleObjectiveChange(index, 'activityType', e.target.value)} placeholder="Ex: Curso, Projeto, Mentoria" />
                        <RadioGroup name={`objective_status_${index}`} value={obj.status} onChange={e => handleObjectiveChange(index, 'status', e.target.value)} options={objectiveStatuses} legend="Status do Objetivo" />
                        {formData.objectives.length > 1 && <Button onClick={() => removeObjective(index)} variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500 hover:text-red-700 !p-1"><TrashIcon size={16} /></Button>}
                    </div>
                ))}
            </div>
            <Button onClick={addObjective} variant="outline" size="sm" iconLeft={<PlusCircle size={16} />}>Adicionar Novo Objetivo</Button>

            <hr className="my-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Data de Início" name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} required />
                <FormField label="Data de Prazo Final" name="dueDate" type="date" value={formData.dueDate || ''} onChange={handleChange} required />
            </div>
        </Modal>
    );
};
