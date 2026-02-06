'use client';

import { useOrders } from '@/context/OrderContext';
import { useDubaiRequests } from '@/context/DubaiRequestContext';
import { ShoppingBag, Plane, DollarSign, TrendingUp, Package, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { orders } = useOrders();
    const { requests } = useDubaiRequests();

    const totalSales = orders
        .filter(o => o.status === 'delivered')
        .reduce((acc, curr) => acc + curr.total, 0);

    const stats = [
        {
            label: "إجمالي المبيعات",
            value: totalSales.toLocaleString(),
            suffix: "UM",
            icon: DollarSign,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "طلبات المتجر",
            value: orders.length,
            suffix: "طلب",
            icon: ShoppingBag,
            color: "text-gold-400",
            bg: "bg-gold-500/10"
        },
        {
            label: "طلبات دبي الواردة",
            value: requests.length,
            suffix: "طلب VIP",
            icon: Plane,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            label: "بانتظار التسعير",
            value: requests.filter(r => r.status === 'new').length,
            suffix: "طلب",
            icon: TrendingUp,
            color: "text-red-400",
            bg: "bg-red-500/10"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-black text-white">لوحة القيادة</h1>
                <p className="text-gray-400 text-sm mt-1">نظرة عامة على نشاط متجر أناقة الخليج</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-dark-800 p-6 rounded-2xl border border-dark-700 hover:border-dark-600 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-gray-600 group-hover:text-gold-400 transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </span>
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className={`text-2xl font-black ${stat.color}`}>
                            {stat.value} <span className="text-[10px] font-normal text-gray-600">{stat.suffix}</span>
                        </h3>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Store Orders */}
                <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                        <h3 className="font-black text-white flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gold-400" />
                            أحدث طلبات الزبائن
                        </h3>
                        <Link href="/admin/orders" className="text-gold-400 text-xs font-bold hover:underline">عرض الكل</Link>
                    </div>
                    <div className="divide-y divide-dark-700/50">
                        {orders.slice(0, 5).length > 0 ? (
                            orders.slice(0, 5).map((order) => (
                                <div key={order.id} className="px-8 py-4 flex justify-between items-center hover:bg-dark-700/20 transition">
                                    <div>
                                        <p className="text-sm font-bold text-white">{order.customerName}</p>
                                        <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-MR')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white">{order.total.toLocaleString()} UM</p>
                                        <p className="text-[9px] text-gold-400 uppercase font-black">{order.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-600 text-sm">لا توجد طلبات متجر حالياً</div>
                        )}
                    </div>
                </div>

                {/* Recent Dubai Requests */}
                <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
                    <div className="px-8 py-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                        <h3 className="font-black text-white flex items-center gap-2">
                            <Plane className="w-5 h-5 text-blue-400" />
                            طلبات دبي الأخيرة
                        </h3>
                        <Link href="/admin/dubai-requests" className="text-blue-400 text-xs font-bold hover:underline">عرض الكل</Link>
                    </div>
                    <div className="divide-y divide-dark-700/50">
                        {requests.slice(0, 5).length > 0 ? (
                            requests.slice(0, 5).map((req) => (
                                <div key={req.id} className="px-8 py-4 flex items-center gap-4 hover:bg-dark-700/20 transition">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-dark-600">
                                        <img src={req.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white truncate max-w-[150px]">{req.productName}</p>
                                        <p className="text-[10px] text-gray-500 font-mono">#{req.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[8px] font-black px-2 py-1 rounded-full border ${req.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-dark-700 text-gray-500 border-dark-600'}`}>
                                            {req.status === 'new' ? 'طلب جديد' : 'مُسعر'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-600 text-sm">لا توجد طلبات دبي حالياً</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
