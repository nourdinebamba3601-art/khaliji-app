'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock, MapPin, Phone, User, Package, Trash, DollarSign, ExternalLink, Printer, MessageCircle } from 'lucide-react';
import { useOrders, Order } from '@/context/OrderContext';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersPage() {
    const { orders, updateOrderStatus, deleteOrder } = useOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [lastOrderCount, setLastOrderCount] = useState(orders.length);

    // Notification Effect for new orders
    // Notification Effect for new orders
    useEffect(() => {
        if (orders.length > lastOrderCount && lastOrderCount !== 0) {
            // Play notification sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio disabled by browser', e));

            toast.success('تم استلام طلب جديد الآن! 🛍️', {
                description: `الطلب الجديد من: ${orders[0].customerName}`,
                duration: 5000
            });
        }
        setLastOrderCount(orders.length);
    }, [orders, lastOrderCount]);


    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.includes(searchTerm) || order.id.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-red-500/10 text-red-500 border-red-500/20'; // Red for new
            case 'contacted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'; // Yellow for in progress
            case 'shipped': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'; // Blue for shipping
            case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20'; // Green for complete
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'طلب جديد';
            case 'contacted': return 'تم التواصل';
            case 'shipped': return 'جاري التوصيل';
            case 'delivered': return 'تم التسليم';
            default: return status;
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="relative">
            <Toaster position="top-center" richColors />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">إدارة الطلبات المستلمة</h1>
                    <p className="text-gray-400 text-sm">متابعة المبيعات وحالات التوصيل ({orders.length} طلب إجمالي)</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-dark-800 px-4 py-2 rounded-lg border border-dark-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-gray-300 text-sm">{orders.filter(o => o.status === 'pending').length} طلبات جديدة</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="بحث برقم الطلب أو اسم العميل..."
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg pr-10 pl-4 py-2 text-white focus:border-gold-400 outline-none transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 text-sm">
                    <select
                        className="bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white outline-none focus:border-gold-400"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="pending">طلب جديد (أحمر)</option>
                        <option value="contacted">تم التواصل (أصفر)</option>
                        <option value="shipped">جاري التوصيل (أزرق)</option>
                        <option value="delivered">مكتمل (أخضر)</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden shadow-2xl">
                {filteredOrders.length === 0 ? (
                    <div className="p-20 text-center text-gray-500 flex flex-col items-center">
                        <Package className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">لا يوجد طلبات تطابق بحثك حالياً.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right min-w-[900px]">
                            <thead className="bg-dark-900/50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-5">رقم الطلب</th>
                                    <th className="px-6 py-5">العميل</th>
                                    <th className="px-6 py-5">المكان</th>
                                    <th className="px-6 py-5">التاريخ</th>
                                    <th className="px-6 py-5">الإجمالي</th>
                                    <th className="px-6 py-5 text-center">الحالة</th>
                                    <th className="px-6 py-5 text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700/50 text-sm">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-dark-700/20 transition group">
                                        <td className="px-6 py-4 font-mono text-gold-400 font-bold">{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold">{order.customerName}</span>
                                                <span className="text-xs text-gray-500">{order.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 max-w-[150px] truncate">{order.address}</td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('ar-MR')}
                                        </td>
                                        <td className="px-6 py-4 text-white font-black">{order.total.toLocaleString()} UM</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)} flex items-center gap-1.5`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'pending' ? 'animate-pulse bg-red-500' : ''}`} style={{ backgroundColor: 'currentColor' }}></span>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="w-10 h-10 flex items-center justify-center bg-dark-700 hover:bg-gold-500 hover:text-dark-900 text-gold-400 rounded-xl transition-all shadow-lg"
                                                    title="عرض التفاصيل الكاملة"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('حذف الطلب؟')) deleteOrder(order.id) }}
                                                    className="w-10 h-10 flex items-center justify-center bg-dark-700 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all"
                                                >
                                                    <Trash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-dark-800 border border-dark-600 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                                <div>
                                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                        <Package className="text-gold-400" />
                                        تفاصيل الطلب: <span className="text-gold-400 font-mono">#{selectedOrder.id}</span>
                                    </h2>
                                    <p className="text-gray-500 text-xs mt-1">تاريخ الطلب: {new Date(selectedOrder.createdAt).toLocaleString('ar-MR')}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-dark-700 rounded-full text-gray-400 hover:text-white transition">
                                    <XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-8 overflow-y-auto print:p-0">
                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                    {/* Customer Card */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gold-400 uppercase tracking-widest border-b border-dark-700 pb-2">بيانات الزبون</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center text-gold-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">الاسم الكريم</p>
                                                <p className="text-white font-bold">{selectedOrder.customerName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center text-gold-400">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">رقم الهاتف</p>
                                                <a href={`tel:${selectedOrder.phone}`} className="text-white font-bold hover:text-gold-400 transition ltr inline-block">{selectedOrder.phone}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-dark-700 rounded-full flex items-center justify-center text-gold-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">العنوان</p>
                                                <p className="text-gray-300 text-sm italic">{selectedOrder.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Status Card */}
                                    <div className="bg-dark-900/50 p-6 rounded-2xl border border-dark-700">
                                        <h4 className="text-xs font-black text-gray-400 uppercase mb-4">تحديث حالة الطلب</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                                                className={`py-2 px-4 rounded-xl text-xs font-bold transition border ${selectedOrder.status === 'pending' ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-dark-800 text-red-500 border-red-500/30 hover:bg-red-500/10'}`}
                                            >🔴 طلب جديد (غير مؤكد)</button>
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'contacted')}
                                                className={`py-2 px-4 rounded-xl text-xs font-bold transition border ${selectedOrder.status === 'contacted' ? 'bg-yellow-500 text-dark-900 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-dark-800 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10'}`}
                                            >🟡 تم التواصل مع الزبون</button>
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                                                className={`py-2 px-4 rounded-xl text-xs font-bold transition border ${selectedOrder.status === 'shipped' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-dark-800 text-blue-500 border-blue-500/30 hover:bg-blue-500/10'}`}
                                            >🔵 جاري الشحن / التوصيل</button>
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                                                className={`py-2 px-4 rounded-xl text-xs font-bold transition border ${selectedOrder.status === 'delivered' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20' : 'bg-dark-800 text-green-500 border-green-500/30 hover:bg-green-500/10'}`}
                                            >🟢 تم التسليم بنجاح</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-4 mb-8">
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-dark-700 pb-2">قائمة المنتجات</h4>
                                    <div className="grid gap-3">
                                        {selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 bg-dark-900/50 p-3 rounded-2xl border border-dark-700">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-800 border border-dark-600 flex-shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-white font-bold truncate">{item.name}</p>
                                                        <span className="text-gold-400 font-bold">{(item.price * item.quantity).toLocaleString()} UM</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">الكمية: {item.quantity} × {item.price.toLocaleString()} UM</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="bg-gold-500/10 border border-gold-400/30 rounded-2xl p-6 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gold-400 rounded-2xl flex items-center justify-center text-dark-900 shadow-xl shadow-gold-400/20">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gold-400 font-bold uppercase">الإجمالي النهائي</p>
                                            <p className="text-3xl font-black text-white">{selectedOrder.total.toLocaleString()} UM</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 block uppercase mb-1">طريقة الدفع المتوقعة</span>
                                        <span className="bg-dark-800 text-white text-xs px-3 py-1 rounded-full border border-dark-600">Bankily / كاش</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Actions */}
                            <div className="p-6 bg-dark-900/80 border-t border-dark-700 flex gap-4">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 bg-dark-700 hover:bg-dark-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
                                >
                                    <Printer className="w-5 h-5" />
                                    تحميل فاتورة التوصيل (PDF)
                                </button>
                                <a
                                    href={`https://wa.me/222${selectedOrder.phone}`}
                                    target="_blank"
                                    className="px-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-600/20"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    تواصل مع الزبون
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
