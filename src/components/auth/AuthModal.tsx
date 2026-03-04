"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AuthModal() {
    const { isAuthModalOpen, setAuthModalOpen, authView, setAuthView } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isAuthModalOpen) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (authView === 'login') {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success('Successfully logged in!');
                setAuthModalOpen(false);
            } else if (authView === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;
                toast.success('Successfully signed up! Check your email for verification.');
                setAuthModalOpen(false);
            } else {
                // Forgot password
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                toast.success('Password reset email sent!');
                setAuthView('login');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setAuthModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-md bg-[#001e28] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="relative h-24 bg-gradient-to-br from-[#164e63] to-[#083344] p-6 flex items-center">
                    <button
                        onClick={() => setAuthModalOpen(false)}
                        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter font-[Klapt]">
                            {authView === 'login' ? 'Welcome Back' : authView === 'signup' ? 'Create Account' : 'Reset Password'}
                        </h2>
                        <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                            {authView === 'login' ? 'Login to your account' : authView === 'signup' ? 'Join RichPredict today' : 'Enter your email to recover your account'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[11px] font-bold">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-4">
                        {authView === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[var(--fs-yellow)]/50 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[var(--fs-yellow)]/50 transition-colors"
                                />
                            </div>
                        </div>

                        {authView !== 'forgot-password' && (
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Password</label>
                                    {authView === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setAuthView('forgot-password')}
                                            className="text-[10px] font-black text-[var(--fs-yellow)] uppercase tracking-widest hover:underline"
                                        >
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-[var(--fs-yellow)]/50 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            disabled={isLoading}
                            className="w-full bg-[var(--fs-yellow)] text-black py-4 rounded-xl text-[12px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,221,0,0.1)] flex items-center justify-center gap-2 group mt-4"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : (
                                <>
                                    {authView === 'login' ? 'Login' : authView === 'signup' ? 'Create Account' : 'Send Reset Link'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer toggle */}
                    <div className="text-center pt-2">
                        <button
                            onClick={() => setAuthView(authView === 'login' ? 'signup' : 'login')}
                            className="text-[11px] font-bold text-white/40 hover:text-white transition-colors"
                        >
                            {authView === 'login' ? (
                                <>New to RichPredict? <span className="text-[var(--fs-yellow)]">Sign up</span></>
                            ) : (
                                <>Already have an account? <span className="text-[var(--fs-yellow)]">Login</span></>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
