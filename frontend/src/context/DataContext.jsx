import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [pdis, setPdis] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
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

    const fetchFeedbacks = useCallback(async () => {
        if (!currentUser) return;
        try {
            const res = await api.get('/feedbacks').catch(() => ({ data: [] }));
            setFeedbacks(res.data || []);
        } catch (err) { console.error("Erro ao carregar Feedbacks", err); }
    }, [currentUser]);

    useEffect(() => {
        fetchUsers();
        fetchPdis();
        fetchFeedbacks();
    }, [fetchUsers, fetchPdis, fetchFeedbacks]);

    /* --- UTILIZADORES --- */
    const addUser = async (userData) => {
        try {
            const res = await api.post('/users', userData);
            setUsers(prev => [...prev, res.data]);
            return res.data;
        } catch (err) { throw new Error(err.response?.data?.error || "Erro ao criar utilizador"); }
    };
    const updateUser = async (userId, updatedData) => {
        try {
            // await api.put(`/users/${userId}`, updatedData); // Descomentar quando existir a rota
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
        } catch (err) { console.error("Erro ao atualizar", err); }
    };
    const deleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) { console.error("Erro ao apagar", err); }
    };

    /* --- PDIS --- */
    const addPdi = async (pdiData) => {
        try {
            const res = await api.post('/pdis', pdiData);
            setPdis(prev => [...prev, res.data]);
            return res.data;
        } catch (err) { throw new Error(err.response?.data?.error || "Erro ao criar PDI"); }
    };
    const updatePdi = async (pdiId, updatedData) => {
        try {
            const res = await api.put(`/pdis/${pdiId}`, updatedData);
            setPdis(prev => prev.map(p => p.id === pdiId ? res.data : p));
        } catch (err) { console.error("Erro ao atualizar PDI", err); }
    };
    const deletePdi = async (pdiId) => {
        try {
            await api.delete(`/pdis/${pdiId}`);
            setPdis(prev => prev.filter(p => p.id !== pdiId));
        } catch (err) { console.error("Erro ao apagar PDI", err); }
    };

    /* --- FEEDBACKS --- */
    const addFeedback = async (feedbackData) => {
        try {
            const res = await api.post('/feedbacks', feedbackData);
            setFeedbacks(prev => [res.data, ...prev]);
            return res.data;
        } catch (err) { throw new Error(err.response?.data?.error || "Erro ao criar Feedback"); }
    };
    const updateFeedback = async (feedbackId, updatedData) => {
        try {
            const res = await api.put(`/feedbacks/${feedbackId}`, updatedData);
            setFeedbacks(prev => prev.map(f => f.id === feedbackId ? res.data : f));
        } catch (err) { console.error("Erro ao atualizar Feedback", err); }
    };
    const deleteFeedback = async (feedbackId) => {
        try {
            await api.delete(`/feedbacks/${feedbackId}`);
            setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
        } catch (err) { console.error("Erro ao apagar feedback", err); }
    };

    return (
        <DataContext.Provider value={{ 
            users, pdis, feedbacks, 
            addUser, updateUser, deleteUser,
            addPdi, updatePdi, deletePdi,
            addFeedback, updateFeedback, deleteFeedback,
            refreshUsers: fetchUsers 
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);