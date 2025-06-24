import React, { useState, useEffect } from 'react';
import { Modal, FormField, RadioGroup } from '../ui';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { itDepartments, itJobTitles } from '../../constants';

export const UserModal = ({ isOpen, onClose, userToEdit }) => {
    const { users, addUser, updateUser } = useData();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            const initialData = userToEdit
                ? { ...userToEdit, password: '', confirmPassword: '' }
                : { name: '', email: '', profile: 'collaborator', department: itDepartments[0], jobTitle: '', status: 'active', password: '', confirmPassword: '' };
            setFormData(initialData);
            setErrors({});
        }
    }, [userToEdit, isOpen]);

    const availableJobTitles = formData.department ? itJobTitles[formData.department] || [] : [];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === "department") { setFormData(prev => ({ ...prev, jobTitle: '' })); }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório.";
        if (!formData.email?.trim()) newErrors.email = "Email é obrigatório.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
        else if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== formData.id)) newErrors.email = "Este email já está em uso.";
        if (!formData.jobTitle) newErrors.jobTitle = "Cargo é obrigatório.";
        if ((!userToEdit || formData.password) && (formData.password?.length || 0) < 6) newErrors.password = "Senha deve ter no mínimo 6 caracteres.";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        await new Promise(res => setTimeout(res, 500));

        const payload = { ...formData };
        if (!userToEdit || (userToEdit && payload.password)) {
            // A senha é salva diretamente
        } else {
            const oldUser = users.find(u => u.id === userToEdit.id);
            payload.password = oldUser.password;
        }

        delete payload.confirmPassword;
        payload.roleDescription = payload.profile.charAt(0).toUpperCase() + payload.profile.slice(1);

        if (userToEdit) {
            updateUser(userToEdit.id, payload);
            addNotification('Usuário atualizado com sucesso!', 'success');
        } else {
            const newId = `userSim${Date.now()}`;
            addUser({ ...payload, id: newId, createdAt: new Date().toISOString() });
            addNotification('Usuário criado com sucesso!', 'success');
        }
        setLoading(false);
        onClose();
    };

    return (
        <Modal title={userToEdit ? "Editar Usuário" : "Adicionar Novo Usuário"} isOpen={isOpen} onClose={onClose} onPrimaryAction={handleSubmit} primaryActionText={userToEdit ? "Salvar" : "Criar"} isPrimaryActionLoading={loading} widthClass="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Nome Completo" name="name" value={formData.name || ''} onChange={handleChange} required error={errors.name} />
                <FormField label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required error={errors.email} />
                <FormField label="Perfil" name="profile" type="select" value={formData.profile || ''} onChange={handleChange} required error={errors.profile}>
                    <option value="collaborator">Colaborador</option><option value="manager">Gestor</option><option value="admin">Admin</option>
                </FormField>
                <FormField label="Departamento" name="department" type="select" value={formData.department || ''} onChange={handleChange} required error={errors.department}>
                    {itDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </FormField>
                <FormField label="Cargo" name="jobTitle" type="select" value={formData.jobTitle || ''} onChange={handleChange} required error={errors.jobTitle} disabled={availableJobTitles.length === 0}>
                    <option value="">Selecione...</option>
                    {availableJobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </FormField>
                <div className="md:col-span-2 mt-2">
                    <p className="text-sm text-gray-600 mb-1">{userToEdit ? "Alterar Senha (opcional)" : "Definir Senha"}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4 border rounded-md bg-slate-50">
                        <FormField label={userToEdit ? "Nova Senha" : "Senha"} name="password" type="password" value={formData.password || ''} onChange={handleChange} required={!userToEdit} error={errors.password} helperText={userToEdit ? "Deixe em branco para não alterar." : "Mínimo 6 caracteres."} />
                        <FormField label={userToEdit ? "Confirmar Nova Senha" : "Confirmar Senha"} name="confirmPassword" type="password" value={formData.confirmPassword || ''} onChange={handleChange} required={!!formData.password} error={errors.confirmPassword} />
                    </div>
                </div>
                <div className="md:col-span-2"><RadioGroup legend="Status" name="status" value={formData.status || ''} onChange={handleChange} options={[{ value: 'active', label: 'Ativo' }, { value: 'inactive', label: 'Inativo' }]} required /></div>
            </div>
        </Modal>
    );
};
