import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Truck, Star } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-24">
                <h1 className="text-4xl font-extrabold text-gold-gradient mb-8 text-center">عن أناقة الخليج</h1>

                <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 mb-12">
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                        نحن في "أناقة الخليج" نفخر بأن نكون وجهتكم الأولى للفخامة في موريتانيا. تأسس متجرنا انطلاقاً من شغفنا بتقديم أرقى المنتجات العالمية للسوق المحلي، حيث نجمع بين الأصالة والحداثة.
                    </p>
                    <p className="text-lg text-gray-300 leading-relaxed">
                        رسالتنا هي توفير تجربة تسوق استثنائية تليق بذوقكم الرفيع، سواء من خلال تشكيلتنا المتوفرة محلياً أو عبر خدمة الطلب الخاص المميزة من دبي.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center">
                        <ShieldCheck className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">منتجات أصلية 100%</h3>
                        <p className="text-gray-400 text-sm">نضمن لكم جودة وأصالة جميع منتجاتنا، حيث نستوردها مباشرة من المصادر الموثوقة.</p>
                    </div>
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center">
                        <Truck className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">شحن سريع وآمن</h3>
                        <p className="text-gray-400 text-sm">توصيل فوري داخل نواكشوط، وخدمات شحن جوي سريع للطلبات الخاصة من دبي.</p>
                    </div>
                    <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 text-center">
                        <Star className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">خدمة عملاء VIP</h3>
                        <p className="text-gray-400 text-sm">فريقنا جاهز دائماً لخدمتكم والإجابة على استفساراتكم عبر الواتساب على مدار الساعة.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
