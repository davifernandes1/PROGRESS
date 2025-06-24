import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/ui';
import { LoginScreen } from '../pages/LoginScreen';
import { AdminDashboard, AdminUserManagement, AdminGlobalPDIs, AdminGlobalFeedbacks } from '../pages/admin';
import { ManagerDashboard, ManagerTeamPDIs, ManagerMyPDIs, ManagerGiveFeedbackScreen } from '../pages/manager';
import { CollaboratorPDIs, CollaboratorFeedbacks } from '../pages/collaborator';


export function ApplicationRoutes() {
    const { currentUser } = useAuth();

    const getDefaultPage = useCallback((p) => {
        if (p === 'admin') return 'admin-dashboard';
        if (p === 'manager') return 'manager-dashboard';
        if (p === 'collaborator') return 'collaborator-pdis';
        return 'login';
    }, []);

    const [currentPage, setCurrentPageInternal] = useState(() => {
        const storedPage = sessionStorage.getItem('currentPage');
        return storedPage || (currentUser ? getDefaultPage(currentUser.profile) : 'login');
    });

    const setAndStorePage = useCallback((page) => {
        sessionStorage.setItem('currentPage', page);
        setCurrentPageInternal(page);
    }, []);

    useEffect(() => {
        if (currentUser) {
            const accessiblePages = {
                admin: ['admin-dashboard', 'admin-users', 'admin-pdis', 'admin-feedbacks'],
                manager: ['manager-dashboard', 'manager-team-pdis', 'manager-my-pdis', 'manager-give-feedback'],
                collaborator: ['collaborator-pdis', 'collaborator-feedbacks'],
            };
            const userPages = accessiblePages[currentUser.profile] || [];
            if (!userPages.includes(currentPage)) {
                setAndStorePage(getDefaultPage(currentUser.profile));
            }
        } else if (currentPage !== 'login') {
            setAndStorePage('login');
        }
    }, [currentUser, currentPage, getDefaultPage, setAndStorePage]);


    if (!currentUser) return <LoginScreen />;

    const renderPage = () => {
        const props = { setCurrentPage: setAndStorePage, currentPage };
        switch (currentPage) {
            case 'admin-dashboard': return <AdminDashboard {...props} />;
            case 'admin-users': return <AdminUserManagement {...props} />;
            case 'admin-pdis': return <AdminGlobalPDIs {...props} />;
            case 'admin-feedbacks': return <AdminGlobalFeedbacks {...props} />;

            case 'manager-dashboard': return <ManagerDashboard {...props} />;
            case 'manager-team-pdis': return <ManagerTeamPDIs {...props} />;
            case 'manager-my-pdis': return <ManagerMyPDIs {...props} />;
            case 'manager-give-feedback': return <ManagerGiveFeedbackScreen {...props} />;

            case 'collaborator-pdis': return <CollaboratorPDIs {...props} />;
            case 'collaborator-feedbacks': return <CollaboratorFeedbacks {...props} />;

            default:
                setAndStorePage(getDefaultPage(currentUser.profile));
                return <LoadingScreen />;
        }
    };

    return <div className="min-h-screen bg-gray-100 font-sans">{renderPage()}</div>;
}
