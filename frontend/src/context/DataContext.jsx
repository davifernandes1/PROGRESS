import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [pdis, setPdis] = useState([]);
    const { currentUser } = useAuth();

    const fetchUsers = useCallback(async () => {
        if (!currentUser || currentUser.profile === 'collaborator') return;
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) { console.error("Erro ao carregar utilizadores", err); }
    }, [currentUser]);

    const fetchPdis = useCallback(async () => {
        if (!currentUser) return;
        try {
            const res = await api.get('/pdis');
            setPdis(res.data);
        } catch (err) { console.error("Erro ao carregar PDIs", err); }
    }, [currentUser]);

    useEffect(() => {
        fetchUsers();
        fetchPdis();
    }, [fetchUsers, fetchPdis]);

    // Função para Adicionar Utilizador no Banco
    const addUser = async (userData) => {
        try {
            const res = await api.post('/users', userData);
            setUsers(prev => [...prev, res.data]);
            return res.data;
        } catch (err) {
            throw new Error(err.response?.data?.error || "Erro ao criar utilizador");
        }
    };

    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) { console.error("Erro ao apagar", err); }
    };

    return (
        <DataContext.Provider value={{ users, pdis, addUser, deleteUser, refreshUsers: fetchUsers }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);