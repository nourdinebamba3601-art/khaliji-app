'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Camera, Send, AlertCircle, CheckCircle, Loader2, Sparkles, User, ShoppingBag, MapPin, Globe, Plane, Search, Package, DollarSign, Link as LinkIcon, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useDubaiRequests, DubaiRequestStatus } from '@/context/DubaiRequestContext';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function DubaiRequestPage() {
    const { addRequest, requests } = useDubaiRequests();
    const { user, login } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [requestId, setRequestId] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        productDescription: '',
        productLink: '',
        budget: '',
        customerName: user?.name || '',
        phone: user?.phone || '',
        image: ''
    });

    const userRequests = requests.filter(r => r.userId === `USER-${user?.phone.replace(/\s+/g, '')}`);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                toast.error('حجم الصورة كبير جداً');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.customerName || !formData.phone) {
            toast.error('يرجى ملء كافة البيانات');
            return;
        }

        setIsSubmitting(true);
        try {
            if (!user || user.phone !== formData.phone) {
                login(formData.customerName, formData.phone);
            }

            // Simulate server proccessing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const newId = await addRequest({
                customerName: formData.customerName,
                phone: formData.phone,
                productName: formData.productName,
                productDescription: formData.productDescription,
                productLink: formData.productLink,
                budget: formData.budget,
                image: formData.image,
                userId: `USER-${formData.phone.replace(/\s+/g, '')}`
            });

            setRequestId(newId);
            setStep(3);
            toast.success('تم إرسال طلبك العاجل إلى دبي! ✨');
        } catch (error) {
            toast.error('حدث خطأ أثناء إرسال الطلب');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusInfo = (status: DubaiRequestStatus) => {
        switch (status) {
            case 'new': return { label: 'تم استلام الطلب', icon: Send, color: 'text-blue-400', bg: 'bg-blue-400/10' };
            case 'searching': return { label: 'جاري البحث في دبي', icon: Search, color: 'text-amber-400', bg: 'bg-amber-400/10' };
            case 'purchased': return { label: 'تم الشراء بنجاح', icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-400/10' };
            case 'shipping': return { label: 'في الطريق لنواكشوط', icon: Plane, color: 'text-purple-400', bg: 'bg-purple-400/10' };
            case 'ready': return { label: 'جاهز للتسليم', icon: Package, color: 'text-gold-400', bg: 'bg-gold-400/10' };
            case 'cancelled': return { label: 'ملغي', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' };
        }
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />
            <Toaster position="top-center" richColors />

            {/* Premium Header with Visual Connection */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 flex flex-col items-center">
                        <MapPin className="w-8 h-8 text-gold-400" />
                        <span className="text-[10px] font-bold mt-1 uppercase">Nouakchott</span>
                    </div>
                    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 flex flex-col items-center">
                        <Globe className="w-8 h-8 text-gold-400" />
                        <span className="text-[10px] font-bold mt-1 uppercase">Dubai</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-400 text-xs font-black uppercase mb-6 tracking-widest shadow-lg shadow-gold-400/5 ltr"
                    >
                        <Sparkles className="w-4 h-4" />
                        Nouakchott ⟷ Dubai VIP Logistics
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                        اطلب <span className="text-gold-gradient">أي شيء</span> من أسواق دبي 🇦🇪
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                        هل تبحث عن عطر نادر أو ساعة محددة؟ أخبرنا بطلبك وسيقوم فريقنا في دبي بالبحث عنه، تصويره، وشحنه لك بضمان (أناقة الخليج).
                    </p>

                    {user && userRequests.length > 0 && (
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="mt-8 flex items-center gap-2 mx-auto text-gold-400 hover:text-gold-300 font-bold transition md:text-lg"
                        >
                            <History className="w-5 h-5" /> تتبع طلباتك السابقة
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-32">
                <AnimatePresence mode="wait">
                    {showHistory ? (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black">سجل الطلبات الخاصة</h2>
                                <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">إغلاق ✕</button>
                            </div>
                            {userRequests.map((req) => {
                                const status = getStatusInfo(req.status);
                                return (
                                    <div key={req.id} className="bg-dark-800 rounded-[2rem] p-6 border border-dark-700 flex flex-col md:flex-row gap-6 items-center shadow-2xl">
                                        <div className="w-24 h-24 bg-dark-900 rounded-2xl overflow-hidden border border-white/5">
                                            <img src={req.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs text-gray-500 font-mono">#{req.id}</span>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${status.bg} ${status.color}`}>
                                                    <status.icon className="w-3 h-3" />
                                                    {status.label}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">{req.productName}</h3>
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                                <span>التاريخ: {new Date(req.createdAt).toLocaleDateString('ar-MA')}</span>
                                                {req.budget && <span>الميزانية: <span className="text-gold-400 font-bold">{req.budget}</span></span>}
                                            </div>
                                        </div>
                                        <Link href={`/cart`} className="bg-dark-700 hover:bg-dark-600 px-6 py-3 rounded-xl font-bold transition">
                                            التفاصيل
                                        </Link>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-dark-800 rounded-[3rem] border border-dark-700 shadow-2xl overflow-hidden"
                        >
                            {/* Form Header with Status Mapping */}
                            <div className="bg-dark-900/50 p-8 md:p-12 border-b border-dark-700">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[
                                        { label: 'طلب جديد', icon: Send, active: step >= 1 },
                                        { label: 'جاري البحث', icon: Search, active: step >= 3 },
                                        { label: 'تم الشراء', icon: ShoppingBag, active: false },
                                        { label: 'في الطريق', icon: Plane, active: false },
                                        { label: 'وصل لنواكشوط', icon: Package, active: false },
                                    ].map((s, i) => (
                                        <div key={i} className={`flex flex-col items-center gap-2 ${s.active ? 'text-gold-400 opacity-100' : 'text-gray-600 opacity-50'}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-700 ${s.active ? 'bg-gold-500/10 border-gold-400 shadow-lg shadow-gold-500/10' : 'border-dark-700 bg-dark-800'}`}>
                                                <s.icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-tighter text-center">{s.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 md:p-16">
                                {step === 1 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">
                                                        <Sparkles className="w-4 h-4 text-gold-400" /> اسم المنتج أو الماركة
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-dark-900 border-2 border-dark-700 rounded-2xl px-6 py-5 text-white focus:border-gold-400 outline-none transition-all shadow-inner placeholder:text-gray-700"
                                                        placeholder="مثال: عطر Roja Elysium الأصلي"
                                                        value={formData.productName}
                                                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">
                                                        <LinkIcon className="w-4 h-4 text-gold-400" /> رابط من موقع عالمي (إن وجد)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        className="w-full bg-dark-900 border-2 border-dark-700 rounded-2xl px-6 py-5 text-white focus:border-gold-400 outline-none transition-all shadow-inner placeholder:text-gray-700 text-left ltr"
                                                        placeholder="https://www.fragrantica.com/..."
                                                        value={formData.productLink}
                                                        onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">
                                                        <DollarSign className="w-4 h-4 text-gold-400" /> الميزانية التقريبية (بالجديدة)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-dark-900 border-2 border-dark-700 rounded-2xl px-6 py-5 text-gold-400 font-bold focus:border-gold-400 outline-none transition-all shadow-inner placeholder:text-gray-700"
                                                        placeholder="مثال: 50,000 - 70,000 جديدة"
                                                        value={formData.budget}
                                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <label className="flex items-center gap-2 text-sm font-black text-gray-400 mb-3 uppercase tracking-widest">
                                                    <Camera className="w-4 h-4 text-gold-400" /> صوّر المنتج أو ارفع صورة الشاشة
                                                </label>
                                                <label className="flex flex-col items-center justify-center w-full h-[280px] border-4 border-dashed border-dark-600 rounded-[2.5rem] cursor-pointer hover:border-gold-400 hover:bg-gold-400/[0.03] transition-all group relative overflow-hidden shadow-2xl">
                                                    {formData.image ? (
                                                        <div className="w-full h-full relative p-6">
                                                            <img src={formData.image} className="w-full h-full object-contain" />
                                                            <button
                                                                onClick={(e) => { e.preventDefault(); setFormData({ ...formData, image: '' }); }}
                                                                className="absolute top-6 right-6 bg-red-500/80 backdrop-blur p-3 rounded-2xl text-white hover:bg-red-500 transition shadow-2xl"
                                                            >
                                                                <Camera className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <div className="w-20 h-20 bg-dark-700 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold-gradient group-hover:text-dark-900 transition-all duration-500 shadow-xl">
                                                                <Camera className="w-10 h-10" />
                                                            </div>
                                                            <p className="text-lg text-white font-black mb-2">اضغط للتصوير أو الرفع</p>
                                                            <p className="text-sm text-gray-500 font-bold tracking-tighter">أقصى حجم: 2 ميجابايت (تحتاج صورة واضحة)</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                        </div>

                                        <button
                                            disabled={!formData.image || !formData.productName}
                                            onClick={() => setStep(2)}
                                            className="w-full bg-gold-gradient hover:opacity-90 disabled:opacity-30 disabled:grayscale text-dark-900 font-black py-6 rounded-[2rem] mt-4 transition-all shadow-2xl shadow-gold-400/20 text-xl flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            الخطوة التالية: معلومات التواصل <ArrowRight className="w-5 h-5 rotate-180" />
                                        </button>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                                        <div className="bg-dark-900/50 p-8 rounded-[2.5rem] border border-dark-700 mb-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-sm font-black text-gray-500 mb-4 uppercase tracking-widest">الاسم بالكامل</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-dark-800 border-2 border-dark-700 rounded-2xl px-6 py-5 text-white focus:border-gold-400 outline-none transition"
                                                        placeholder="اكتب اسمك هنا..."
                                                        value={formData.customerName}
                                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-black text-gray-500 mb-4 uppercase tracking-widest">رقم الواتساب بموريتانيا</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full bg-dark-800 border-2 border-dark-700 rounded-2xl px-6 py-5 text-white focus:border-gold-400 outline-none transition text-left ltr"
                                                        placeholder="4xxxxxxxx"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                                            <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/20 flex gap-4">
                                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 flex-shrink-0">
                                                    <Plane className="w-6 h-6" />
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-blue-400 font-black text-sm mb-1">مدة الشحن</p>
                                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">يصل الطلب خلال 7 إلى 12 يوم عمل من تاريخ الشراء من دبي.</p>
                                                </div>
                                            </div>
                                            <div className="bg-gold-500/5 p-6 rounded-3xl border border-gold-500/20 flex gap-4">
                                                <div className="w-12 h-12 bg-gold-400/10 rounded-2xl flex items-center justify-center text-gold-400 flex-shrink-0">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <div className="pt-1">
                                                    <p className="text-gold-400 font-black text-sm mb-1">سياسة الجدية</p>
                                                    <p className="text-xs text-gray-400 leading-relaxed font-medium">يتطلب الطلب دفع عربون رمزي لتأكيد الجدية قبل المباشرة بعملية الشراء.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="w-1/3 border-2 border-dark-600 text-gray-400 font-black py-5 rounded-[2rem] hover:bg-dark-700 hover:text-white transition active:scale-95"
                                            >
                                                الرجوع للتعديل
                                            </button>
                                            <button
                                                disabled={isSubmitting}
                                                onClick={handleSubmit}
                                                className="flex-1 bg-gold-gradient text-dark-900 font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-gold-500/20 flex items-center justify-center gap-3 text-xl active:scale-95"
                                            >
                                                {isSubmitting ? (
                                                    <><Loader2 className="w-6 h-6 animate-spin" /> جاري الربط بدبي...</>
                                                ) : (
                                                    <><Send className="w-6 h-6" /> إرسال الطلب العاجل ✈️</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="text-center py-10 animate-in zoom-in-95 duration-700">
                                        <div className="w-32 h-32 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-2 border-green-500/30 shadow-2xl shadow-green-500/10">
                                            <CheckCircle className="w-16 h-16 text-green-500" />
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black text-white mb-6">طلبك في سوق دبي الآن!</h3>
                                        <p className="text-gray-400 mb-10 max-w-lg mx-auto text-xl leading-relaxed">
                                            طلبك رقم <span className="text-gold-400 font-mono font-black decoration-double underline">#{requestId}</span> تم إرساله بنجاح لمكتبنا في دبي.
                                            <br />
                                            ترقب رسالة من فريقنا عبر الواتساب خلال الـ 24 ساعة القادمة.
                                        </p>

                                        <div className="bg-dark-900/50 p-8 rounded-[3rem] border-2 border-dark-700 mb-12 max-w-md mx-auto relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full -mr-12 -mt-12"></div>
                                            <p className="text-xs text-blue-400 font-black mb-4 uppercase tracking-[0.2em]">Current Status</p>
                                            <div className="flex items-center justify-center gap-3 text-2xl font-black text-gold-400">
                                                <Search className="w-8 h-8 animate-pulse text-amber-500" />
                                                <span>جاري البحث عـن طلبك</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link href="/" className="bg-gold-gradient text-dark-900 px-12 py-5 rounded-[2rem] font-black transition shadow-2xl shadow-gold-500/20 text-lg hover:scale-105 active:scale-95">
                                                العودة للمتجر
                                            </Link>
                                            <button
                                                onClick={() => setShowHistory(true)}
                                                className="bg-dark-700 hover:bg-dark-600 px-8 py-5 rounded-[2rem] font-black transition text-lg active:scale-95"
                                            >
                                                تتبع في السجل
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Secure Badge Bottom */}
                <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-8 h-8" />
                        <span className="text-sm font-black uppercase">Direct from Dubai</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-8 h-8" />
                        <span className="text-sm font-black uppercase">Global Standards</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8" />
                        <span className="text-sm font-black uppercase">Authenticity Guaranteed</span>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

function ShieldCheck({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
