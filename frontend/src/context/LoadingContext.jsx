import React, { createContext, useState, useCallback, useContext } from 'react';
import { LoadingScreen } from '../components/ui/LoadingScreen';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const showLoading = useCallback(() => setIsLoading(true), []);
    const hideLoading = useCallback(() => setIsLoading(false), []);
    return (
        <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
            {children}
            {isLoading && <LoadingScreen />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);

