'use client';

import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import DubaiService from "@/components/DubaiService";
import Footer from "@/components/Footer";
import { ShoppingCart, ShoppingBag, ChevronLeft, Star, Clock, Plane, Search, Filter, Sparkles, ArrowRight, Watch, Glasses, SprayCan } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';

// Mock Data for Categories (Static)
const CATEGORIES = [
  { id: 'perfumes', name: 'عطور فاخرة', icon: SprayCan, color: 'text-gold-400', bg: 'bg-gold-400/10' },
  { id: 'watches', name: 'ساعات قيمة', icon: Watch, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { id: 'glasses', name: 'نظارات فاخرة', icon: Glasses, color: 'text-blue-400', bg: 'bg-blue-400/10' },
];

export default function Home() {
  const { addToCart } = useCart();
  const { products } = useProducts();

  // Filter products for sections
  const perfumeProducts = products
    .filter(p => p.category === 'perfumes')
    .slice(0, 4);

  // Last 4 added local products (excluding perfumes already shown)
  const localProducts = products
    .filter(p => p.source === 'local' && p.category !== 'perfumes')
    .slice(0, 4);

  // Last 2 added dubai products
  const dubaiProducts = products
    .filter(p => p.source === 'dubai')
    .slice(0, 2);

  const handleAddToCart = (product: any) => {
    // Check stock for local products
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
    <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
      <Navbar />
      <Toaster position="bottom-left" richColors />

      <Hero />
      <BestSellers />

      {/* 3. Categories Circles */}
      <section className="py-20 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gold-400/5 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex justify-center flex-wrap gap-10 md:gap-24">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Link href={cat.id === 'glasses' ? '/shop/glasses' : cat.id === 'watches' ? '/shop/watches' : cat.id === 'perfumes' ? '/shop/perfumes' : `/shop?cat=${cat.id}`} className="group flex flex-col items-center gap-4">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] ${cat.bg} border border-white/5 group-hover:border-gold-400 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] flex items-center justify-center transition-all duration-500 transform group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <cat.icon className={`w-10 h-10 md:w-14 md:h-14 ${cat.color} group-hover:text-gold-400 transition-colors`} />
                  </div>
                  <span className="text-sm md:text-lg font-black text-gray-500 group-hover:text-gold-400 transition tracking-widest uppercase">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 0. Perfumes Focus Section - NEW */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-gold-400/[0.02] rounded-[4rem] -z-10 border border-gold-400/5"></div>
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <SprayCan className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-extrabold tracking-[0.3em] text-[10px] uppercase">Elite Fragrance Collection</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white">عالم <span className="text-gold-gradient">العطور</span> الفاخرة ✨</h2>
            <p className="text-gray-500 mt-4 max-w-xl font-medium">استكشف المجموعة الأكثر مبيعاً، الآن مع فيديوهات تدشين (Unboxing) حصرية توضح فخامة التغليف والزجاجات.</p>
          </motion.div>
          <Link href="/shop/perfumes" className="flex items-center gap-2 bg-gold-gradient text-dark-900 px-8 py-4 rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-gold-400/10">
            تصفح كل العطور <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {perfumeProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-dark-800 rounded-[2rem] overflow-hidden border-2 border-gold-400/10 hover:border-gold-400/50 transition-all duration-700 relative"
            >
              {/* Image/Video Area */}
              <div className="aspect-[4/5] relative bg-dark-900 overflow-hidden">
                {product.videoUrl ? (
                  <video
                    src={product.videoUrl}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>

                {/* Video Badge if exists */}
                {product.videoUrl && (
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-gold-500 text-dark-900 text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" />
                      UNBOXING VIDEO
                    </span>
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-6">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold text-white mb-2 text-lg truncate group-hover:text-gold-400 transition">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gold-400 font-black text-xl">{product.price.toLocaleString()} <span className="text-[10px] font-normal">UM</span></p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-white/5 hover:bg-gold-gradient hover:text-dark-900 text-gold-400 rounded-xl transition-all flex items-center justify-center active:scale-90"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 1. Local Stock Section - New Arrivals */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-green-500 font-extrabold tracking-[0.3em] text-[10px] uppercase">Nouakchott In-Stock</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">تسليم فوري <span className="text-gold-gradient">بلمح البصر</span> ⚡</h2>
          </motion.div>
          <Link href="/shop?source=local" className="hidden md:flex items-center gap-2 bg-dark-800 border border-white/5 px-6 py-3 rounded-2xl text-gold-400 font-bold hover:bg-gold-400 hover:text-dark-900 transition-all active:scale-95">
            عرض الكل <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {localProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-dark-800 rounded-[2rem] overflow-hidden border border-white/5 hover:border-gold-400/50 transition-all duration-700 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative"
            >
              {/* Image Area */}
              <div className="aspect-[4/5] relative bg-dark-900 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>

                {/* Tag */}
                <div className="absolute top-4 right-4">
                  <span className="glass-gold text-gold-400 text-[9px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-2 border border-gold-400/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
                    جاهز للمعاينة
                  </span>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{product.brand || 'Luxury Item'}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-2 h-2 text-gold-400 fill-current" />)}
                  </div>
                </div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold text-white mb-2 text-lg truncate group-hover:text-gold-400 transition">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between mt-4 gap-2">
                  <p className="text-gold-400 font-black text-xl whitespace-nowrap">{product.price.toLocaleString()} <span className="text-[10px] font-normal">UM</span></p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 bg-white/5 hover:bg-gold-gradient hover:text-dark-900 text-gold-400 rounded-xl transition-all flex items-center justify-center active:scale-90 border border-white/5"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {localProducts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-dark-800/50 rounded-[3rem] border border-dashed border-white/10">
              <p className="text-gray-500 font-bold italic">التشكيلة الجديدة قيد التصوير.. ترقبونا قريباً ✨</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Dubai Exclusive Section */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-800/50 backdrop-blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold-500/5 blur-[150px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-right">
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-gold-400 font-black tracking-[0.4em] text-xs uppercase mb-4 block flex items-center justify-center md:justify-end gap-3"
              >
                <Plane className="w-5 h-5" />
                Dubai Exclusive VIP
              </motion.span>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                روائع <span className="text-gold-gradient">استثنائية</span> من دبي
              </h2>
              <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                ندرك أن ذوقك يتجاوز المألوف، لذلك وفرنا لك خدمة التسوق في أفخم مولات دبي وأسواقها العالمية لتصلك القطعة التي لطالما حلمت بها.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              <Link href="/shop?source=dubai" className="bg-dark-900 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:border-gold-400 transition-all active:scale-95">
                تصفح المجموعة
              </Link>
              <Link href="/dubai-request" className="bg-gold-gradient text-dark-900 px-8 py-4 rounded-2xl font-black hover:opacity-90 transition-all shadow-2xl shadow-gold-500/20 flex items-center gap-2 active:scale-95">
                <Sparkles className="w-5 h-5" />
                اطلب قطعتك الخاصة
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {dubaiProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="relative group rounded-[3rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] border border-white/5 hover:border-gold-500/50 transition-all duration-700 shadow-2xl"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-30 antialiased"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/40 to-transparent p-10 md:p-14 flex flex-col justify-center items-start">

                  <div className="bg-gold-gradient text-dark-900 text-[10px] font-black px-4 py-1.5 rounded-full inline-block mb-6 shadow-xl uppercase tracking-widest">
                    Dubai Special Import 🇦🇪
                  </div>

                  <h3 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">{product.name}</h3>
                  <p className="text-gray-300 mb-8 text-sm md:text-lg max-w-md line-clamp-2 leading-relaxed">{product.description}</p>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3 text-gold-400">
                      <Clock className="w-6 h-6" />
                      <span className="font-black text-sm uppercase tracking-widest">Exp. {product.shippingDuration || '7 Days'}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="bg-white text-dark-900 px-10 py-3 rounded-2xl font-black hover:bg-gold-gradient transition-all transform hover:-translate-y-1 shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95">
                      تفاصيل الطلب
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            {dubaiProducts.length === 0 && (
              <div className="col-span-full text-center py-20 bg-dark-800/30 rounded-[3rem] border border-dashed border-white/5">
                <p className="text-gray-600 font-bold italic">جاري التنسيق مع شركائنا في دبي لجلب أفضل العروض.. ✈️</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <DubaiService />

      <Footer />
    </main>

  );
}
