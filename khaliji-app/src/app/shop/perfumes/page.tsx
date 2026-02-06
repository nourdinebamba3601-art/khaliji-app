'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductContext';
import ProductCard from '@/components/ProductCard';
import { SprayCan, Search, ArrowRight, Heart, Plane, Sparkles } from 'lucide-react';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PerfumesPage() {
    const { products } = useProducts();
    const [searchQuery, setSearchQuery] = useState('');

    // Optimization: Memoize filtered products
    const filteredPerfumes = useMemo(() => {
        const all = products.filter(p => p.category === 'perfumes');
        if (!searchQuery) return all;
        const query = searchQuery.toLowerCase();
        return all.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query) ||
            p.perfumeScent?.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const sections = useMemo(() => ({
        local: filteredPerfumes.filter(p => p.source === 'local'),
        dubai: filteredPerfumes.filter(p => p.source === 'dubai')
    }), [filteredPerfumes]);

    // Sub-segmenting local by gender
    const localMen = useMemo(() => sections.local.filter(p => p.gender === 'men' || p.gender === 'unisex'), [sections.local]);
    const localWomen = useMemo(() => sections.local.filter(p => p.gender === 'women' || p.gender === 'unisex'), [sections.local]);

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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-sm font-bold mb-8"
                    >
                        <SprayCan className="w-4 h-4" />
                        <span>عطور النخبة 2026</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">عبير <span className="text-gold-gradient">الفخامة</span></h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">مجموعة من أرقى العطور العالمية المختارة بعناية لتناسب ذوقك الرفيع.</p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="ابحث عن عطر، ماركة، أو رائحة (عود، مسك...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-800 border border-dark-700 rounded-2xl py-4 pr-12 pl-4 focus:ring-2 focus:ring-gold-400 outline-none transition-all text-white font-bold"
                        />
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">

                {/* Local Men's Section */}
                {localMen.length > 0 && (
                    <section>
                        <SectionHeader
                            title="عطور رجالية (نواكشوط)"
                            subtitle="روائح تجسد القوة والأناقة الكلاسيكية"
                            icon={Sparkles}
                            color="bg-blue-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {localMen.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {/* Local Women's Section */}
                {localWomen.length > 0 && (
                    <section>
                        <SectionHeader
                            title="عطور نسائية (نواكشوط)"
                            subtitle="جاذبية وسحر في كل رشة"
                            icon={Heart}
                            color="bg-rose-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {localWomen.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}

                {/* Dubai Section */}
                {sections.dubai.length > 0 && (
                    <section id="dubai" className="bg-gold-400/5 p-12 rounded-[3.5rem] border border-gold-400/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                        <SectionHeader
                            title="عطور طلب دبي الخاص"
                            subtitle="قطع نادرة وأصدارات محدودة نشحنها لك مباشرة من أفخم مولات دبي"
                            icon={Plane}
                            color="bg-gold-500"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {sections.dubai.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                        <div className="mt-12 text-center">
                            <Link href="/dubai-request" className="inline-flex items-center gap-2 bg-gold-gradient text-dark-900 px-8 py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-xl">
                                اطلب عطرك المفضل الآن من دبي <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                )}

                {filteredPerfumes.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">لا توجد نتائج</h3>
                        <p className="text-gray-500">جاري العمل على توفير تشكيلة جديدة من العطور العالمية.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
