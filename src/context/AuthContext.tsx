"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    subscription: any | null;
    refreshSubscription: () => Promise<void>;
    isAuthModalOpen: boolean;
    setAuthModalOpen: (open: boolean) => void;
    authView: 'login' | 'signup' | 'forgot-password';
    setAuthView: (view: 'login' | 'signup' | 'forgot-password') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [subscription, setSubscription] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password'>('login');

    useEffect(() => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchSubscription(session.user.id);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchSubscription(session.user.id);
                } else {
                    setSubscription(null);
                }
                setIsLoading(false);
            }
        );

        return () => {
            authListener.unsubscribe();
        };
    }, []);

    const fetchSubscription = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setSubscription(data);
            } else {
                setSubscription(null);
            }
        } catch (e) {
            console.error("Error fetching subscription", e);
            setSubscription(null);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSubscription(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isLoading,
            signOut,
            subscription,
            refreshSubscription: () => user ? fetchSubscription(user.id) : Promise.resolve(),
            isAuthModalOpen,
            setAuthModalOpen,
            authView,
            setAuthView
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
