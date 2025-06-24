import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout, Table, Button, FilterInput, ConfirmationModal } from '../../components/ui';
import { UserModal } from '../../components/admin/UserModal';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { getStatusColor } from '../../utils/styleUtils';
import { Search, UserPlus, Edit, Trash as TrashIcon } from 'lucide-react';

export const AdminUserManagement = ({ setCurrentPage, currentPage }) => {
    const { users, deleteUser } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ profile: '', status: '', department: '' });

    const filteredUsers = useMemo(() => {
        return users
            .filter(u => {
                const lowerSearch = searchTerm.toLowerCase();
                const matchesSearch = !searchTerm || u.name.toLowerCase().includes(lowerSearch) || u.email.toLowerCase().includes(lowerSearch);
                const matchesProfile = !filters.profile || u.profile === filters.profile;
                const matchesStatus = !filters.status || u.status === filters.status;
                const matchesDept = !filters.department || u.department === filters.department;
                return matchesSearch && matchesProfile && matchesStatus && matchesDept;
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [users, searchTerm, filters]);

    useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 500); }, []);

    const handleAddUser = () => { setEditingUser(null); setShowUserModal(true); };
    const handleEditUser = (user) => { setEditingUser(user); setShowUserModal(true); };
    const requestDeleteUser = (user) => { setUserToDelete(user); };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleteLoading(true);
        await new Promise(res => setTimeout(res, 500));
        deleteUser(userToDelete.id);
        addNotification('Usuário excluído com sucesso!', 'success');
        setIsDeleteLoading(false);
        setUserToDelete(null);
    };

    const tableHeaders = [
        { label: "Nome", key: "name" }, { label: "Email", key: "email" }, { label: "Cargo", key: "jobTitle" }, { label: "Departamento", key: "department" }, { label: "Perfil", key: "profile" }, { label: "Status", key: "status" }, { label: "Ações", key: "actions", className: "text-right" }
    ];

    const renderUserRow = (user) => (
        <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
            <td className="px-5 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold border-2 border-white shadow-sm">{user.name.match(/\b(\w)/g)?.join('').substring(0, 2).toUpperCase() || 'N/A'}</div><div className="ml-3"><div className="text-sm font-semibold text-gray-800">{user.name}</div><div className="text-xs text-gray-500">{user.id}</div></div></div></td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{user.jobTitle || 'N/A'}</td>
            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
            <td className="px-5 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.profile)}`}>{user.profile.charAt(0).toUpperCase() + user.profile.slice(1)}</span></td>
            <td className="px-5 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-2.5 text-right">
                <Button onClick={() => handleEditUser(user)} variant="ghost" size="sm" title="Editar Usuário" className="text-blue-600 hover:text-blue-700"><Edit size={16} /></Button>
                <Button onClick={() => requestDeleteUser(user)} variant="ghost" size="sm" title="Excluir Usuário" className="text-red-500 hover:text-red-600" disabled={user.profile === 'admin'}><TrashIcon size={16} /></Button>
            </td>
        </tr>
    );

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Gerenciamento de Usuários">
            <div className="space-y-6">
                <div className="p-5 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                        <div className="relative flex-grow w-full lg:flex-1">
                            <input id="search-users" type="text" placeholder="Buscar por nome ou email..." className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full shadow-sm text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                        <div className="w-full lg:w-auto flex-shrink-0"><Button onClick={handleAddUser} variant="primary" iconLeft={<UserPlus size={18} />} className="w-full">Adicionar Usuário</Button></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FilterInput label="Perfil" name="profile" value={filters.profile} onChange={e => setFilters(p => ({ ...p, profile: e.target.value }))} placeholder="Todos os Perfis"><option value="admin">Admin</option><option value="manager">Gestor</option><option value="collaborator">Colaborador</option></FilterInput>
                        <FilterInput label="Departamento" name="department" value={filters.department} onChange={e => setFilters(p => ({ ...p, department: e.target.value }))} placeholder="Todos os Departamentos">{["Engenharia de Software (Frontend)", "Engenharia de Software (Backend)"].map(d => <option key={d} value={d}>{d}</option>)}</FilterInput>
                        <FilterInput label="Status" name="status" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))} placeholder="Todos os Status"><option value="active">Ativo</option><option value="inactive">Inativo</option></FilterInput>
                    </div>
                </div>
                <Table headers={tableHeaders} data={filteredUsers} renderRow={renderUserRow} isLoading={loading} emptyMessage="Nenhum usuário encontrado." searchTerm={searchTerm} />
            </div>

            <UserModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} userToEdit={editingUser} />

            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDeleteUser}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o usuário "${userToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                isLoading={isDeleteLoading}
            />
        </MainLayout>
    );
};
