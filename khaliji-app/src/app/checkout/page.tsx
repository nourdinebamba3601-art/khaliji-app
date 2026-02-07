'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { MapPin, Phone, User, CheckCircle2, Loader2, MessageCircle, CreditCard } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { user, login } = useAuth();
    const { settings } = useSettings();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');


    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    if (items.length === 0 && !orderSuccess) {
        router.push('/shop');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);

        try {
            // Login user if not already or info changed
            if (!user || user.phone !== formData.phone) {
                login(formData.name, formData.phone, formData.address);
            }

            const userId = `USER-${formData.phone.replace(/\s+/g, '')}`;

            const newOrderId = await addOrder({
                customerName: formData.name,
                phone: formData.phone,
                address: formData.address,
                items: items.map(item => ({
                    ...item,
                    source: (item as any).source || 'local'
                })),
                total: total,
                source: items.some(i => (i as any).source === 'dubai') ? 'dubai' : 'local',
                userId: userId
            });

            setOrderId(newOrderId);
            setOrderSuccess(true);
            clearCart();
            toast.success('تم تسجيل طلبك بنجاح!');

        } catch (error) {
            toast.error('حدث خطأ أثناء معالجة الطلب');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsAppConfirm = () => {
        const PHONE_NUMBER = settings.whatsappNumber;
        const message = `*طلب جديد من متجر ${settings.storeName}*%0a` +
            `---------------------------%0a` +
            `🆔 رقم الطلب: ${orderId}%0a` +
            `👤 العميل: ${formData.name}%0a` +
            `📍 العنوان: ${formData.address}%0a` +
            `---------------------------%0a` +
            `يرجى تأكيد استلام الطلب وبدء إجراءات التوصيل.`;

        const url = `https://wa.me/222${PHONE_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    };

    if (orderSuccess) {
        return (
            <main className="min-h-screen bg-dark-900 text-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500/50">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">شكراً لتسوقكم من أناقة الخليج!</h1>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                        تم تسجيل طلبك بنجاح برقم <span className="text-gold-400 font-mono font-bold">#{orderId}</span>.
                        سنقوم بالتواصل معكم قريباً لتأكيد التوصيل.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button
                            onClick={handleWhatsAppConfirm}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
                        >
                            <MessageCircle className="w-5 h-5" />
                            تأكيد عبر واتساب
                        </button>
                        <button
                            onClick={() => router.push('/shop')}
                            className="flex-1 bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 font-bold py-4 rounded-xl transition"
                        >
                            متابعة التسوق
                        </button>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <Toaster position="top-center" richColors />

            <div className="max-w-4xl mx-auto px-4 py-32">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Checkout Form */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black text-white mb-8">إتمام الطلب</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 shadow-xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gold-400" />
                                    بيانات التوصيل
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">الاسم الكريم</label>
                                        <div className="relative">
                                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-dark-900 border border-dark-700 rounded-xl pr-12 pl-4 py-3 text-white focus:border-gold-400 outline-none transition"
                                                placeholder="مثال: أحمد محمد"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">رقم الهاتف (واتساب)</label>
                                        <div className="relative">
                                            <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                            <input
                                                required
                                                type="tel"
                                                className="w-full bg-dark-900 border border-dark-700 rounded-xl pr-12 pl-4 py-3 text-white focus:border-gold-400 outline-none transition"
                                                placeholder="4xxxxxxxx"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">العنوان في موريتانيا</label>
                                        <div className="relative">
                                            <MapPin className="absolute right-4 top-3 w-5 h-5 text-gray-600" />
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full bg-dark-900 border border-dark-700 rounded-xl pr-12 pl-4 py-3 text-white focus:border-gold-400 outline-none transition"
                                                placeholder="مثال: نواكشوط - تفرغ زينة - قرب كرفور..."
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gold-400 hover:bg-gold-500 text-dark-900 font-black py-5 rounded-2xl text-xl transition-all shadow-xl shadow-gold-400/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        جاري تأكيد الطلب...
                                    </>
                                ) : (
                                    <>تأكيد الطلب الآن</>
                                )}
                            </button>

                            <p className="text-center text-gray-500 text-sm">
                                بالضغط على تأكيد الطلب، أنت توافق على شروط الخدمة.
                                سيتم فتح واتساب تلقائياً بعد التأكيد.
                            </p>
                        </form>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-80">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 sticky top-32">
                            <h3 className="font-bold text-lg mb-6">مراجعة سريعة</h3>
                            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} × {item.price.toLocaleString()} UM</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-dark-700 space-y-2">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>المجموع</span>
                                    <span>{total.toLocaleString()} UM</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>التوصيل</span>
                                    <span className={settings.shippingFee === 0 ? 'text-green-500 font-bold' : ''}>
                                        {settings.shippingFee === 0 ? 'مجاني' : `${settings.shippingFee.toLocaleString()} UM`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-white font-black text-xl pt-2 border-t border-dark-700 mt-4">
                                    <span>الإجمالي</span>
                                    <span className="text-gold-400">{(total + settings.shippingFee).toLocaleString()} UM</span>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="mt-8 pt-6 border-t border-dashed border-dark-600">
                                <p className="text-[10px] text-gray-500 font-black uppercase mb-3 flex items-center gap-2">
                                    <CreditCard className="w-3 h-3" /> بيانات الدفع (Bankily / Masrivi)
                                </p>
                                <div className="bg-dark-900/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-gold-400 font-black text-center text-lg">{settings.bankilyNumber}</p>
                                    <p className="text-[10px] text-gray-600 text-center mt-1">يرجى الدفع قبل أو عند الاستلام</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Footer />
        </main>
    );
}
