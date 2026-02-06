'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { adminLogin } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        if (adminLogin(email, password)) {
            router.push('/admin');
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 selection:bg-gold-500 selection:text-dark-900">
            {/* Ambient Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 blur-[120px] rounded-full"></div>
            </div>

            <div className="bg-dark-800 p-10 rounded-[2.5rem] border border-white/5 w-full max-w-md shadow-2xl relative z-10 backdrop-blur-xl">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gold-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold-500/20 rotate-12">
                        <ShieldCheck className="w-10 h-10 text-dark-900" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">تسجيل دخول المالك</h1>
                    <p className="text-gold-400 text-[10px] font-black uppercase tracking-[0.3em]">Authorized Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">البريد الإلكتروني</label>
                        <div className="relative">
                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark-900 border border-white/5 rounded-2xl px-12 py-4 text-white focus:border-gold-400 outline-none transition-all placeholder:text-gray-700"
                                placeholder="owner@khaliji.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">كلمة المرور السريّة</label>
                        <div className="relative">
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-white/5 rounded-2xl px-12 py-4 text-white focus:border-gold-400 outline-none transition-all placeholder:text-gray-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-400 text-xs font-bold text-center bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button type="submit" className="w-full bg-gold-gradient hover:opacity-90 text-dark-900 font-black py-4 rounded-2xl transition-all transform active:scale-95 shadow-xl shadow-gold-500/10 uppercase tracking-widest text-sm">
                        دخول لوحة التحكم
                    </button>

                    <div className="text-center mt-8">
                        <Link href="/" className="text-[10px] font-black text-gray-600 hover:text-gold-400 transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                            Return to Boutique
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Fixed import for motion
import { motion } from 'framer-motion';
