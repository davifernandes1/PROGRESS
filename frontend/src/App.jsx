import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoadingProvider } from './context/LoadingContext';
import { NotificationProvider } from './context/NotificationContext';
import { ApplicationRoutes } from './routes/AppRouter';

// Importando os arquivos de exportação para facilitar a organização
import './pages/admin';
import './pages/collaborator';
import './pages/manager';


export default function App() {
    return (
        <AuthProvider>
            <DataProvider>
                <LoadingProvider>
                    <NotificationProvider>
                        <ApplicationRoutes />
                    </NotificationProvider>
                </LoadingProvider>
            </DataProvider>
        </AuthProvider>
    );
}