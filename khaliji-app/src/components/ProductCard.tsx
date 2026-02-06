'use client';

import { Star, ShoppingBag, ShieldCheck, Percent } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { Product } from '@/context/ProductContext';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { settings } = useSettings();

    const handleAddToCart = (e: React.MouseEvent) => {
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

        // Premium feedback
        toast.success(`تمت إضافة ${product.name} إلى سلتك ✨`, {
            description: 'يمكنك إتمام الطلب الآن من أيقونة السلة العائمة.',
            duration: 3000,
        });
    };

    const isOutOfStock = product.source === 'local' && product.quantity <= 0;

    return (
        <Link href={`/products/${product.id}`} className="group relative bg-dark-800 rounded-3xl overflow-hidden border border-dark-700 hover:border-gold-400/50 transition-all duration-500 hover:shadow-2xl flex flex-col h-full">
            {/* Badges */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {settings.isSalesMode && (
                    <span className="bg-red-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1 animate-bounce">
                        <Percent className="w-3 h-3" /> خصم حصري
                    </span>
                )}
                {product.source === 'dubai' && (
                    <span className="bg-gold-500 text-dark-900 text-[8px] font-black px-2 py-1 rounded-md shadow-lg">DUBAI VIP</span>
                )}
                {product.hasFullSet && (
                    <span className="bg-dark-900/80 backdrop-blur text-gold-400 border border-gold-400/50 text-[8px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Full Set
                    </span>
                )}
            </div>

            <div className="aspect-square bg-dark-900 overflow-hidden relative flex-shrink-0">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="p-5 text-right relative flex flex-col flex-1">
                <h3 className="font-bold text-white mb-1 truncate group-hover:text-gold-400 transition">{product.name}</h3>
                <div className="flex items-center gap-1 justify-end mb-2">
                    <Star className="w-3 h-3 text-gold-400 fill-current" />
                    <span className="text-[10px] text-gray-500">{product.brand || 'ماركة عالمية'}</span>
                </div>
                <p className="text-gold-400 font-black text-xl mb-4 mt-auto">{product.price.toLocaleString()} UM</p>

                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`w-full font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-xs ${isOutOfStock
                        ? 'bg-dark-700/50 text-gray-500 cursor-not-allowed'
                        : 'bg-dark-700 hover:bg-gold-400 hover:text-dark-900 text-white'
                        }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    {isOutOfStock ? 'نفد المخزون' : 'أضف للسلة'}
                </button>
            </div>
        </Link>
    );
}
