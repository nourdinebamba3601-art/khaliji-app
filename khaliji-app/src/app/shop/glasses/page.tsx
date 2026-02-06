'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import { Glasses, Search, ArrowRight, Heart, Plane } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GlassesPage() {
    const { products } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    // Optimization: Memoize filtered products
    const filteredGlasses = useMemo(() => {
        const all = products.filter(p => p.category === 'glasses');
        if (!searchQuery) return all;
        const query = searchQuery.toLowerCase();
        return all.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const sections = useMemo(() => ({
        men: filteredGlasses.filter(p => (p.gender === 'men' || p.gender === 'unisex') && p.source === 'local'),
        women: filteredGlasses.filter(p => (p.gender === 'women' || p.gender === 'unisex') && p.source === 'local'),
        dubai: filteredGlasses.filter(p => p.source === 'dubai')
    }), [filteredGlasses]);

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
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-sm font-bold mb-8"
                    >
                        <Glasses className="w-4 h-4" />
                        <span>تشكيلة نظارات 2026</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">فخامة <span className="text-gold-gradient">النظر</span></h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">استكشف أفخم ماركات النظارات العالمية المتوفرة حصرياً لدينا في موريتانيا.</p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="ابحث عن ماركة أو موديل..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-gold-400 outline-none transition-all text-white font-bold"
                        />
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">

                {/* Men's Section */}
                {sections.men.length > 0 && (
                    <section id="men">
                        <SectionHeader
                            title="نظارات رجالية"
                            subtitle="القوة والهيبة في تصميم واحد"
                            icon={Heart}
                            color="bg-blue-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sections.men.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {/* Women's Section */}
                {sections.women.length > 0 && (
                    <section id="women">
                        <SectionHeader
                            title="نظارات نسائية"
                            subtitle="الرقة والجمال لكل المناسبات"
                            icon={Heart}
                            color="bg-pink-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sections.women.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {/* Dubai Section */}
                {sections.dubai.length > 0 && (
                    <section id="dubai" className="bg-gold-400/5 p-12 rounded-[3.5rem] border border-gold-400/10">
                        <SectionHeader
                            title="خدمة دبي VIP"
                            subtitle="موديلات حصرية لا تتوفر إلا بطلب خاص من دبي"
                            icon={Plane}
                            color="bg-gold-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sections.dubai.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href="/dubai-request" className="inline-flex items-center gap-2 text-gold-400 font-bold hover:underline">
                                اطلب موديلك المفضل الآن من دبي <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                )}

                {filteredGlasses.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-gray-500">حاول البحث باستخدام كلمات أخرى</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
