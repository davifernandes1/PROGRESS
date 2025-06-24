import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken'));

    const logout = useCallback(() => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentPage');
        setCurrentUser(null);
        setAuthToken(null);
    }, []);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        const user = sessionStorage.getItem('currentUser');
        if (token && user) {
            try {
                setCurrentUser(JSON.parse(user));
                setAuthToken(token);
            } catch (error) {
                console.warn("Falha ao analisar o usuário do sessionStorage", error);
                logout();
            }
        }
    }, [logout]);

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const allUsers = JSON.parse(localStorage.getItem('progress_app_users') || '[]');
                const matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

                if (matchedUser && matchedUser.password === password) {
                    const mockToken = `simulated-jwt-${Date.now()}`;
                    sessionStorage.setItem('authToken', mockToken);
                    sessionStorage.setItem('currentUser', JSON.stringify(matchedUser));
                    setAuthToken(mockToken);
                    setCurrentUser(matchedUser);
                    resolve(matchedUser);
                } else {
                    reject(new Error('Credenciais inválidas.'));
                }
            }, 700);
        });
    };

    return <AuthContext.Provider value={{ currentUser, authToken, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
