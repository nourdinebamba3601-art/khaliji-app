import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-24">
                <h1 className="text-3xl font-bold text-white mb-8">الشروط والأحكام</h1>

                <div className="space-y-8 text-gray-300">
                    <section>
                        <h2 className="text-xl font-bold text-gold-400 mb-4">1. مقدمة</h2>
                        <p>مرحباً بكم في متجر أناقة الخليج. باستخادمكم لهذا الموقع، فإنكم توافقون على الالتزام بالشروط والأحكام التالية.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gold-400 mb-4">2. المنتجات والطلبات</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>جميع المنتجات المعروضة تخضع لتوفر المخزون.</li>
                            <li>نحتفظ بالحق في تعديل الأسعار في أي وقت دون إشعار مسبق.</li>
                            <li>بالنسبة لطلبات "دبي"، يتم تحديد مدة الشحن المتوقعة عند الطلب، وقد تتأثر بظروف الشحن الجوي.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gold-400 mb-4">3. أصالة المنتجات</h2>
                        <p>نحن نتعهد بأن جميع المنتجات المعروضة في متجرنا أصلية 100%، وتم استيرادها من وكلاء معتمدين أو متاجر رسمية.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gold-400 mb-4">4. سياسة الاسترجاع والاستبدال</h2>
                        <p>يمكن استرجاع أو استبدال المنتجات المحلية خلال 3 أيام من الشراء بشرط أن تكون بحالتها الأصلية وغير مستخدمة. المنتجات المطلوبة خصيصاً من دبي لا يمكن إرجاعها إلا في حال وجود عيب مصنعي.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gold-400 mb-4">5. التواصل</h2>
                        <p>لأي استفسارات، يرجى التواصل معنا عبر الواتساب على الرقم: 41069964.</p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
