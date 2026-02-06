import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, MapPin, Mail, MessageCircle, Facebook } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-24">
                <h1 className="text-4xl font-extrabold text-gold-gradient mb-8 text-center">اتصل بنا</h1>
                <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
                    نسعد دائماً بخدمتكم. يمكنكم التواصل معنا عبر القنوات التالية لأي استفسار أو طلب خاص.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <a href="tel:41069964" className="block group">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 group-hover:border-gold-500/50 transition flex flex-col items-center text-center h-full">
                            <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Phone className="w-6 h-6 text-gold-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">إتصال هاتفى</h3>
                            <span className="text-sm font-mono dir-ltr font-bold text-gold-400 group-hover:text-white transition">41069964</span>
                        </div>
                    </a>

                    <a href="https://wa.me/22241069964" target="_blank" className="block group">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 group-hover:border-green-500/50 transition flex flex-col items-center text-center h-full">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <MessageCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">واتساب</h3>
                            <span className="text-sm font-mono dir-ltr font-bold text-gold-400 group-hover:text-white transition">41069964</span>
                        </div>
                    </a>

                    <a href="https://www.facebook.com/profile.php?id=61586194517512" target="_blank" className="block group">
                        <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 group-hover:border-blue-500/50 transition flex flex-col items-center text-center h-full">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                <Facebook className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">فيسبوك</h3>
                            <span className="text-xs text-gray-400">تابعنا لكل جديد</span>
                        </div>
                    </a>

                    <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 flex flex-col items-center text-center h-full">
                        <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-gold-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">موقعنا</h3>
                        <div className="text-sm text-gray-400">
                            نواكشوط، موريتانيا
                        </div>
                    </div>
                </div>

                {/* Promotional Facebook Button */}
                <div className="mt-12 text-center">
                    <a
                        href="https://www.facebook.com/profile.php?id=61586194517512"
                        target="_blank"
                        className="inline-flex items-center gap-4 bg-dark-800 border border-dark-700 hover:border-blue-500/50 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
                    >
                        <Facebook className="w-6 h-6 text-blue-500 group-hover:scale-110 transition" />
                        <span>تابعنا على فيسبوك لمشاهدة جديد العطور والساعات</span>
                    </a>
                </div>
            </div>

            <Footer />
        </main>
    );
}
