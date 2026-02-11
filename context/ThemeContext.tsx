"use client";

import React, { createContext, useContext } from 'react';

interface ThemeContextType {
    theme: 'dark';
    setTheme: (theme: 'dark') => void;
    resolvedTheme: 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeContext.Provider value={{ theme: 'dark', setTheme: () => { }, resolvedTheme: 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
