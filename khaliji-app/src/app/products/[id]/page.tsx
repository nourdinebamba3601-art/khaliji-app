'use client';

import { useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, Truck, ShieldCheck, RefreshCw, AlertTriangle, Play, Maximize2, Volume2, VolumeX, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { toast, Toaster } from 'sonner';

export default function ProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const { products } = useProducts();
    const productId = parseInt(params.id);
    const product = products.find(p => p.id === productId);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isVideoActive, setIsVideoActive] = useState(!!product?.videoUrl);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const { addToCart } = useCart();

    if (!product) {
        return (
            <main className="min-h-screen bg-dark-900 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <AlertTriangle className="w-16 h-16 text-gold-400 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
                    <p className="text-gray-400 mb-6">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
                    <a href="/shop" className="bg-gold-500 text-dark-900 font-bold px-6 py-3 rounded-lg hover:bg-gold-600 transition">
                        العودة للمتجر
                    </a>
                </div>
                <Footer />
            </main>
        );
    }

    const isLocal = product.source === 'local';
    const isOutOfStock = isLocal && (product.quantity <= 0);

    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.error('عذراً، هذا المنتج نفد من المخزن حالياً');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: quantity,
            source: product.source
        });
        toast.success(`تمت إضافة ${product.name} بنجاح ✨`, {
            description: 'جاهز لإتمام الطلب؟ السلة بانتظارك.',
            duration: 4000
        });
    };

    // Swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && selectedImage < product.images.length - 1) {
            setSelectedImage(selectedImage + 1);
        }
        if (isRightSwipe && selectedImage > 0) {
            setSelectedImage(selectedImage - 1);
        }
    };

    const nextImage = () => {
        if (selectedImage < product.images.length - 1) {
            setSelectedImage(selectedImage + 1);
        }
    };

    const prevImage = () => {
        if (selectedImage > 0) {
            setSelectedImage(selectedImage - 1);
        }
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <Toaster position="top-center" richColors />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16">

                    {/* Image/Video Gallery */}
                    <div className="mb-12 lg:mb-0">
                        <div
                            className="aspect-square rounded-2xl overflow-hidden bg-dark-800 border-2 border-gold-400/30 mb-4 relative group/mainimg shadow-[0_0_50px_rgba(212,175,55,0.1)] cursor-pointer"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => !isVideoActive && setIsZoomOpen(true)}
                        >
                            {isVideoActive && product.videoUrl ? (
                                <div className="w-full h-full relative">
                                    <video
                                        src={product.videoUrl}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onClick={() => setIsFullscreen(true)}
                                    />
                                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                                        <button
                                            onClick={() => setIsFullscreen(true)}
                                            className="p-2 bg-dark-900/50 backdrop-blur rounded-lg text-white hover:text-gold-400 transition"
                                        >
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 right-4 z-10">
                                        <span className="bg-gold-500 text-dark-900 text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-2 shadow-xl animate-pulse">
                                            <Play className="w-3 h-3 fill-current" />
                                            EXCLUSIVE UNBOXING
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <motion.img
                                        key={selectedImage}
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />

                                    {/* Navigation Arrows */}
                                    {product.images.length > 1 && (
                                        <>
                                            {selectedImage > 0 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-dark-900/80 backdrop-blur rounded-full text-white hover:bg-gold-400 hover:text-dark-900 transition-all opacity-0 group-hover/mainimg:opacity-100 z-10"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                            )}
                                            {selectedImage < product.images.length - 1 && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-dark-900/80 backdrop-blur rounded-full text-white hover:bg-gold-400 hover:text-dark-900 transition-all opacity-0 group-hover/mainimg:opacity-100 z-10"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Zoom Hint */}
                                    <div className="absolute bottom-4 left-4 bg-dark-900/80 backdrop-blur px-3 py-2 rounded-lg text-xs font-bold text-gold-400 flex items-center gap-2 opacity-0 group-hover/mainimg:opacity-100 transition-all">
                                        <Maximize2 className="w-4 h-4" />
                                        اضغط للتكبير
                                    </div>
                                </>
                            )}

                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-xl rotate-12 shadow-2xl border-2 border-white">نفد من المخزن</span>
                                </div>
                            )}
                            <button className="absolute top-4 right-4 p-3 rounded-full bg-dark-900/50 backdrop-blur text-white hover:text-red-500 transition z-10">
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-5 gap-4">
                            {product.videoUrl && (
                                <button
                                    onClick={() => setIsVideoActive(true)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition relative group ${isVideoActive ? 'border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <video src={product.videoUrl} className="w-full h-full object-cover grayscale brightness-50" muted preload="metadata" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-gold-400 drop-shadow-lg group-hover:scale-110 transition" />
                                    </div>
                                </button>
                            )}
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setSelectedImage(idx); setIsVideoActive(false); }}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition ${!isVideoActive && selectedImage === idx ? 'border-gold-400' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-gold-400 font-bold tracking-wider text-sm uppercase">
                                    {isLocal ? 'وصل حديثاً' : 'طلب خاص'}
                                </span>
                                {isLocal ? (
                                    isOutOfStock ? (
                                        <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            غير متوفر حالياً - نفدت الكمية
                                        </span>
                                    ) : (
                                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                            متوفر في نواكشوط - تسليم فوري
                                        </span>
                                    )
                                ) : (
                                    <span className="bg-gold-400/20 text-gold-400 border border-gold-400/30 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                                        طلب من دبي - يصل خلال {product.shippingDuration || '7 أيام'}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl font-extrabold text-white mt-2 mb-4">{product.name}</h1>
                            {product.nameEn && <h2 className="text-xl text-gray-500 font-medium mb-4">{product.nameEn}</h2>}

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex text-gold-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span className="text-gray-400">منتج أصلي مضمون</span>
                            </div>
                        </div>

                        <div className="mb-8 flex items-baseline gap-4">
                            <p className="text-3xl font-bold text-gold-gradient">{product.price.toLocaleString()} UM</p>
                            {product.originalPrice && (
                                <p className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()} UM</p>
                            )}
                        </div>

                        <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                            {product.description}
                        </p>

                        {/* Glasses Specifications */}
                        {product.category === 'glasses' && (
                            <div className="mb-8 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">النوع</span>
                                        <span className="text-white font-bold">{product.gender === 'men' ? 'رجالي' : product.gender === 'women' ? 'نسائي' : 'للجنسين'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">نوع العدسة</span>
                                        <span className="text-white font-bold">{product.lensType === 'sun' ? 'شمسية' : 'طبية'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">مادة الإطار</span>
                                        <span className="text-white font-bold">{product.frameMaterial === 'metal' ? 'معدن' : 'بلاستيك / أسيتات'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">شكل الإطار</span>
                                        <span className="text-white font-bold uppercase">{product.frameShape}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Watch Specifications */}
                        {product.category === 'watches' && (
                            <div className="mb-8 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">الفئة</span>
                                        <span className="text-white font-bold">{product.gender === 'men' ? 'رجالي' : product.gender === 'women' ? 'نسائي' : 'للجنسين'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">نوع الماكينة</span>
                                        <span className="text-white font-bold">{product.watchMovement === 'automatic' ? 'أوتوماتيك' : 'كوارتز'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">نوع السوار</span>
                                        <span className="text-white font-bold">{product.strapMaterial === 'metal' ? 'معدن' : product.strapMaterial === 'leather' ? 'جلد' : product.strapMaterial === 'rubber' ? 'ربر' : 'أخرى'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">مادة الهيكل</span>
                                        <span className="text-white font-bold font-xs">{product.caseMaterial}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Perfume Specifications */}
                        {product.category === 'perfumes' && (
                            <div className="mb-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">الجنس</span>
                                        <span className="text-white font-bold">{product.gender === 'men' ? 'رجالي' : product.gender === 'women' ? 'نسائي' : 'للجنسين'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">الحجم</span>
                                        <span className="text-white font-bold">{product.perfumeVolume || '100ml'}</span>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">درجة الثبات</span>
                                        <span className="text-white font-bold text-gold-400">
                                            {product.perfumeLongevity === 'high' ? '⭐ عالي جداً' : product.perfumeLongevity === 'medium' ? 'جيد جداً' : 'متوسط'}
                                        </span>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">مكونات العطر</span>
                                        <span className="text-white font-bold truncate max-w-[100px]">{product.perfumeScent || 'خلطة سرية'}</span>
                                    </div>
                                </div>
                                {product.perfumeScent && (
                                    <div className="bg-gold-500/5 border border-gold-400/20 p-4 rounded-2xl flex flex-col gap-2">
                                        <p className="text-gold-400 text-xs font-black uppercase tracking-widest">Fragrance Profile</p>
                                        <p className="text-gray-300 italic">"{product.perfumeScent}"</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Full Set Badge */}
                        {(product.category === 'glasses' || product.category === 'watches') && product.hasFullSet && (
                            <div className="mb-8 bg-gold-500/10 border border-gold-500/30 p-4 rounded-xl flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-dark-900">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-gold-400 font-bold">Full Set - طقم كامل</p>
                                    <p className="text-xs text-gray-400">يشمل العلبة الأصلية، الملحقات والضمان ✅</p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 mb-8">
                            {!isOutOfStock && (
                                <div className="flex items-center bg-dark-800 rounded-lg border border-dark-700">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 hover:text-gold-400 font-bold text-xl"
                                    >-</button>
                                    <span className="px-4 font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-3 hover:text-gold-400 font-bold text-xl"
                                    >+</button>
                                </div>
                            )}
                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isOutOfStock
                                    ? 'bg-dark-700 text-gray-500 cursor-not-allowed border border-dark-600'
                                    : 'bg-gold-400 hover:bg-gold-500 text-dark-900 shadow-lg shadow-gold-400/20'}`}
                            >
                                {isOutOfStock ? (
                                    <>ليس متوفراً الآن</>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        إضافة للسلة
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 border-t border-dark-700 pt-6">
                            <div className="text-center">
                                <Truck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                                <span className="text-xs text-gray-400">{isLocal ? 'شحن فوري محلي' : 'شحن جوي سريع'}</span>
                            </div>
                            <div className="text-center">
                                <ShieldCheck className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                                <span className="text-xs text-gray-400">ضمان الأصالة</span>
                            </div>
                            <div className="text-center">
                                <RefreshCw className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                                <span className="text-xs text-gray-400">خدمة ما بعد البيع</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* Image Zoom Modal */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-dark-900/98 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        <button
                            onClick={() => setIsZoomOpen(false)}
                            className="absolute top-8 right-8 text-white hover:text-gold-400 p-3 bg-dark-800/80 backdrop-blur rounded-full transition-all hover:scale-110 z-50"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative w-full max-w-6xl h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                            {/* Main Zoomed Image */}
                            <motion.img
                                key={selectedImage}
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            />

                            {/* Navigation Arrows */}
                            {product.images.length > 1 && (
                                <>
                                    {selectedImage > 0 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-dark-800/90 backdrop-blur rounded-full text-white hover:bg-gold-400 hover:text-dark-900 transition-all hover:scale-110"
                                        >
                                            <ChevronLeft className="w-8 h-8" />
                                        </button>
                                    )}
                                    {selectedImage < product.images.length - 1 && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-dark-800/90 backdrop-blur rounded-full text-white hover:bg-gold-400 hover:text-dark-900 transition-all hover:scale-110"
                                        >
                                            <ChevronRight className="w-8 h-8" />
                                        </button>
                                    )}
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-dark-800/90 backdrop-blur px-6 py-3 rounded-full text-white font-bold flex items-center gap-3">
                                <ZoomIn className="w-5 h-5 text-gold-400" />
                                {selectedImage + 1} / {product.images.length}
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 bg-dark-800/80 backdrop-blur p-2 rounded-full">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setSelectedImage(idx); }}
                                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-gold-400 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fullscreen Video Overlay */}
            {isFullscreen && product.videoUrl && (
                <div className="fixed inset-0 z-[100] bg-dark-900/95 backdrop-blur-3xl flex items-center justify-center p-4">
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-8 left-8 text-white hover:text-gold-400 p-2 bg-dark-800 rounded-full transition"
                    >
                        <RefreshCw className="w-8 h-8 rotate-45" />
                    </button>
                    <div className="relative aspect-[9/16] w-full max-w-[500px] h-[90vh] rounded-[3rem] overflow-hidden border-4 border-gold-400 shadow-[0_0_100px_rgba(212,175,55,0.3)]">
                        <video src={product.videoUrl} className="w-full h-full object-cover" autoPlay loop controls playsInline />
                    </div>
                </div>
            )}
            <Footer />
        </main>
    );
}
