'use client';

import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { Flame, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function BestSellers() {
    const { products } = useProducts();
    const { addToCart } = useCart();

    // Logic: Filter best sellers or highest sales count, limited to 4
    const bestSellers = products
        .filter(p => p.isBestSeller)
        .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
        .slice(0, 4);

    if (bestSellers.length === 0) return null;

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.source === 'local' && product.quantity <= 0) {
            toast.error('عذراً، هذا المنتج نفد من المخزن حالياً');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            source: product.source
        });
        toast.success('تمت الإضافة للسلة');
    };

    return (
        <section className="py-16 bg-dark-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gold-gradient rounded-2xl flex items-center justify-center text-dark-900 shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-110">
                            <Flame className="w-8 h-8 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black text-white flex items-center gap-2">
                                الأكثر طلباً <span className="text-gold-gradient">في موريتانيا</span>
                            </h2>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Nouakchott Trending Selection</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {bestSellers.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <Link href={`/products/${product.id}`} className="block h-full">
                                {/* Premium Card with Golden Border */}
                                <div className="h-full relative bg-dark-800 rounded-[2.5rem] overflow-hidden border border-white/5 group-hover:border-gold-400 group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] transition-all duration-700 relative">

                                    {/* Best Seller Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="glass-gold text-gold-400 text-[8px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xl border border-gold-400/20">
                                            <TrendingUp className="w-3 h-3" />
                                            VIP CHOICE
                                        </div>
                                    </div>

                                    {/* Image Area */}
                                    <div className="aspect-[4/5] overflow-hidden relative">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 relative">
                                        <div className="flex gap-0.5 mb-3">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 text-gold-400 fill-current" />)}
                                        </div>

                                        <h3 className="font-bold text-white mb-2 text-lg truncate group-hover:text-gold-400 transition">{product.name}</h3>
                                        <p className="text-gold-gradient font-black text-2xl mb-5">{product.price.toLocaleString()} <span className="text-[10px] font-normal text-gray-500">UM</span></p>

                                        {/* Dynamic Status Text */}
                                        <div className="mb-6 flex items-center gap-2">
                                            {product.quantity < 3 && product.quantity > 0 ? (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                                    <span className="text-red-400 text-[10px] font-black uppercase tracking-widest">
                                                        Limited Stock
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">
                                                        Immediate Delivery
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            className="w-full bg-gold-gradient hover:opacity-90 text-dark-900 font-black py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-xl active:scale-95"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            أضف للسلة الآن
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
