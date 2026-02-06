'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, ChevronDown, Check, Search, Tag, DollarSign, Star, Plane, ShoppingBag, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

export default function ShopPage() {
    const { products } = useProducts();
    const searchParams = useSearchParams();
    const catQuery = searchParams.get('cat');
    const sourceQuery = searchParams.get('source');

    const [filterOpen, setFilterOpen] = useState(false);

    // Filter State
    const [selectedSource, setSelectedSource] = useState<string[]>(sourceQuery ? [sourceQuery] : []);
    const [selectedCat, setSelectedCat] = useState<string[]>(catQuery ? [catQuery] : []);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
    const [selectedStraps, setSelectedStraps] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<number>(1000000); // 1M UM max
    const [searchQuery, setSearchQuery] = useState('');

    // Extract unique brands from products
    const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

    const toggleSource = (source: string) => {
        if (selectedSource.includes(source)) {
            setSelectedSource(selectedSource.filter(s => s !== source));
        } else {
            setSelectedSource([...selectedSource, source]);
        }
    };

    const toggleCat = (cat: string) => {
        if (selectedCat.includes(cat)) {
            setSelectedCat(selectedCat.filter(c => c !== cat));
        } else {
            setSelectedCat([...selectedCat, cat]);
        }
    };

    const toggleBrand = (brand: string) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const toggleShape = (shape: string) => {
        if (selectedShapes.includes(shape)) {
            setSelectedShapes(selectedShapes.filter(s => s !== shape));
        } else {
            setSelectedShapes([...selectedShapes, shape]);
        }
    };

    const toggleGender = (gender: string) => {
        if (selectedGenders.includes(gender)) {
            setSelectedGenders(selectedGenders.filter(g => g !== gender));
        } else {
            setSelectedGenders([...selectedGenders, gender]);
        }
    };

    const toggleMovement = (mov: string) => {
        if (selectedMovements.includes(mov)) {
            setSelectedMovements(selectedMovements.filter(m => m !== mov));
        } else {
            setSelectedMovements([...selectedMovements, mov]);
        }
    };

    const toggleStrap = (strap: string) => {
        if (selectedStraps.includes(strap)) {
            setSelectedStraps(selectedStraps.filter(s => s !== strap));
        } else {
            setSelectedStraps([...selectedStraps, strap]);
        }
    };

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Search filter
        if (searchQuery && !product.name.includes(searchQuery) && !product.description.includes(searchQuery)) return false;
        // Filter by source
        if (selectedSource.length > 0 && !selectedSource.includes(product.source)) return false;
        // Filter by category
        if (selectedCat.length > 0 && !selectedCat.includes(product.category)) return false;
        // Filter by brand
        if (selectedBrands.length > 0 && (!product.brand || !selectedBrands.includes(product.brand))) return false;
        // Filter by Frame Shape
        if (selectedShapes.length > 0 && (!product.frameShape || !selectedShapes.includes(product.frameShape))) return false;
        // Filter by Gender
        if (selectedGenders.length > 0 && (!product.gender || !selectedGenders.includes(product.gender))) return false;
        // Filter by Watch Filters
        if (selectedMovements.length > 0 && (!product.watchMovement || !selectedMovements.includes(product.watchMovement))) return false;
        if (selectedStraps.length > 0 && (!product.strapMaterial || !selectedStraps.includes(product.strapMaterial))) return false;
        // Filter by price
        if (product.price > priceRange) return false;
        return true;
    }).sort((a, b) => {
        // Default sort: Prioritize Perfumes, then Watches, then Glasses
        const categoryOrder = { 'perfumes': 1, 'watches': 2, 'glasses': 3 };
        const orderA = categoryOrder[a.category as keyof typeof categoryOrder] || 99;
        const orderB = categoryOrder[b.category as keyof typeof categoryOrder] || 99;
        return orderA - orderB;
    });

    const getCategoryTitle = () => {
        if (selectedCat.length === 1) {
            switch (selectedCat[0]) {
                case 'perfumes': return 'ركن العطور الفاخرة';
                case 'watches': return 'معرض الساعات القيمة';
                case 'glasses': return 'تشكيلة النظارات الشمسية';
                default: return 'المتجر الإلكتروني';
            }
        }
        return 'جميع المنتجات';
    };

    const getCategoryDesc = () => {
        if (selectedCat.length === 1) {
            switch (selectedCat[0]) {
                case 'perfumes': return 'أرقى العطور العالمية المختارة بعناية لتناسب ذوقكم الرفيع';
                case 'watches': return 'دقة التصميم وفخامة المعصم في مجموعة مختارة من أشهر الماركات';
                case 'glasses': return 'إطلالة عصرية وحماية فائقة مع أرقى الموديلات العالمية';
            }
        }
        return 'تصفح أفخم تشكيلة من الماركات العالمية المتوفرة في موريتانيا وأشهر أسواق دبي';
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white">
            <Navbar />

            {/* Header Area */}
            <div className="relative pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-dark-800 border-b border-dark-700"></div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gold-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
                    <div className="flex flex-col items-end">
                        <span className="text-gold-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 inline-flex items-center gap-2">
                            <Star className="w-3 h-3" />
                            Premium Selection
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{getCategoryTitle()}</h1>
                        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">{getCategoryDesc()}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Top Search bar */}
                <div className="mb-12 flex flex-col md:flex-row gap-4 items-center flex-row-reverse">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-gold-400 transition" />
                        <input
                            type="text"
                            placeholder="ابحث عن ماركة، عطر، أو موديل ساعة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-dark-800 border-2 border-dark-700 rounded-2xl px-14 py-4 focus:border-gold-400 outline-none transition text-right font-medium"
                        />
                    </div>
                    <button className="bg-gold-500 text-dark-900 px-8 py-4 rounded-2xl font-black hover:bg-gold-400 transition shadow-lg shadow-gold-500/20 whitespace-nowrap">
                        بحث سريع
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row-reverse gap-10">

                    {/* Sidebar Filters */}
                    <aside className={`lg:w-80 flex-shrink-0 space-y-8 ${filterOpen ? 'block' : 'hidden lg:block'}`}>

                        {/* 1. Price Filter */}
                        <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2 flex-row-reverse">
                                <DollarSign className="w-4 h-4 text-gold-400" />
                                تصفية حسب السعر
                            </h3>
                            <input
                                type="range"
                                min="1000"
                                max="1000000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full accent-gold-400 mb-4"
                            />
                            <div className="flex justify-between items-center flex-row-reverse">
                                <span className="text-xs text-gray-500">من 1,000 UM</span>
                                <span className="text-gold-400 font-bold ltr">{priceRange.toLocaleString()} UM</span>
                            </div>
                        </div>

                        {/* 2. Source Filter */}
                        <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                            <h3 className="font-bold text-white mb-6 flex items-center gap-2 flex-row-reverse">
                                <Tag className="w-4 h-4 text-gold-400" />
                                مكان التوفر
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-green-500"
                                        checked={selectedSource.includes('local')}
                                        onChange={() => toggleSource('local')}
                                    />
                                    <span className="text-gray-300 text-sm group-hover:text-green-400 transition flex-1 text-right">في المتجر (نواكشوط)</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                        checked={selectedSource.includes('dubai')}
                                        onChange={() => toggleSource('dubai')}
                                    />
                                    <span className="text-gray-300 text-sm group-hover:text-gold-400 transition flex-1 text-right flex items-center justify-end gap-2">
                                        طلب خاص من دبي
                                        <Plane className="w-3 h-3" />
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 3. Categories (Multi-select) */}
                        <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                            <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                التصنيفات
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { id: 'perfumes', label: 'العطور العالمية' },
                                    { id: 'watches', label: 'الساعات الفاخرة' },
                                    { id: 'glasses', label: 'النظارات الشمسية' }
                                ].map(cat => (
                                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                            checked={selectedCat.includes(cat.id)}
                                            onChange={() => toggleCat(cat.id)}
                                        />
                                        <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{cat.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 4. Brands (Multi-select) - Only show if there are brands */}
                        {allBrands.length > 0 && (
                            <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                                <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                    الماركة / البراند
                                </h3>
                                <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pl-2">
                                    {allBrands.map(brand => (
                                        <label key={brand} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                            />
                                            <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Custom Glasses Filters (Only show if glasses cat is selected or if no cat is selected) */}
                        {(selectedCat.includes('glasses') || selectedCat.length === 0) && (
                            <>
                                {/* Gender Filter */}
                                <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                                    <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                        الفئة (رجالي/نسائي)
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'men', label: 'رجالي' },
                                            { id: 'women', label: 'نسائي' },
                                            { id: 'unisex', label: 'للجنسين' }
                                        ].map(g => (
                                            <label key={g.id} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                                    checked={selectedGenders.includes(g.id)}
                                                    onChange={() => toggleGender(g.id)}
                                                />
                                                <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{g.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Frame Shape Filter */}
                                <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                                    <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                        شكل الإطار
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'round', label: 'دائري' },
                                            { id: 'square', label: 'مربع' },
                                            { id: 'aviator', label: 'Aviator' },
                                            { id: 'cat-eye', label: 'Cat Eye' },
                                            { id: 'other', label: 'أشكال أخرى' }
                                        ].map(shape => (
                                            <label key={shape.id} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                                    checked={selectedShapes.includes(shape.id)}
                                                    onChange={() => toggleShape(shape.id)}
                                                />
                                                <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{shape.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* 6. Custom Watch Filters */}
                        {(selectedCat.includes('watches') || (selectedCat.length === 0 && !selectedCat.includes('perfumes'))) && (
                            <>
                                {/* Movement Filter */}
                                <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                                    <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                        نوع الماكينة
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'automatic', label: 'أوتوماتيك' },
                                            { id: 'quartz', label: 'كوارتز (بطارية)' }
                                        ].map(m => (
                                            <label key={m.id} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                                    checked={selectedMovements.includes(m.id)}
                                                    onChange={() => toggleMovement(m.id)}
                                                />
                                                <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{m.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Strap Filter */}
                                <div className="bg-dark-800 p-8 rounded-[32px] border border-dark-700">
                                    <h3 className="font-bold text-white mb-6 flex items-center justify-between flex-row-reverse">
                                        نوع السوار
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { id: 'metal', label: 'معدن (Steel)' },
                                            { id: 'leather', label: 'جلد طبيعي' },
                                            { id: 'rubber', label: 'ربر (مطاط)' }
                                        ].map(s => (
                                            <label key={s.id} className="flex items-center gap-3 cursor-pointer group flex-row-reverse">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-dark-600 bg-dark-900 accent-gold-400"
                                                    checked={selectedStraps.includes(s.id)}
                                                    onChange={() => toggleStrap(s.id)}
                                                />
                                                <span className="text-gray-400 group-hover:text-gold-400 transition flex-1 text-right">{s.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </aside>

                    {/* Product Grid Area */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-8 flex-row-reverse">
                            <div className="flex items-center gap-3">
                                <p className="text-gray-500 text-sm font-bold ltr">{filteredProducts.length} Products Found</p>
                                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                <span className="text-gold-400 text-xs font-bold">فرز حسب الأحدث</span>
                            </div>
                            <button onClick={() => setFilterOpen(!filterOpen)} className="lg:hidden flex items-center gap-2 text-gold-400 bg-dark-800 border border-dark-700 px-5 py-3 rounded-2xl">
                                <SlidersHorizontal className="w-4 h-4" /> تصفية
                            </button>
                        </div>

                        {/* Horizontal Category Scroll (Mobile) */}
                        <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto pb-4 pt-1 flex flex-row-reverse gap-3 no-scrollbar scroll-smooth">
                            {[
                                { id: 'all', label: 'الكل', icon: '🛍️' },
                                { id: 'perfumes', label: 'العطور', icon: '🌸' },
                                { id: 'watches', label: 'الساعات', icon: '⌚' },
                                { id: 'glasses', label: 'النظارات', icon: '👓' }
                            ].map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        if (cat.id === 'all') {
                                            setSelectedCat([]);
                                        } else {
                                            // Toggle behavior or single select? 
                                            // User pattern suggests we might want single select for this bar or toggle.
                                            // Let's stick to the existing toggleCat logic but adapted for this UI.
                                            // Logic: If 'all', clear cats. If specific, set it (or toggle if supporting multi).
                                            // For simplicity and mobile UX, usually a horizontal bar implies single selection or "focus".
                                            // However, `selectedCat` is an array.
                                            // Let's implement: Click 'all' -> clear. Click others -> toggle.
                                            if (selectedCat.includes(cat.id)) {
                                                toggleCat(cat.id);
                                            } else {
                                                // If we want this bar to act as "Quick Filter", maybe exclusive? 
                                                // The user requests "categories bar". Let's use the toggleCat.
                                                toggleCat(cat.id);
                                            }
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all shadow-lg ${(cat.id === 'all' && selectedCat.length === 0) || (cat.id !== 'all' && selectedCat.includes(cat.id))
                                        ? 'bg-gold-400 text-dark-900 scale-105 border-transparent'
                                        : 'bg-dark-800 text-gray-400 border border-dark-700 hover:border-gold-400/50'
                                        } border`}
                                >
                                    <span className="text-xl">{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-24 bg-dark-800/50 rounded-[40px] border border-dashed border-dark-700">
                                <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400">لم نجد أي منتجات تطابق بحثك</h3>
                                <button onClick={() => { setSelectedCat([]); setSelectedSource([]); setPriceRange(1000000); setSearchQuery(''); }} className="mt-4 text-gold-400 font-bold hover:underline">إعادة ضبط التصفية</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8">
                                {filteredProducts.map((product) => {
                                    const isOutOfStock = product.source === 'local' && product.quantity <= 0;

                                    return (
                                        <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col bg-dark-800 rounded-2xl md:rounded-[32px] overflow-hidden border border-dark-700 hover:border-gold-400/50 transition-all duration-500 relative hover:shadow-2xl hover:shadow-gold-500/5">

                                            {/* Luxury Labels */}
                                            <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 flex flex-col gap-1.5 md:gap-2 pointer-events-none">
                                                {product.source === 'local' ? (
                                                    isOutOfStock ? (
                                                        <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-wider">Sold Out</span>
                                                    ) : (
                                                        <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-wider">In Stock</span>
                                                    )
                                                ) : (
                                                    <span className="bg-gold-500 text-dark-900 border border-gold-400 text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-wider shadow-lg shadow-gold-500/20">Dubai VIP</span>
                                                )}
                                                {(product.category === 'glasses' || product.category === 'watches') && product.hasFullSet && (
                                                    <span className="bg-dark-900/80 backdrop-blur text-gold-400 border border-gold-400/50 text-[7px] md:text-[8px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg flex items-center gap-1 shadow-lg">
                                                        <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                        Full Set
                                                    </span>
                                                )}
                                            </div>

                                            <div className="aspect-[4/5] bg-dark-900 relative overflow-hidden">
                                                <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} />
                                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark-900/80 to-transparent"></div>
                                            </div>

                                            <div className="p-3 md:p-6 text-right relative">
                                                <h3 className={`text-sm md:text-lg font-bold mb-1 transition-colors group-hover:text-gold-400 truncate ${isOutOfStock ? 'text-gray-500' : 'text-white'}`}>{product.name}</h3>
                                                <div className="flex items-center gap-1 justify-end mb-2 md:mb-3">
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 md:w-2.5 md:h-2.5 text-gold-400 fill-current" />)}
                                                    </div>
                                                </div>
                                                <p className={`text-base md:text-2xl font-black ${isOutOfStock ? 'text-gray-600' : 'text-gold-400'}`}>
                                                    <span className="text-[10px] md:text-xs font-normal ml-1">UM</span>
                                                    {product.price.toLocaleString()}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

