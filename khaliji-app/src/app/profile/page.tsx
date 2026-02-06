'use client';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, MapPin, Phone, LogOut, ShieldCheck, ChevronLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function ProfilePage() {
    const { user, updateProfile, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    if (!user) {
        return (
            <main className="min-h-screen bg-dark-900 flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول</h1>
                    <a href="/shop" className="text-gold-400 underline">الذهاب للمتجر</a>
                </div>
            </main>
        );
    }

    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        toast.success('تم تحديث البيانات بنجاح');
    };

    return (
        <main className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <Toaster position="top-center" richColors />

            <div className="max-w-4xl mx-auto px-4 py-32 text-right">
                <div className="mb-12 flex flex-row-reverse justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-black mb-2">الملف الشخصي</h1>
                        <p className="text-gray-500">إدارة بياناتك الشخصية وعناوين التوصيل</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition font-bold"
                    >
                        تسجيل الخروج
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Sidebar: Security Status */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-dark-800 p-6 rounded-3xl border border-dark-700 text-center">
                            <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-400/20">
                                <ShieldCheck className="w-10 h-10 text-gold-400" />
                            </div>
                            <h3 className="font-bold text-white mb-2">نظام الخصوصية نشط</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                بياناتك مشفرة ومؤمنة تماماً. لا يمكن لأي مستخدم آخر رؤية طلباتك أو معلوماتك الشخصية.
                            </p>
                        </div>
                        <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">معرف المستخدم</p>
                            <code className="text-blue-400 font-mono text-xs">{user.id}</code>
                        </div>
                    </div>

                    {/* Right Main Panel: Edit Profile */}
                    <div className="md:col-span-2">
                        <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-dark-700 flex flex-row-reverse justify-between items-center">
                                <h2 className="text-xl font-bold flex items-center gap-2 flex-row-reverse">
                                    <User className="w-5 h-5 text-gold-400" />
                                    المعلومات الشخصية
                                </h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-gold-400 text-sm font-bold hover:underline"
                                    >
                                        تعديل البيانات
                                    </button>
                                )}
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block pr-1">الاسم بالكامل</label>
                                        <div className="relative">
                                            <input
                                                disabled={!isEditing}
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none transition disabled:opacity-50 text-right pr-6"
                                            />
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block pr-1">رقم الهاتف (واتساب)</label>
                                        <div className="relative">
                                            <input
                                                disabled={!isEditing}
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none transition disabled:opacity-50 text-right pr-6"
                                            />
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-widest block pr-1">عنوان التوصيل الافتراضي</label>
                                        <div className="relative">
                                            <textarea
                                                disabled={!isEditing}
                                                rows={3}
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-6 py-4 text-white focus:border-gold-400 outline-none transition disabled:opacity-50 text-right pr-6"
                                            />
                                            <MapPin className="absolute left-6 top-6 w-5 h-5 text-gray-600" />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex flex-row-reverse gap-4 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="bg-gold-500 text-dark-900 px-8 py-3 rounded-xl font-black hover:bg-gold-400 transition flex items-center gap-2"
                                        >
                                            حفظ التعديلات
                                            <Save className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="bg-dark-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-dark-600 transition"
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
