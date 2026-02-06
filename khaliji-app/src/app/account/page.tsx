'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useOrders, Order } from '@/context/OrderContext';
import { useDubaiRequests, DubaiRequest } from '@/context/DubaiRequestContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    User,
    ShoppingBag,
    Plane,
    Clock,
    ChevronLeft,
    MessageCircle,
    History,
    Package,
    Settings,
    LogOut,
    Camera,
    CreditCard,
    ArrowLeftRight,
    Search,
    Edit3,
    Phone
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
    const { user, logout } = useAuth();
    const { orders } = useOrders();
    const { requests } = useDubaiRequests();
    const [activeTab, setActiveTab] = useState<'current' | 'history' | 'dubai'>('current');

    if (!user) {
        return (
            <main className="min-h-screen bg-dark-900 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-6 border border-dark-700">
                        <User className="w-12 h-12 text-gray-600" />
                    </div>
                    <h1 className="text-3xl font-black mb-4">أهلاً بكم في أناقة الخليج</h1>
                    <p className="text-gray-400 mb-8 max-w-sm">قم بتسجيل أول طلب لك ليتم تفعيل حسابك الخاص تلقائياً ومتابعة شحناتك.</p>
                    <Link href="/shop" className="bg-gold-500 text-dark-900 px-10 py-4 rounded-2xl font-black hover:bg-gold-400 transition shadow-xl shadow-gold-500/20">
                        ابدأ التسوق الآن
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Filter data based on User ID
    const myOrders = orders.filter(o => o.userId === user.id);
    const myDubaiRequests = requests.filter(r => r.userId === user.id);

    // Categories
    const currentOrders = myOrders.filter(o => ['pending', 'contacted', 'shipped'].includes(o.status));
    const historyOrders = myOrders.filter(o => o.status === 'delivered');
    const activeDubai = myDubaiRequests.filter(r => ['quoted', 'purchased'].includes(r.status));
    const pendingDubai = myDubaiRequests.filter(r => r.status === 'new');
    const closedDubai = myDubaiRequests.filter(r => r.status === 'arrived');

    const getStatusStep = (status: string) => {
        switch (status) {
            case 'pending': return 1;
            case 'contacted': return 2;
            case 'shipped': return 3;
            case 'delivered': return 4;
            default: return 0;
        }
    };

    const getDubaiStatusStep = (status: string) => {
        switch (status) {
            case 'new': return 1;
            case 'quoted': return 2;
            case 'purchased': return 3;
            case 'arrived': return 4;
            default: return 0;
        }
    };

    const handleContactAdmin = (type: string, id: string) => {
        const message = `مرحباً، أود الاستفسار عن ${type === 'order' ? 'الطلب' : 'طلب دبي'} رقم: #${id}`;
        window.open(`https://wa.me/22241069964?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-400 selection:text-dark-900">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-32">

                {/* 1. Header Section: Profile Info */}
                <div className="bg-gradient-to-l from-dark-800 to-dark-900 rounded-[32px] p-8 md:p-12 border border-dark-700 shadow-2xl mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-dark-700 border-2 border-gold-400/30 flex items-center justify-center p-1 overflow-hidden">
                                <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center text-gold-400">
                                    <User className="w-16 h-16" />
                                </div>
                            </div>
                            <Link href="/profile" className="absolute -bottom-2 -left-2 bg-gold-500 p-2 rounded-xl text-dark-900 hover:scale-110 transition shadow-lg border-4 border-dark-800">
                                <Edit3 className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="text-center md:text-right flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-400 text-sm">
                                <div className="flex items-center gap-2 bg-dark-700/50 px-4 py-1.5 rounded-full border border-dark-600">
                                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                                    <span className="font-mono">{user.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gold-400/10 px-4 py-1.5 rounded-full border border-gold-400/20 text-gold-400">
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span className="font-black uppercase tracking-widest text-[10px]">VIP Member</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => logout()} className="bg-red-500/10 text-red-500 p-4 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition group">
                                <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex overflow-x-auto gap-4 mb-8 no-scrollbar p-1">
                    {[
                        { id: 'current', label: 'الطلبات النشطة', icon: ShoppingBag, count: currentOrders.length + activeDubai.length },
                        { id: 'dubai', label: 'استفسارات دبي', icon: Plane, count: pendingDubai.length },
                        { id: 'history', label: 'سجل الطلبات', icon: History, count: historyOrders.length + closedDubai.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 border h-fit ${activeTab === tab.id ? 'bg-gold-500 border-gold-400 text-dark-900 shadow-xl shadow-gold-500/20 scale-105' : 'bg-dark-800 border-dark-700 text-gray-400 hover:bg-dark-700 hover:text-white'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-dark-900 text-gold-400' : 'bg-dark-900 text-gray-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Section */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">

                        {/* 2. Current Orders Tab */}
                        {activeTab === 'current' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {(currentOrders.length === 0 && activeDubai.length === 0) ? (
                                    <div className="text-center py-20 bg-dark-800/50 rounded-[40px] border border-dashed border-dark-700">
                                        <ShoppingBag className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">لا توجد طلبات نشطة حالياً</p>
                                        <Link href="/shop" className="text-gold-400 text-sm mt-2 inline-block hover:underline">اكتشف أحدث العروض</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Store Orders */}
                                        {currentOrders.map(order => (
                                            <OrderCard key={order.id} order={order} type="local" onContact={() => handleContactAdmin('order', order.id)} />
                                        ))}
                                        {/* Dubai Active Orders (Quoted or Purchased) */}
                                        {activeDubai.map(req => (
                                            <DubaiCard key={req.id} request={req} onContact={() => handleContactAdmin('dubai', req.id)} />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* 3. Dubai Queries Tab (Pending Pricing) */}
                        {activeTab === 'dubai' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid gap-6"
                            >
                                {pendingDubai.length === 0 ? (
                                    <div className="text-center py-20 bg-dark-800/50 rounded-[40px] border border-dashed border-dark-700">
                                        <Plane className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">لم ترسل أي طلبات خاصة من دبي بعد</p>
                                        <Link href="/dubai-request" className="text-gold-400 text-sm mt-2 inline-block hover:underline">كيف تطلب من دبي؟</Link>
                                    </div>
                                ) : (
                                    pendingDubai.map(req => (
                                        <div key={req.id} className="bg-dark-800 border-2 border-blue-500/20 rounded-[32px] p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                                            <div className="w-40 h-40 rounded-2xl overflow-hidden border border-dark-600 bg-dark-900 group-hover:scale-105 transition-transform duration-500">
                                                <img src={req.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 text-center md:text-right">
                                                <div className="flex justify-between items-start mb-4 flex-row-reverse">
                                                    <div className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-blue-500/20 flex items-center gap-2">
                                                        <Clock className="w-3 h-3 animate-pulse" />
                                                        بانتظار التسعيرة من دبي
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-600">#{req.id}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-white mb-2">{req.productName}</h3>
                                                <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xl">{req.productDescription || "طلب خاص لمواصفات معينة من دبي"}</p>
                                                <div className="flex flex-wrap gap-4 justify-center md:justify-end font-bold text-xs text-gray-500">
                                                    <span>تاريخ الطلب: {new Date(req.createdAt).toLocaleDateString('ar-MR')}</span>
                                                    <span className="text-gold-400">فريقنا يبحث الآن في أسواق دبي...</span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleContactAdmin('dubai', req.id)} className="w-full md:w-auto bg-dark-700 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-3">
                                                <MessageCircle className="w-5 h-5" />
                                                استعجال الرد
                                            </button>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* 4. History Tab */}
                        {activeTab === 'history' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {(historyOrders.length === 0 && closedDubai.length === 0) ? (
                                    <div className="text-center py-20 opacity-30">
                                        <History className="w-16 h-16 mx-auto mb-4" />
                                        <p>سجل الطلبات فارغ</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {[...historyOrders, ...closedDubai].map((item, idx) => (
                                            <div key={idx} className="bg-dark-800/80 rounded-2xl border border-dark-700 p-6 flex items-center justify-between group grayscale hover:grayscale-0 transition duration-500">
                                                <div className="flex items-center gap-6 flex-row-reverse">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-900 border border-dark-700">
                                                        <img src={'image' in item ? item.image : item.items[0].image} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white font-bold">{'productName' in item ? item.productName : `طلب متجر #${item.id}`}</p>
                                                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString('ar-MR')}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-gold-400 font-black">{'total' in item ? item.total.toLocaleString() : (item.price! + item.shippingCost!).toLocaleString()} UM</p>
                                                    <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 justify-end">
                                                        تم التسليم بنجاح
                                                        <Package className="w-3 h-3" />
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            <Footer />
        </main>
    );
}

// Sub-component for a Luxurious Order Card
function OrderCard({ order, onContact }: { order: Order, type: string, onContact: () => void }) {
    const steps = [
        { id: 'pending', label: 'تجهيز' },
        { id: 'contacted', label: 'تأكيد' },
        { id: 'shipped', label: 'شحن' },
        { id: 'delivered', label: 'تسليم' }
    ];

    const currentStep = ['pending', 'contacted', 'shipped', 'delivered'].indexOf(order.status) + 1;

    return (
        <div className="bg-dark-800 rounded-[32px] border border-dark-700 p-8 shadow-xl hover:border-gold-400/30 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6 flex-row-reverse">
                <span className="text-[10px] font-mono text-gray-600">#{order.id}</span>
                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('ar-MM')}</span>
            </div>

            <div className="flex gap-6 mb-8 flex-row-reverse">
                <div className="w-24 h-24 rounded-2xl bg-dark-900 border border-dark-700 overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={order.items[0].image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-right">
                    <h4 className="text-lg font-black text-white mb-1 truncate">{order.items[0].name} {order.items.length > 1 && `+${order.items.length - 1}`}</h4>
                    <p className="text-2xl font-black text-gold-400">{order.total.toLocaleString()} <span className="text-xs font-normal">UM</span></p>
                </div>
            </div>

            {/* Status Tracking */}
            <div className="mb-8">
                <div className="flex justify-between mb-4 flex-row-reverse">
                    <span className="text-xs font-black text-white">حالة الطلب</span>
                    <span className="text-xs text-gold-400 font-bold">
                        {order.status === 'pending' && 'جاري تجهيز طلبك في المخازن'}
                        {order.status === 'contacted' && 'تم تأكيد طلبك - المندوب سيتحرك قريباً'}
                        {order.status === 'shipped' && 'الطلب في طريقه إليك الآن 🛵'}
                    </span>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden border border-dark-700">
                    <div
                        className="absolute top-0 right-0 h-full bg-gradient-to-l from-gold-600 to-gold-400 transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 flex-row-reverse">
                    {steps.map((s, i) => (
                        <span key={s.id} className={`text-[9px] font-black uppercase tracking-tight ${currentStep >= (i + 1) ? 'text-white' : 'text-gray-700'}`}>
                            {s.label}
                        </span>
                    ))}
                </div>
            </div>

            <button onClick={onContact} className="w-full bg-dark-900 hover:bg-green-600/10 hover:text-green-500 border border-dark-600 hover:border-green-500 text-gray-400 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 active:scale-95">
                <MessageCircle className="w-5 h-5" />
                تواصل مع الإدارة بخصوص هذا الطلب
            </button>
        </div>
    );
}

