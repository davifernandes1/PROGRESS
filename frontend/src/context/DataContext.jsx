import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialMockUsers, initialMockPDIs, initialMockFeedbacks } from '../constants';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    useEffect(() => {
        const initStorage = (key, data) => {
            const storedData = localStorage.getItem(key);
            if (!storedData || JSON.parse(storedData).length === 0) {
                localStorage.setItem(key, JSON.stringify(data));
            }
        };
        initStorage('progress_app_users', initialMockUsers);
        initStorage('progress_app_pdis', initialMockPDIs);
        initStorage('progress_app_feedbacks', initialMockFeedbacks);
    }, []);

    const [users, setUsers] = useLocalStorage('progress_app_users', initialMockUsers);
    const [pdis, setPdis] = useLocalStorage('progress_app_pdis', initialMockPDIs);
    const [feedbacks, setFeedbacks] = useLocalStorage('progress_app_feedbacks', initialMockFeedbacks);

    const addUser = (newUser) => setUsers(prev => [...prev, newUser]);
    const updateUser = (userId, updatedData) => setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    const deleteUser = (userId) => setUsers(prev => prev.filter(u => u.id !== userId));

    const addPdi = (newPdi) => setPdis(prev => [...prev, newPdi]);
    const updatePdi = (pdiId, updatedData) => setPdis(prev => prev.map(p => p.id === pdiId ? { ...p, ...updatedData } : p));
    const deletePdi = (pdiId) => setPdis(prev => prev.filter(p => p.id !== pdiId));

    const addFeedback = (newFeedback) => setFeedbacks(prev => [...prev, newFeedback]);
    const updateFeedback = (feedbackId, updatedData) => setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, ...updatedData } : f));
    const deleteFeedback = (feedbackId) => setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));

    const value = {
        users, addUser, updateUser, deleteUser,
        pdis, addPdi, updatePdi, deletePdi,
        feedbacks, addFeedback, updateFeedback, deleteFeedback
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
