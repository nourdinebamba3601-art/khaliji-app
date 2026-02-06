'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Watch, ArrowRight, Plane, Heart, Search } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WatchesPage() {
    const { products } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredWatches = useMemo(() => {
        const all = products.filter(p => p.category === 'watches');
        if (!searchQuery) return all;
        const query = searchQuery.toLowerCase();
        return all.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const sections = useMemo(() => ({
        men: filteredWatches.filter(p => (p.gender === 'men' || p.gender === 'unisex') && p.source === 'local'),
        women: filteredWatches.filter(p => (p.gender === 'women' || p.gender === 'unisex') && p.source === 'local'),
        dubai: filteredWatches.filter(p => p.source === 'dubai')
    }), [filteredWatches]);

    const SectionHeader = ({ title, subtitle, icon: Icon, color }: any) => (
        <div className="flex flex-col items-center mb-12 text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${color} bg-opacity-20 backdrop-blur border border-white border-opacity-10 shadow-xl`}>
                <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
            <p className="text-gray-400 max-w-lg">{subtitle}</p>
        </div>
    );

    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />
            <Toaster position="top-center" richColors />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-dark-800">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gold-500/10 border border-gold-500/30 px-4 py-1.5 rounded-full mb-6"
                        >
                            <span className="text-gold-400 text-xs font-black tracking-widest uppercase flex items-center gap-2">
                                <Watch className="w-4 h-4" />
                                Exclusive Luxury Watches
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                        >
                            عالم <span className="text-gold-gradient">الساعات النادرة</span>
                        </motion.h1>

                        <div className="max-w-xl w-full mx-auto relative group mb-12">
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400" />
                            <input
                                type="text"
                                placeholder="ابحث عن ماركة (رولكس، أوميغا...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 pr-12 outline-none focus:ring-2 focus:ring-gold-400 transition-all font-bold"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
                {sections.men.length > 0 && (
                    <section id="men">
                        <SectionHeader title="ساعات رجالية" subtitle="فخامة تعكس هيبتك" icon={Watch} color="bg-amber-600" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {sections.men.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {sections.women.length > 0 && (
                    <section id="women">
                        <SectionHeader title="ساعات نسائية" subtitle="رقة وجمال لا ينتهي" icon={Heart} color="bg-rose-400" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {sections.women.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {sections.dubai.length > 0 && (
                    <section id="dubai" className="bg-dark-800/40 p-10 rounded-[3rem] border border-gold-400/10">
                        <SectionHeader title="طلبات دبي VIP" subtitle="موديلات عالمية بطلب خاص" icon={Plane} color="bg-gold-500" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {sections.dubai.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </main>
    );
}
