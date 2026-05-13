import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken'));

    const logout = useCallback(() => {
        sessionStorage.clear();
        setCurrentUser(null);
        setAuthToken(null);
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        const user = sessionStorage.getItem('currentUser');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
            setAuthToken(token);
        }
    }, [logout]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data;
            
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            setAuthToken(token);
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw new Error('Credenciais inválidas.');
        }
    };

    return <AuthContext.Provider value={{ currentUser, authToken, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);