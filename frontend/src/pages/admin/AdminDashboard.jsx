import React, { useState, useEffect } from 'react';
import { MainLayout, DashboardCard, ChartCard, LoadingScreen, Button } from '../../components/ui';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDate, formatDateTime } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserCog, ShieldCheck, ClipboardList, Target, CheckSquare as CheckSquareIcon, AlertTriangle, Clock, ChevronUp } from 'lucide-react';

export const AdminDashboard = ({ setCurrentPage, currentPage }) => {
    const { users, pdis, feedbacks } = useData();
    const { addNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ userStats: {}, pdiStats: {}, recentFeedbacks: [], systemHealth: {} });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const activeUsers = users.filter(u => u.status === 'active');
            const userStats = {
                total: activeUsers.length,
                collaborators: activeUsers.filter(u => u.profile === 'collaborator').length,
                managers: activeUsers.filter(u => u.profile === 'manager').length,
                admins: activeUsers.filter(u => u.profile === 'admin').length,
                inactive: users.length - activeUsers.length,
                byProfile: Object.entries(activeUsers.reduce((acc, u) => {
                    const profileName = u.profile.charAt(0).toUpperCase() + u.profile.slice(1);
                    acc[profileName] = (acc[profileName] || 0) + 1;
                    return acc;
                }, {})).map(([name, value]) => ({ name, value })),
                byDepartment: Object.entries(activeUsers.reduce((acc, user) => {
                    acc[user.department] = (acc[user.department] || 0) + 1; return acc;
                }, {})).map(([name, value]) => ({ name, value }))
            };

            const pdiStats = {
                active: pdis.filter(p => p.status === 'Em Andamento').length,
                completed: pdis.filter(p => p.status === 'Concluído').length,
                pending: pdis.filter(p => p.status === 'Pendente').length,
                overdue: pdis.filter(p => p.status === 'Atrasado').length,
                total: pdis.length,
                byStatus: Object.entries(pdis.reduce((acc, pdi) => {
                    acc[pdi.status] = (acc[pdi.status] || 0) + 1; return acc;
                }, {})).map(([name, value]) => ({ name, value })),
            };

            const recentFeedbacks = [...feedbacks]
                .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
                .slice(0, 5)
                .map(fb => ({
                    ...fb,
                    collaboratorName: users.find(u => u.id === fb.collaboratorId)?.name,
                    managerName: users.find(u => u.id === fb.managerId)?.name
                }));

            const systemHealth = { apiStatus: 'Operacional', lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() };

            setStats({ userStats, pdiStats, recentFeedbacks, systemHealth });
            setLoading(false);
        }, 500);
    }, [users, pdis, feedbacks]);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    const renderCustomizedLabelForPie = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
        if (percent * 100 < 5) return null;
        return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="500">{`${(percent * 100).toFixed(0)}%`}</text>;
    };

    if (loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel Principal"><LoadingScreen /></MainLayout>

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel de Administração Principal">
            <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title="Usuários Ativos" value={stats.userStats.total} icon={<Users />} bgColorClass="bg-blue-100" textColorClass="text-blue-600" linkTo="admin-users" setCurrentPage={setCurrentPage} subValue={`${stats.userStats.inactive} inativo(s)`} />
                <DashboardCard title="Colaboradores" value={stats.userStats.collaborators} icon={<UserCheck />} bgColorClass="bg-green-100" textColorClass="text-green-600" />
                <DashboardCard title="Gestores" value={stats.userStats.managers} icon={<UserCog />} bgColorClass="bg-purple-100" textColorClass="text-purple-600" />
                <DashboardCard title="Administradores" value={stats.userStats.admins} icon={<ShieldCheck />} bgColorClass="bg-pink-100" textColorClass="text-pink-600" />
                <DashboardCard title="PDIs Totais" value={stats.pdiStats.total} icon={<ClipboardList />} bgColorClass="bg-indigo-100" textColorClass="text-indigo-600" linkTo="admin-pdis" setCurrentPage={setCurrentPage} />
                <DashboardCard title="PDIs Ativos" value={stats.pdiStats.active} icon={<Target />} bgColorClass="bg-orange-100" textColorClass="text-orange-600" />
                <DashboardCard title="PDIs Concluídos" value={stats.pdiStats.completed} icon={<CheckSquareIcon />} bgColorClass="bg-teal-100" textColorClass="text-teal-600" />
                <DashboardCard title="PDIs Atrasados" value={stats.pdiStats.overdue} icon={<AlertTriangle />} bgColorClass="bg-red-100" textColorClass="text-red-600" />
            </div>
            <div className="grid grid-cols-1 gap-6 mb-8 xl:grid-cols-3">
                <ChartCard title="Usuários por Perfil">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={stats.userStats.byProfile} dataKey="value" labelLine={false} outerRadius="80%" label={renderCustomizedLabelForPie}>{stats.userStats.byProfile?.map((_, idx) => <Cell key={`cell-profile-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="PDIs por Status">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.pdiStats.byStatus} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} /><Tooltip formatter={(val) => [`${val} PDI(s)`]} /><Legend /><Bar dataKey="value" name="Quantidade" radius={[0, 4, 4, 0]} barSize={25}>{stats.pdiStats.byStatus?.map((_, idx) => <Cell key={`cell-status-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Usuários por Departamento">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart><Pie data={stats.userStats.byDepartment} dataKey="value" innerRadius="50%" outerRadius="80%" paddingAngle={2} label={renderCustomizedLabelForPie}>{stats.userStats.byDepartment?.map((_, idx) => <Cell key={`cell-dept-${idx}`} fill={PIE_COLORS[(idx + 2) % PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend iconType="circle" /></PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Feedbacks Recentes no Sistema</h3>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage('admin-feedbacks')} iconRight={<ChevronUp size={14} style={{ transform: 'rotate(90deg)' }} />}>
                            Ver Todos
                        </Button>
                    </div>
                    {stats.recentFeedbacks.length > 0 ? (
                        <ul className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                            {stats.recentFeedbacks.map(fb => (
                                <li key={fb.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold text-slate-800">{fb.managerName || "Gestor"}</span> para <span className="font-semibold text-slate-800">{fb.collaboratorName || "Colaborador"}</span>
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{formatDateTime(fb.dateSubmitted)}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 italic truncate" title={fb.feedbackText}>"{fb.feedbackText}"</p>
                                    {fb.pdiId && <p className="text-xs text-blue-500 mt-1">Relacionado ao PDI: {pdis.find(p => p.id === fb.pdiId)?.title || fb.pdiId}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500 py-8 text-center">Nenhum feedback recente para exibir.</p>}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Saúde do Sistema</h3>
                    <div className="space-y-3">
                        <div className={`flex items-center p-3 rounded-md ${stats.systemHealth.apiStatus === 'Operacional' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {stats.systemHealth.apiStatus === 'Operacional' ? <CheckSquareIcon size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
                            <span>Status da API: <span className="font-semibold">{stats.systemHealth.apiStatus}</span></span>
                        </div>
                        <div className="flex items-center p-3 rounded-md bg-slate-50 text-slate-700">
                            <Clock size={20} className="mr-2" />
                            <span>Último Backup: <span className="font-semibold">{stats.systemHealth.lastBackup ? formatDateTime(stats.systemHealth.lastBackup) : 'N/A'}</span></span>
                        </div>
                        <Button variant="outline" className="w-full mt-2" onClick={() => addNotification("Verificação de saúde simulada concluída.", "success")}>
                            Verificar Agora
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
