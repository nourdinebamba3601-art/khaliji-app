'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, XCircle, Plane, DollarSign, MessageCircle, Package, MapPin, Phone, User, Trash, CheckCircle2, TrendingUp, Clock, Loader2, Link as LinkIcon } from 'lucide-react';
import { useDubaiRequests, DubaiRequest, DubaiRequestStatus } from '@/context/DubaiRequestContext';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function DubaiRequestsAdminPage() {
    const { requests, updateRequestPrice, updateRequestStatus, deleteRequest } = useDubaiRequests();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<DubaiRequest | null>(null);

    // Pricing state
    const [price, setPrice] = useState('');
    const [shipping, setShipping] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const filteredRequests = requests.filter(req =>
        req.customerName.includes(searchTerm) || req.productName.includes(searchTerm) || req.id.includes(searchTerm)
    );

    const getStatusConfig = (status: DubaiRequestStatus) => {
        switch (status) {
            case 'new': return { label: 'طلب عاجل دبي 🚩', color: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' };
            case 'searching': return { label: 'جاري البحث في دبي 🔍', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]' };
            case 'purchased': return { label: 'تم الشراء 🛍️', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
            case 'shipping': return { label: 'في الطريق ✈️', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
            case 'ready': return { label: 'جاهز للتسليم 📦', color: 'bg-gold-500/10 text-gold-500 border-gold-500/20' };
            case 'cancelled': return { label: 'ملغي', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20' };
        }
    };

    const handleSendPrice = async () => {
        if (!selectedRequest || !price || !shipping) {
            toast.error('يرجى إدخال السعر وتكلفة الشحن');
            return;
        }

        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));

        updateRequestPrice(selectedRequest.id, parseFloat(price), parseFloat(shipping));

        toast.success('تمت إضافة التسعيرة بنجاح!');
        setIsSaving(false);
        // Keep selected request to see update but refresh local view
        setSelectedRequest(prev => prev ? { ...prev, price: parseFloat(price), shippingCost: parseFloat(shipping), status: 'searching' } : null);
    };

    const handleWhatsAppPricing = (req: DubaiRequest) => {
        const message = `*تحديث طلب من أناقة الخليج 🇦🇪*%0a` +
            `---------------------------%0a` +
            `📦 الغرض: ${req.productName}%0a` +
            (req.price ? `💰 السعر: ${req.price?.toLocaleString()} UM%0a` : '') +
            (req.shippingCost ? `🚚 الشحن: ${req.shippingCost?.toLocaleString()} UM%0a` : '') +
            (req.price ? `💵 المجموع: ${((req.price || 0) + (req.shippingCost || 0)).toLocaleString()} UM%0a` : '') +
            `---------------------------%0a` +
            `الحالة الحالية: ${getStatusConfig(req.status).label}%0a` +
            `رقم الطلب: #${req.id}%0a` +
            `هل ترغب في متابعة التفاصيل؟`;

        const url = `https://wa.me/222${req.phone}?text=${message}`;
        window.open(url, '_blank');
    };

    return (
        <div className="relative">
            <Toaster position="top-center" richColors />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Plane className="text-gold-400" />
                        طلبات دبي الواردة
                    </h1>
                    <p className="text-gray-400 text-sm">إدارة الطلبات الخاصة والبحث عن المنتجات الحصرية</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-blue-400 text-xs font-bold">{requests.filter(r => r.status === 'new').length} طلبات بانتظار السعر</span>
                </div>
            </div>

            <div className="bg-dark-800 p-4 rounded-xl border border-dark-700 mb-6 flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="بحث برقم الطلب أو اسم المنتج..."
                        className="w-full bg-dark-900 border border-dark-700 rounded-lg pr-10 pl-4 py-2 text-white focus:border-gold-400 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-dark-800 rounded-2xl border border-dark-700 overflow-hidden">
                {filteredRequests.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center opacity-30">
                        <Plane className="w-20 h-20 mb-4" />
                        <p>لا توجد طلبات واردة حالياً</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right min-w-[900px]">
                            <thead className="bg-dark-900 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-dark-700">
                                <tr>
                                    <th className="px-6 py-5">المُنتج</th>
                                    <th className="px-6 py-5">الزبون</th>
                                    <th className="px-6 py-5">الحالة</th>
                                    <th className="px-6 py-5">السعر المعروض</th>
                                    <th className="px-6 py-5 text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-700/50">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-dark-700/20 transition group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-dark-600 overflow-hidden border border-dark-500 shadow-lg">
                                                    <img src={req.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{req.productName}</p>
                                                    <p className="text-[10px] text-gold-400 font-mono">#{req.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-bold">{req.customerName}</p>
                                            <p className="text-xs text-gray-500">{req.phone}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusConfig(req.status).color}`}>
                                                {getStatusConfig(req.status).label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.price ? (
                                                <p className="text-gold-400 font-black">{(req.price + (req.shippingCost || 0)).toLocaleString()} UM</p>
                                            ) : (
                                                <span className="text-red-500 text-[10px] font-bold">لم يتم التسعير</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedRequest(req);
                                                        setPrice(req.price?.toString() || '');
                                                        setShipping(req.shippingCost?.toString() || '');
                                                    }}
                                                    className="p-3 bg-dark-700 hover:bg-gold-500 hover:text-dark-900 text-gold-400 rounded-xl transition-all shadow-lg"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteRequest(req.id)}
                                                    className="p-3 bg-dark-700 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition"
                                                >
                                                    <Trash className="w-4 h-4" />
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

            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-dark-800 border border-dark-600 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                                <h3 className="text-xl font-black text-white flex items-center gap-3">
                                    <Plane className="text-gold-400" />
                                    تفاصيل طلب دبي: #{selectedRequest.id}
                                </h3>
                                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-dark-700 rounded-full text-gray-400">
                                    <XCircle className="w-8 h-8" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-8">
                                {/* Left: Product and Info */}
                                <div className="space-y-6">
                                    <div className="aspect-square bg-dark-900 rounded-2xl overflow-hidden border border-dark-700">
                                        <img src={selectedRequest.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="p-6 bg-dark-900/50 rounded-2xl border border-dark-700 space-y-4">
                                        <div>
                                            <p className="text-xs text-gold-400 uppercase font-black mb-1">اسم المنتج</p>
                                            <p className="text-white font-bold text-lg">{selectedRequest.productName}</p>
                                        </div>

                                        {selectedRequest.productLink && (
                                            <div>
                                                <p className="text-xs text-blue-400 uppercase font-black mb-1 tracking-widest">رابط المنتج</p>
                                                <a href={selectedRequest.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-1 ltr">
                                                    <LinkIcon className="w-3 h-3" /> View Product Page
                                                </a>
                                            </div>
                                        )}

                                        {selectedRequest.budget && (
                                            <div>
                                                <p className="text-xs text-amber-500 uppercase font-black mb-1 tracking-widest">الميزانية المقترحة</p>
                                                <p className="text-amber-400 font-bold">{selectedRequest.budget}</p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">وصف العميل</p>
                                            <p className="text-gray-400 text-sm italic leading-relaxed">{selectedRequest.productDescription || "لا يوجد وصف إضافي"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex-1 p-3 bg-dark-700/30 rounded-xl border border-dark-700">
                                            <p className="text-gray-500 mb-1">تاريخ الطلب</p>
                                            <p className="text-white font-bold">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex-1 p-3 bg-dark-700/30 rounded-xl border border-dark-700">
                                            <p className="text-gray-500 mb-1">العميل</p>
                                            <p className="text-white font-bold">{selectedRequest.customerName}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Management and Pricing */}
                                <div className="space-y-6">
                                    <div className="bg-gold-500/5 p-6 rounded-3xl border border-gold-400/20">
                                        <h4 className="text-sm font-black text-gold-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            تسعير الطلب الخاص
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">سعر المنتج (دبي)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none font-black"
                                                    placeholder="0.00"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-2">تكلفة الشحن لـ موريتانيا</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-white focus:border-gold-400 outline-none font-black"
                                                    placeholder="0.00"
                                                    value={shipping}
                                                    onChange={(e) => setShipping(e.target.value)}
                                                />
                                            </div>
                                            <div className="pt-4 border-t border-dark-700 flex justify-between items-center mb-4">
                                                <span className="text-gray-400 text-xs">الإجمالي المستحق</span>
                                                <span className="text-2xl font-black text-white">{(parseFloat(price || '0') + parseFloat(shipping || '0')).toLocaleString()} UM</span>
                                            </div>
                                            <button
                                                onClick={handleSendPrice}
                                                disabled={isSaving}
                                                className="w-full bg-gold-400 hover:bg-gold-500 text-dark-900 font-black py-4 rounded-xl transition shadow-xl shadow-gold-400/20 flex items-center justify-center gap-2"
                                            >
                                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                                                تحديث السعر وإبلاغ الزبون
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lifecycle Update */}
                                    <div className="bg-dark-900/50 p-6 rounded-3xl border border-dark-700">
                                        <h4 className="text-xs font-black text-gray-500 mb-5 uppercase tracking-widest">مرحلة الطلب الحالية</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { id: 'new', label: '🚩 طلب عاجل', color: 'red' },
                                                { id: 'searching', label: '🔍 جاري البحث', color: 'amber' },
                                                { id: 'purchased', label: '🛍️ تم الشراء', color: 'green' },
                                                { id: 'shipping', label: '✈️ في الطريق', color: 'blue' },
                                                { id: 'ready', label: '📦 في نواكشوط', color: 'gold' }
                                            ].map((st) => (
                                                <button
                                                    key={st.id}
                                                    onClick={() => updateRequestStatus(selectedRequest.id, st.id as DubaiRequestStatus)}
                                                    className={`py-3 rounded-xl text-[10px] font-black border transition ${selectedRequest.status === st.id ? 'bg-white/10 border-white text-white shadow-lg' : 'border-dark-700 text-gray-500 hover:border-gray-500'}`}
                                                >
                                                    {st.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleWhatsAppPricing(selectedRequest)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 transition group"
                                    >
                                        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition" />
                                        مشاركة عرض السعر على واتساب
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
