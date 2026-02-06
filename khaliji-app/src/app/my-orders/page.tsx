'use client';

import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { useDubaiRequests } from '@/context/DubaiRequestContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, Plane, MessageCircle, ShoppingCart, Key } from 'lucide-react';
import Link from 'next/link';

export default function MyOrdersPage() {
    const { user } = useAuth();
    const { orders } = useOrders();
    const { requests } = useDubaiRequests();

    if (!user) {
        return (
            <main className="min-h-screen bg-dark-900 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-20">
                    <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">يجب تسجيل الدخول أولاً</h1>
                    <p className="text-gray-400 mb-8 max-w-sm">قم بإجراء أول طلب لك ليتم إنشاء حسابك تلقائياً برقم هاتفك.</p>
                    <Link href="/shop" className="bg-gold-500 text-dark-900 px-8 py-3 rounded-xl font-bold hover:bg-gold-400 transition">
                        تصفح المنتجات
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Privacy Filter: Only see my own orders based on userId
    const myOrders = orders.filter(o => o.userId === user.id);
    const myDubaiRequests = requests.filter(r => r.userId === user.id);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'قيد الانتظار';
            case 'contacted': return 'تم التواصل';
            case 'shipped': return 'جاري التوصيل';
            case 'delivered': return 'تم التسليم';
            default: return status;
        }
    };

    const getDubaiStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'بانتظار التسعيرة 🔵';
            case 'quoted': return 'تم إرسال السعر 🟠';
            case 'purchased': return 'تم الشراء من دبي 🟣';
            case 'arrived': return 'وصل نواكشوط 🟢';
            default: return status;
        }
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-32 text-right">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">طلباتي</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <span>مرحباً {user.name}، نتابع طلباتك بكل اهتمام.</span>
                            <div className="bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                                <Key className="w-2.5 h-2.5" />
                                {user.id}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-dark-800 px-6 py-3 rounded-2xl border border-dark-700 flex items-center gap-3">
                            <ShoppingBag className="w-5 h-5 text-gold-400" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black text-right">طلبات المتجر</p>
                                <p className="text-lg font-black text-white">{myOrders.length}</p>
                            </div>
                        </div>
                        <div className="bg-dark-800 px-6 py-3 rounded-2xl border border-dark-700 flex items-center gap-3">
                            <Plane className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black text-right">طلبات دبي</p>
                                <p className="text-lg font-black text-white">{myDubaiRequests.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Store Orders Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 justify-end">
                            مششترياتك من المتجر
                            <ShoppingCart className="w-5 h-5 text-gold-400" />
                        </h2>
                        <div className="grid gap-6">
                            {myOrders.length === 0 ? (
                                <div className="bg-dark-800/50 p-12 rounded-3xl border border-dashed border-dark-700 text-center opacity-50">
                                    لا توجد طلبات متجر حالياً.
                                </div>
                            ) : (
                                myOrders.map((order) => (
                                    <div key={order.id} className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden hover:border-dark-600 transition group shadow-xl">
                                        <div className="px-8 py-4 bg-dark-900/50 border-b border-dark-700 flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-xs font-mono text-gold-400 font-bold">#{order.id}</span>
                                                <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-MR')}</span>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 shadow-sm ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="p-8">
                                            <div className="flex flex-row-reverse flex-wrap gap-4 mb-6">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="w-16 h-16 rounded-xl bg-dark-900 border border-dark-700 p-1 relative hover:scale-105 transition">
                                                        <img src={item.image} className="w-full h-full object-cover rounded-lg" />
                                                        <span className="absolute -top-2 -right-2 bg-gold-400 text-dark-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border border-dark-900">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-row-reverse justify-between items-end border-t border-dark-700/50 pt-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">الإجمالي المدفوع</p>
                                                    <p className="text-2xl font-black text-white">{order.total.toLocaleString()} UM</p>
                                                </div>
                                                <button className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-2 rounded-xl text-xs font-bold transition">
                                                    عرض الفاتورة
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Dubai Requests Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 justify-end">
                            طلبات دبي الخاصة (VIP)
                            <Plane className="w-5 h-5 text-blue-400" />
                        </h2>
                        <div className="grid gap-6">
                            {myDubaiRequests.length === 0 ? (
                                <div className="bg-dark-800/50 p-12 rounded-3xl border border-dashed border-dark-700 text-center opacity-50">
                                    لم تقم بإرسال طلبات خاصة من دبي بعد.
                                </div>
                            ) : (
                                myDubaiRequests.map((req) => (
                                    <div key={req.id} className="bg-dark-800 rounded-3xl border border-dark-700 p-6 flex flex-col sm:flex-row-reverse gap-6 hover:bg-dark-700/20 transition">
                                        <div className="w-full sm:w-32 aspect-square rounded-2xl overflow-hidden bg-dark-900 border border-dark-600 flex-shrink-0">
                                            <img src={req.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="flex flex-row-reverse justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white">{req.productName}</h3>
                                                <span className="text-[10px] font-mono text-gray-500 font-bold">#{req.id}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 italic">"{req.productDescription || "طلب خاص"}"</p>

                                            <div className="flex flex-row-reverse flex-wrap items-center gap-4 mb-6">
                                                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20 flex items-center gap-2">
                                                    الحالة: {getDubaiStatusLabel(req.status)}
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                                                </div>
                                                {req.price && (
                                                    <div className="px-3 py-1.5 rounded-full bg-gold-400/10 text-gold-400 text-[10px] font-black border border-gold-400/20">
                                                        السعر المعروض: {(req.price + (req.shippingCost || 0)).toLocaleString()} UM
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row-reverse gap-3">
                                                <a
                                                    href={`https://wa.me/22241069964?text=Arid taakid talabi # ${req.id}`}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                                                >
                                                    متابعة عبر واتساب
                                                    <MessageCircle className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
