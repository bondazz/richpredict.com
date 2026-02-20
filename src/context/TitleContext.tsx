"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TitleContextType {
    title: string | null;
    setTitle: (title: string | null) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState<string | null>(null);

    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    );
}

export function useTitle() {
    const context = useContext(TitleContext);
    if (!context) {
        throw new Error("useTitle must be used within a TitleProvider");
    }
    return context;
}
