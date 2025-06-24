import React, { useState, useEffect } from 'react';
import { MainLayout, DashboardCard, ChartCard, LoadingScreen } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Target, Briefcase, MessageSquare } from 'lucide-react';

export const ManagerDashboard = ({ setCurrentPage, currentPage }) => {
    const { currentUser } = useAuth();
    const { users, pdis, feedbacks } = useData();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({ teamSize: 0, activePDIsTeam: 0, myActivePDIs: 0, teamFeedbacksGiven: 0, teamPDIStatus: [], myPDIsUpcoming: [] });

    useEffect(() => {
        if (!currentUser) return;
        setLoading(true);
        setTimeout(() => {
            const teamMembers = users.filter(u => u.managerId === currentUser.id);
            const teamPDIs = pdis.filter(pdi => teamMembers.some(tm => tm.id === pdi.collaboratorId));
            const myPDIsList = pdis.filter(pdi => pdi.collaboratorId === currentUser.id);
            setDashboardData({
                teamSize: teamMembers.length,
                activePDIsTeam: teamPDIs.filter(p => p.status === 'Em Andamento' || p.status === 'Atrasado').length,
                myActivePDIs: myPDIsList.filter(p => p.status !== 'Concluído').length,
                teamFeedbacksGiven: feedbacks.filter(f => f.managerId === currentUser.id).length,
                teamPDIStatus: Object.entries(teamPDIs.reduce((acc, pdi) => { acc[pdi.status] = (acc[pdi.status] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value })),
                myPDIsUpcoming: myPDIsList.filter(p => p.status !== 'Concluído').sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 3)
            });
            setLoading(false);
        }, 500);
    }, [currentUser, users, pdis, feedbacks]);

    if (loading) return <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle="Painel do Gestor"><LoadingScreen /></MainLayout>

    return (
        <MainLayout setCurrentPage={setCurrentPage} currentPage={currentPage} pageTitle={`Painel do Gestor: ${currentUser?.name || ''}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Membros da Equipe" value={dashboardData.teamSize} icon={<Users />} bgColorClass="bg-blue-100" textColorClass="text-blue-600" />
                <DashboardCard title="PDIs Ativos (Equipe)" value={dashboardData.activePDIsTeam} icon={<Target />} bgColorClass="bg-orange-100" textColorClass="text-orange-600" linkTo="manager-team-pdis" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Meus PDIs Ativos" value={dashboardData.myActivePDIs} icon={<Briefcase />} bgColorClass="bg-green-100" textColorClass="text-green-600" linkTo="manager-my-pdis" setCurrentPage={setCurrentPage} />
                <DashboardCard title="Feedbacks Enviados" value={dashboardData.teamFeedbacksGiven} icon={<MessageSquare />} bgColorClass="bg-yellow-100" textColorClass="text-yellow-700" linkTo="manager-give-feedback" setCurrentPage={setCurrentPage} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Status dos PDIs da Equipe">
                    <ResponsiveContainer width="100%" height="100%"><BarChart data={dashboardData.teamPDIStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="value" fill="#8884d8" /></BarChart></ResponsiveContainer>
                </ChartCard>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Meus Próximos PDIs</h3>
                    {dashboardData.myPDIsUpcoming.length > 0 ? (
                        <ul className="space-y-3">{dashboardData.myPDIsUpcoming.map(pdi => <li key={pdi.id} className="p-3 bg-slate-50 rounded-lg border"><p className="font-semibold">{pdi.title}</p><p className="text-sm text-gray-500">Prazo: {formatDate(pdi.dueDate)}</p></li>)}</ul>
                    ) : <p className="text-gray-500 text-center py-4">Nenhum PDI ativo.</p>}
                </div>
            </div>
        </MainLayout>
    );
};