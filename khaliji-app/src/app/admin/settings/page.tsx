'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Trash2, Globe, Truck, Layout, Shield, Download, Smartphone, HelpCircle, Bell } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useSettings } from '@/context/SettingsContext';
import { useOrders } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const { orders } = useOrders();
    const { products } = useProducts();
    const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'marketing' | 'security'>('general');

    // Form local states
    const [formData, setFormData] = useState({ ...settings });
    const [adminPassword, setAdminPassword] = useState('');
    const [adminEmail, setAdminEmail] = useState('');

    useEffect(() => {
        const savedEmail = localStorage.getItem('admin_email');
        if (savedEmail) {
            setAdminEmail(savedEmail);
        } else {
            setAdminEmail('admin@khaliji.com');
        }
    }, []);

    const handleSave = () => {
        updateSettings(formData);
        toast.success('تم حفظ التغييرات بنجاح');
    };

    const handlePasswordUpdate = () => {
        if (adminPassword.length < 8) {
            toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }
        localStorage.setItem('admin_password', adminPassword);
        toast.success('تم تحديث كلمة المرور بنجاح');
        setAdminPassword('');
    };

    const handleEmailUpdate = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(adminEmail)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        localStorage.setItem('admin_email', adminEmail);
        toast.success('تم تحديث البريد الإلكتروني للمسؤول بنجاح');
    };

    const exportToCSV = () => {
        if (orders.length === 0) {
            toast.error('لا توجد طلبات لتصديرها');
            return;
        }

        const headers = ["ID", "Customer", "Phone", "Total", "Status", "Date", "Address"];
        const rows = orders.map(o => [
            o.id,
            o.customerName,
            o.phone,
            o.total,
            o.status,
            new Date(o.createdAt).toLocaleDateString('en-GB'),
            `"${o.address}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Anaka_Orders_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('تم تصدير البيانات بنجاح بنسق CSV المتوافق مع Excel');
    };

    const tabs = [
        { id: 'general', label: 'المتجر العام', icon: Globe },
        { id: 'shipping', label: 'الشحن والتوصيل', icon: Truck },
        { id: 'marketing', label: 'الواجهة والعروض', icon: Layout },
        { id: 'security', label: 'الأمان والوصول', icon: Shield },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <Toaster position="top-center" richColors />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-white mb-2">إعدادات النظام</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Control Panel & Global Configurations</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-gold-gradient text-dark-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-gold-500/20 flex items-center gap-3 active:scale-95 transition-transform"
                >
                    <Save className="w-5 h-5" />
                    حفظ كافة الإعدادات
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-10 bg-dark-800 p-2 rounded-3xl border border-white/5 shadow-2xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-gold-500 text-dark-900 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid gap-8"
                >
                    {activeTab === 'general' && (
                        <div className="grid gap-8">
                            <section className="bg-dark-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                                    <Globe className="text-gold-400" /> هوية المتجر
                                </h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">اسم الموقع (SEO)</label>
                                        <input
                                            type="text"
                                            value={formData.storeName}
                                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                            className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">رابط شعار المحل (Logo URL)</label>
                                        <input
                                            type="text"
                                            value={formData.logoUrl || ''}
                                            placeholder="https://example.com/logo.png"
                                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                            className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">رقم الواتساب للاستلام</label>
                                        <input
                                            type="text"
                                            value={formData.whatsappNumber}
                                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                            className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">رقم البنكلي / غزة</label>
                                        <input
                                            type="text"
                                            value={formData.bankilyNumber}
                                            onChange={(e) => setFormData({ ...formData, bankilyNumber: e.target.value })}
                                            className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <section className="bg-dark-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                                <Truck className="text-gold-400" /> تكاليف ومواعيد التوصيل
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">سعر التوصيل (نواكشوط)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.shippingFee}
                                            onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                                            className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                        />
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold">UM</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">مدة شحن دبي المتوقعة</label>
                                    <input
                                        type="text"
                                        value={formData.dubaiShippingTime}
                                        onChange={(e) => setFormData({ ...formData, dubaiShippingTime: e.target.value })}
                                        className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'marketing' && (
                        <section className="bg-dark-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                                <Layout className="text-gold-400" /> إدارة العروض والواجهة
                            </h3>
                            <div className="space-y-10">
                                <div className="flex items-center justify-between p-6 bg-dark-900/50 rounded-3xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${formData.isSalesMode ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                                            <Bell className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">وضع التخفيضات (Sales Mode)</h4>
                                            <p className="text-xs text-gray-500 mt-1">عند تفعيله، سيتم تطبيق شارات "خصم" على جميع منتجات المتجر.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, isSalesMode: !formData.isSalesMode })}
                                        className={`w-16 h-8 rounded-full transition-all relative ${formData.isSalesMode ? 'bg-green-500' : 'bg-dark-700'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${formData.isSalesMode ? 'left-1' : 'left-9'}`}></div>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">إعلان الشريط العلوي (Top Bar)</label>
                                    <textarea
                                        rows={2}
                                        value={formData.topBarAnnouncement}
                                        onChange={(e) => setFormData({ ...formData, topBarAnnouncement: e.target.value })}
                                        className="w-full bg-dark-900 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none resize-none"
                                        placeholder="مثال: توصيل مجاني بمناسبة الافتتاح..."
                                    ></textarea>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <div className="grid gap-8">
                            <section className="bg-dark-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                                    <Shield className="text-gold-400" /> هويّة المسؤول (Admin Access)
                                </h3>

                                <div className="space-y-8">
                                    {/* Email Update Section */}
                                    <div className="bg-dark-900/50 p-6 rounded-3xl border border-white/5">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">البريد الإلكتروني للإدارة</label>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <input
                                                type="email"
                                                placeholder="admin@khaliji.com"
                                                value={adminEmail}
                                                onChange={(e) => setAdminEmail(e.target.value)}
                                                className="flex-1 bg-dark-800 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                            />
                                            <button
                                                onClick={handleEmailUpdate}
                                                className="bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-dark-900 font-bold px-8 py-4 rounded-2xl transition-all border border-gold-400/20"
                                            >
                                                تحديث الإيميل
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Update Section */}
                                    <div className="bg-dark-900/50 p-6 rounded-3xl border border-white/5">
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">كلمة سر الدخول الجديدة</label>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <input
                                                type="password"
                                                placeholder="أدخل كلمة المرور الجديدة (8 أحرف +)"
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                className="flex-1 bg-dark-800 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none"
                                            />
                                            <button
                                                onClick={handlePasswordUpdate}
                                                className="bg-dark-700 hover:bg-white hover:text-dark-900 text-white font-bold px-8 py-4 rounded-2xl transition-all border border-white/10"
                                            >
                                                تحديث كلمة المرور
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="bg-dark-800 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                                    <Download className="text-gold-400" /> تصدير البيانات والأرشيف
                                </h3>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gold-500/5 rounded-3xl border border-gold-500/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gold-gradient rounded-3xl flex items-center justify-center text-dark-900 shadow-xl shadow-gold-500/20">
                                            <Smartphone className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-lg">تصدير كافة الطلبات (Excel)</h4>
                                            <p className="text-sm text-gray-500 mt-1">قم بتحميل نسخة CSV متوافقة مع Excel لجميع مبيعاتك.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={exportToCSV}
                                        className="bg-gold-500 hover:bg-gold-400 text-dark-900 px-8 py-4 rounded-2xl font-black shadow-lg shadow-gold-500/20 flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" /> تصدير الآن
                                    </button>
                                </div>
                            </section>

                            <section className="bg-red-500/5 rounded-[2.5rem] p-10 border border-red-500/10 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-red-500 font-bold text-xl flex items-center gap-2">
                                            <Trash2 className="w-5 h-5" /> منطقة الخطر
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-2">حذف جميع المنتجات والطلبات وإعادة التطبيق للحالة الافتراضية.</p>
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('هل أنت متأكد؟ لا يمكن التراجع!')) localStorage.clear(); window.location.reload(); }}
                                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all border border-red-500/20"
                                    >
                                        تصفير التطبيق
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