// Sub-component for Dubai Active Card
function DubaiCard({ request, onContact }: { request: DubaiRequest, onContact: () => void }) {
    const steps = [
        { id: 'new', label: 'تسعير' },
        { id: 'quoted', label: 'موافقة' },
        { id: 'purchased', label: 'شحن دبي' },
        { id: 'arrived', label: 'نواكشوط' }
    ];

    const currentStep = ['new', 'quoted', 'purchased', 'arrived'].indexOf(request.status) + 1;
    const total = (request.price || 0) + (request.shippingCost || 0);

    return (
        <div className="bg-dark-800 rounded-[32px] border-2 border-blue-500/10 p-8 shadow-xl group relative overflow-hidden">
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-500/10 text-blue-400 px-2 rounded-lg text-[8px] font-black italic">
                <Plane className="w-3 h-3" />
                DUBAI VIP
            </div>

            <div className="flex justify-between items-start mb-6 flex-row-reverse mt-2">
                <span className="text-[10px] font-mono text-gray-600">#{request.id}</span>
                <span className="text-xs text-gray-400">{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex gap-6 mb-8 flex-row-reverse">
                <div className="w-24 h-24 rounded-2xl bg-dark-900 border border-dark-700 overflow-hidden">
                    <img src={request.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-right">
                    <h4 className="text-lg font-black text-white mb-1">{request.productName}</h4>
                    <p className="text-2xl font-black text-gold-400">{total.toLocaleString()} <span className="text-xs font-normal">UM</span></p>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between mb-4 flex-row-reverse">
                    <span className="text-xs font-black text-white">حالة الشحن من دبي</span>
                    <span className="text-xs text-blue-400 font-bold">
                        {request.status === 'quoted' && 'بانتظار موافقتك على السعر'}
                        {request.status === 'purchased' && 'تم الشراء من دبي وهي في طريقها للمطار ✈️'}
                    </span>
                </div>
                <div className="relative h-2 bg-dark-900 rounded-full overflow-hidden border border-dark-700">
                    <div
                        className="absolute top-0 right-0 h-full bg-gradient-to-l from-blue-600 to-blue-400 transition-all duration-1000"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-3 flex-row-reverse">
                    {steps.map((s, i) => (
                        <span key={s.id} className={`text-[9px] font-black tracking-tight ${currentStep >= (i + 1) ? 'text-white' : 'text-gray-700'}`}>
                            {s.label}
                        </span>
                    ))}
                </div>
            </div>

            <button onClick={onContact} className="w-full bg-dark-900 hover:bg-green-600/10 hover:text-green-500 border border-dark-600 hover:border-green-500 text-gray-400 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3">
                <MessageCircle className="w-5 h-5" />
                تواصل مع الإدارة بخصوص هذا الغرض
            </button>
        </div>
    );
}
