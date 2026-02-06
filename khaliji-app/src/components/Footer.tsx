import { Phone, MessageCircle, MapPin, Facebook, ShieldCheck } from 'lucide-react';

export default function Footer() {
    const FB_LINK = "https://www.facebook.com/profile.php?id=61586194517512";

    return (
        <footer className="bg-dark-900 border-t border-dark-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-bold text-gold-gradient mb-6 font-tajawal">أناقة الخليج</h2>
                        <p className="text-gray-400 max-w-sm leading-relaxed">
                            متجرك الأول للفخامة في موريتانيا. نقدم أرقى أنواع العطور، الساعت، والنظارات من أشهر الماركات العالمية، بالإضافة لخدمة الطلب المباشر من دبي.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <a href="https://wa.me/22241069964" target="_blank" className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg active:scale-95">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a href={FB_LINK} target="_blank" className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-lg active:scale-95">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">روابط سريعة</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="/" className="hover:text-gold-400 transition text-sm">الرئيسية</a></li>
                            <li><a href="/shop" className="hover:text-gold-400 transition text-sm">المنتجات</a></li>
                            <li><a href="/account" className="hover:text-gold-400 transition text-sm">طلباتي</a></li>
                            <li><a href="/terms" className="hover:text-gold-400 transition text-sm">الشروط والأحكام</a></li>
                            <li><a href="/contact" className="hover:text-gold-400 transition text-sm">اتصل بنا</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">تواصل معنا</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gold-400" />
                                <a href="tel:41069964" className="hover:text-white ltr text-sm">41069964</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MessageCircle className="w-4 h-4 text-green-400" />
                                <a href="https://wa.me/22241069964" target="_blank" className="hover:text-white ltr text-sm">41069964 (واتساب)</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-red-400" />
                                <span className="text-sm">نواكشوط، موريتانيا</span>
                            </li>
                            <li className="mt-6 pt-6 border-t border-dark-800">
                                <span className="flex items-center gap-2 text-gold-400 font-black text-[10px] uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4" />
                                    منتجات أصلية 100%
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>


                <div className="border-t border-dark-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2026 أناقة الخليج. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
}
