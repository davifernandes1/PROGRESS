export const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'active': case 'ativo': case 'em andamento': case 'em_andamento': return 'bg-green-100 text-green-700';
        case 'inactive': case 'inativo': return 'bg-gray-100 text-gray-700';
        case 'pending': case 'pendente': return 'bg-yellow-100 text-yellow-700';
        case 'completed': case 'concluído': case 'concluido': return 'bg-blue-100 text-blue-700';
        case 'overdue': case 'atrasado': return 'bg-red-100 text-red-700';
        case 'cancelled': case 'cancelado': return 'bg-orange-100 text-orange-700';
        case 'admin': return 'bg-purple-100 text-purple-700';
        case 'manager': return 'bg-sky-100 text-sky-700';
        case 'collaborator': return 'bg-indigo-100 text-indigo-700';
        case 'positivo': return 'bg-green-100 text-green-700';
        case 'reconhecimento': return 'bg-blue-100 text-blue-700';
        case 'construtivo': return 'bg-yellow-100 text-yellow-700';
        case 'alinhamento': return 'bg-slate-100 text-slate-700';
        default: return 'bg-slate-100 text-slate-700';
    }
};
