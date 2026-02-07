'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trash2, CreditCard, ArrowRight, MessageCircle, ShoppingBag, Plus, Minus, ShieldCheck, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

export default function CartPage() {
    const router = useRouter();
    const { items, removeFromCart, updateQuantity, total } = useCart();
    const shipping = 0; // Free shipping
    const finalTotal = items.length > 0 ? total + shipping : 0;

    // YOUR WHATSAPP NUMBER HERE
    const PHONE_NUMBER = "41069964";

    const handleWhatsAppCheckout = () => {
        let message = `*طلب جديد من متجر أناقة الخليج*%0a`;
        message += `---------------------------%0a`;

        items.forEach(item => {
            message += `▫️ ${item.name} (x${item.quantity}) - ${(item.price * item.quantity).toLocaleString()} UM%0a`;
        });

        message += `---------------------------%0a`;
        message += `💰 *الإجمالي النهائي: ${finalTotal.toLocaleString()} UM*%0a`;
        message += `---------------------------%0a`;
        message += `يرجى تأكيد الطلب وتزويدي بطريقة الدفع.`;

        const url = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    };

    const handleBankilyCheckout = () => {
        toast.info('سيتم تحويلك لتأكيد الدفع عبر بنكيلي (Bankily)', {
            description: 'يرجى إرسال لقطة شاشة للتحويل لمتابعة الطلب.'
        });
        setTimeout(() => handleWhatsAppCheckout(), 2000);
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />
            <Toaster position="top-center" richColors />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">سلة <span className="text-gold-gradient">المشتريات</span></h1>
                        <p className="text-gray-500 font-bold">لديك {items.length} منتجات في السلة</p>
                    </div>
                    <Link href="/shop" className="hidden md:flex items-center gap-2 text-gold-400 hover:underline font-bold">
                        <ArrowRight className="w-4 h-4" /> واصل التسوق
                    </Link>
                </div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 bg-dark-800 rounded-[3rem] border-2 border-dashed border-dark-700 max-w-2xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-dark-700/50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-600">
                            <ShoppingBag className="w-12 h-12" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">سلتك لا تزال فارغة</h3>
                        <p className="text-gray-500 mb-10 max-w-sm mx-auto">استكشف عالم الأناقة الفاخرة وأضف لمستك الخاصة اليوم.</p>
                        <Link href="/shop" className="bg-gold-gradient text-dark-900 font-black px-12 py-4 rounded-2xl shadow-xl shadow-gold-500/20 hover:scale-105 transition-all inline-block">
                            ابدأ التسوق الآن
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Cart Items List */}
                        <div className="flex-1 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group relative bg-dark-800 rounded-[2.5rem] p-6 border border-dark-700 hover:border-gold-400/30 transition-all flex flex-col md:flex-row items-center gap-8 shadow-xl"
                                    >
                                        <div className="w-32 h-32 md:w-40 md:h-40 bg-dark-900 rounded-[2rem] overflow-hidden flex-shrink-0 border border-white/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>

                                        <div className="flex-1 text-center md:text-right">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                                    <span className="text-xs bg-dark-700 text-gray-400 px-3 py-1 rounded-full">{item.source === 'local' ? 'متوفر حالياً' : 'طلب خاص من دبي'}</span>
                                                </div>
                                                <p className="text-2xl font-black text-gold-400">{item.price.toLocaleString()} <span className="text-xs font-normal">UM</span></p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                                <div className="flex items-center bg-dark-900 rounded-2xl border border-dark-700 p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gold-400 transition"
                                                    ><Minus className="w-4 h-4" /></button>
                                                    <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gold-400 transition"
                                                    ><Plus className="w-4 h-4" /></button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-2 text-red-500/70 hover:text-red-500 font-bold transition text-sm"
                                                >
                                                    <Trash2 className="w-4 h-4" /> إزالة من السلة
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Checkout */}
                        <div className="lg:w-[400px]">
                            <div className="bg-dark-800 rounded-[3rem] p-8 border-2 border-gold-400/20 shadow-2xl sticky top-32">
                                <h3 className="text-2xl font-black text-white mb-8 border-b border-dark-700 pb-4">تفاصيل الفاتورة</h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span className="font-bold">مجموع المنتجات</span>
                                        <span className="font-medium ltr">{total.toLocaleString()} UM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-gray-400">
                                        <span className="font-bold">تكلفة الشحن</span>
                                        <span className="text-green-500 font-black uppercase text-xs tracking-widest">شحن مجاني ✨</span>
                                    </div>

                                    <div className="pt-6 border-t border-dark-700">
                                        <div className="flex justify-between items-end">
                                            <span className="text-white font-black text-xl mb-1">الإجمالي النهائي</span>
                                            <div className="text-left">
                                                <p className="text-4xl font-black text-gold-gradient ltr">{finalTotal.toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-500 font-bold text-center">أوقية موريتانية</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => router.push('/checkout')}
                                        className="w-full bg-gold-gradient hover:bg-gold-600 text-dark-900 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-gold-500/20 text-lg"
                                    >
                                        <ArrowRight className="w-6 h-6" />
                                        متابعة لإتمام الطلب
                                    </button>

                                    <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold">
                                        <ShieldCheck className="w-4 h-4 text-gold-400" />
                                        تسوق آمن ومضمون 100%
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
