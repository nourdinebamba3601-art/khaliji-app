'use client';

import { Camera, Send, FileCheck, MessageCircle } from 'lucide-react';

export default function DubaiService() {
    return (
        <section id="dubai-service" className="relative py-24 bg-dark-800 border-t border-gold-400/10 overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

                    <div className="mb-12 lg:mb-0">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-400 text-sm font-bold mb-6">
                            خدمة VIP حصرية
                        </div>
                        <h2 className="text-4xl font-extrabold text-white sm:text-5xl mb-6 leading-tight">
                            تسوّق مباشرة من <br />
                            <span className="text-gold-gradient">أسواق دبي العالمية</span>
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                            هل تبحث عن منتج معين غير متوفر في الأسواق المحلية؟ <br />
                            نحن جسرك إلى دبي! نوفر لك أي منتج من الوكلاء الرسميين مع ضمان الأصالة، ونشحنه لك حتى باب منزلك في موريتانيا.
                        </p>

                        <ul className="space-y-6 mb-10">
                            {[
                                { icon: Camera, text: "أرسل صورة المنتج أو رابطه عبر التطبيق" },
                                { icon: FileCheck, text: "نرسل لك عرض سعر شامل الشحن والجمارك" },
                                { icon: Send, text: "يصلك المنتج الأصلي 100% خلال أيام" }
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/20">
                                        <item.icon className="h-5 w-5 text-gold-400" />
                                    </div>
                                    <p className="mr-4 text-lg text-gray-200 mt-2">{item.text}</p>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => {
                                const message = encodeURIComponent("أهلاً أناقة الخليج، أريد الاستفسار بخصوص خدمة الطلب من دبي");
                                window.open(`https://wa.me/41069964?text=${message}`, '_blank');
                            }}
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-dark-900 bg-gold-500 hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20 gap-2"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span>ابدأ طلب خاص الآن</span>
                        </button>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/3] rounded-3xl bg-dark-700/50 border border-gold-400/10 overflow-hidden relative shadow-2xl">
                            {/* Placeholder for Service Image */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-dark-900/80 to-transparent z-10"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-gold-400/20 text-9xl font-bold opacity-20 rotate-12">DUBAI</span>
                            </div>
                            {/* Mock UI Element */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl z-20 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gold-400 flex items-center justify-center">
                                        <span className="text-xl font-bold text-dark-900">VIP</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">حالة الطلب</p>
                                        <p className="text-lg font-bold text-white">جاري الشحن من دبي ✈️</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
