'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, Search, X, User, ShoppingCart, LogOut, Settings, Facebook, Watch, Glasses, SprayCan } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <nav className="fixed w-full z-50 transition-all duration-300">
            {/* Top Announcement Bar */}
            {settings.topBarAnnouncement && (
                <div className="bg-gold-gradient py-2 px-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <p className="text-dark-900 text-[10px] md:text-xs font-black text-center uppercase tracking-widest animate-pulse">
                        {settings.topBarAnnouncement}
                    </p>
                </div>
            )}

            <div className="glass border-b border-gold-400/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-3 group">
                                {settings.logoUrl ? (
                                    <img src={settings.logoUrl} alt={settings.storeName} className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                                ) : (
                                    <h1 className="text-2xl font-black text-gold-gradient tracking-tighter cursor-pointer group-hover:scale-105 transition-transform">{settings.storeName}</h1>
                                )}
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4 space-x-reverse text-right">
                                <Link href="/" className="text-white hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">الرئيسية</Link>
                                <Link href="/shop" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">المنتجات</Link>
                                <Link href="/shop/perfumes" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">العطور</Link>
                                <Link href="/shop/watches" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">الساعات</Link>
                                <Link href="/shop/glasses" className="text-gray-300 hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">النظارات</Link>
                                <span className="text-gold-400 px-2 opacity-50">|</span>
                                <Link href="/dubai-request" className="text-gold-400 border border-gold-400 hover:bg-gold-400 hover:text-dark-900 px-3 py-2 rounded-md text-sm font-bold transition-all duration-300">خدمة دبي VIP</Link>
                            </div>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button className="p-2 text-gray-400 hover:text-gold-400 transition-colors hidden sm:block">
                                <Search className="w-6 h-6" />
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={`p-2 transition-colors flex items-center gap-1 ${user ? 'text-gold-400' : 'text-gray-400 hover:text-gold-400'}`}
                                >
                                    <User className="w-6 h-6" />
                                    {user && <span className="text-[10px] hidden lg:block font-bold truncate max-w-[60px]">{user.name.split(' ')[0]}</span>}
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-dark-800 border-dark-700/50 border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        {user ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-dark-700">
                                                    <p className="text-[10px] text-gray-500 font-black uppercase">مرحباً بك</p>
                                                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                                                </div>
                                                <Link href="/account" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-dark-700 hover:text-gold-400 transition text-right flex-row-reverse">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    طلباتي
                                                </Link>
                                                <button
                                                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition text-right flex-row-reverse"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    تسجيل الخروج
                                                </button>
                                            </>
                                        ) : (
                                            <div className="p-4 text-center">
                                                <p className="text-xs text-gray-400 mb-3">سيتم إنشاء حسابك تلقائياً عند أول طلب</p>
                                                <Link href="/shop" onClick={() => setIsUserMenuOpen(false)} className="block w-full bg-gold-400 text-dark-900 text-[10px] font-black py-2 rounded-lg">ابدأ التسوق الآن</Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <Link href="/cart">
                                    <button className="p-2 md:p-2 text-gray-400 hover:text-gold-400 transition-colors relative">
                                        <ShoppingBag className="w-7 h-7 md:w-6 md:h-6" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 text-[11px] font-black leading-none text-white transform bg-red-600 rounded-full animate-pulse border-2 border-dark-900 shadow-lg">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </Link>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-400 hover:text-gold-400 transition active:scale-95"
                            >
                                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                            </button>
                        </div>
                    </div>
                </div>


                {/* Full Screen Mobile Menu - FINAL SOLID FIX */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[9999] bg-black flex flex-col md:hidden overflow-hidden h-screen w-screen">

                        {/* Header - Distinct Background */}
                        <div className="flex items-center justify-between p-6 bg-black border-b border-gray-800 shrink-0 relative z-[10000]">
                            <h2 className="text-2xl font-black text-gold-400">القائمة الرئيسية</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-12 h-12 flex items-center justify-center text-white bg-gray-900 rounded-full border border-gray-700 active:scale-95 transition-transform"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Menu Items - Scrollable Area */}
                        <div className="flex-1 overflow-y-auto bg-black p-6 relative z-[9999]">
                            <div className="flex flex-col gap-5 pt-4 pb-20"> {/* Added padding bottom for safety */}

                                <Link
                                    href="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-6 text-white p-5 rounded-2xl bg-gray-900/50 border border-gray-800 active:bg-gray-800 transition-all"
                                >
                                    <span className="text-2xl">🏠</span>
                                    <span className="text-xl font-bold">الرئيسية</span>
                                </Link>

                                <Link
                                    href="/shop"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-6 text-white p-5 rounded-2xl bg-gray-900/50 border border-gray-800 active:bg-gray-800 transition-all"
                                >
                                    <span className="text-2xl">🛍️</span>
                                    <span className="text-xl font-bold">جميع المنتجات</span>
                                </Link>

                                <div className="grid grid-cols-3 gap-4 my-2">
                                    <Link
                                        href="/shop/perfumes"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex flex-col items-center gap-3 bg-gray-900/30 p-4 rounded-2xl border border-gray-800 active:border-gold-400 active:bg-gray-800 transition-all group"
                                    >
                                        <SprayCan className="w-10 h-10 text-gold-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold text-gray-300 mt-2">العطور</span>
                                    </Link>
                                    <Link
                                        href="/shop/watches"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex flex-col items-center gap-3 bg-gray-900/30 p-4 rounded-2xl border border-gray-800 active:border-gold-400 active:bg-gray-800 transition-all group"
                                    >
                                        <Watch className="w-10 h-10 text-gold-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold text-gray-300 mt-2">الساعات</span>
                                    </Link>
                                    <Link
                                        href="/shop/glasses"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex flex-col items-center gap-3 bg-gray-900/30 p-4 rounded-2xl border border-gray-800 active:border-gold-400 active:bg-gray-800 transition-all group"
                                    >
                                        <Glasses className="w-10 h-10 text-gold-400 group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-bold text-gray-300 mt-2">النظارات</span>
                                    </Link>
                                </div>

                                <Link
                                    href="/dubai-request"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-5 text-gold-400 bg-gold-400/10 p-5 rounded-2xl border border-gold-400/30 font-bold mt-2"
                                >
                                    <span className="text-3xl">✨</span>
                                    <span className="text-lg">خدمة الطلب الخاص (دبي)</span>
                                </Link>

                                <div className="border-t border-gray-800 pt-8 mt-4">
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61586194517512"
                                        target="_blank"
                                        className="flex items-center justify-center gap-3 w-full bg-[#1877F2] text-white py-5 rounded-xl font-bold text-lg"
                                    >
                                        <Facebook className="w-6 h-6" />
                                        تابعنا على فيسبوك
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
