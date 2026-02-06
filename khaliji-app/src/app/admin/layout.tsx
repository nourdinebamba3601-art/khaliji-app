'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Plane, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAdminLogged, adminLogout } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        // Immediate check if possible, or wait for context
        if (isAdminLogged !== undefined) {
            if (!isAdminLogged && !pathname?.startsWith('/admin/login')) {
                router.replace('/');
            }
            setIsChecking(false);
        }
    }, [isAdminLogged, pathname, router]);

    // Handle initial server check
    if (isChecking && !pathname?.startsWith('/admin/login')) {
        return (
            <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-gold-400 gap-4">
                <ShieldAlert className="w-12 h-12 animate-pulse" />
                <p className="font-bold tracking-widest text-sm animate-pulse">جاري تأمين الاتصال...</p>
            </div>
        );
    }

    // Strict Guard: If not logged in and not on login page, don't render a single pixel of the dashboard
    if (!isAdminLogged && !pathname?.startsWith('/admin/login')) {
        return null;
    }

    if (pathname?.startsWith('/admin/login')) {
        return <div className="min-h-screen bg-dark-900">{children}</div>;
    }

    const navItems = [
        { icon: LayoutDashboard, label: 'الرئيسية', href: '/admin' },
        { icon: Package, label: 'المنتجات', href: '/admin/products' },
        { icon: ShoppingCart, label: 'الطلبات', href: '/admin/orders' },
        { icon: Plane, label: 'طلبات دبي الواردة', href: '/admin/dubai-requests' },
        { icon: Settings, label: 'الإعدادات', href: '/admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-dark-900 text-white overflow-hidden" dir="rtl">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-dark-800 border-l border-dark-700 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gold-gradient">أناقة الخليج</h1>
                        <p className="text-xs text-gray-500 mt-1">لوحة التحكم</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gold-500 text-dark-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-dark-700">
                    <button onClick={() => { adminLogout(); router.push('/'); }} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full rounded-lg transition">
                        <LogOut className="w-5 h-5" />
                        <span>تسجيل خروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-6 md:hidden flex-shrink-0">
                    <h1 className="text-lg font-bold text-gold-400">لوحة التحكم</h1>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gold-400 hover:bg-dark-700 rounded-lg">
                        <LayoutDashboard className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-auto bg-dark-900 border-l border-dark-800 relative p-6 md:p-10">
                    {/* Overlay for mobile sidebar */}
                    {isSidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
