'use client';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative pt-20 pb-16 sm:pb-24 overflow-hidden min-h-[80vh] flex items-center justify-center">
            {/* Background Gradient */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 opacity-90 z-10"></div>
                {/* We can add a background image here later */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615655406736-b37c4fabf923?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-base font-semibold text-gold-400 tracking-wide uppercase mb-4">الفخامة بين يديك</h2>
                    <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                        أرقـى تشكيـلات <br />
                        <span className="text-gold-gradient">العطور والساعات</span>
                    </h1>
                    <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-400 leading-relaxed">
                        وجهتك الأولى للماركات العالمية الأصلية في موريتانيا. <br />
                        نجمع بين الذوق الرفيع وخدمة التسوق الشخصي من دبي.
                    </p>
                </motion.div>

                <motion.div
                    className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <a href="/shop" className="px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-dark-900 bg-gold-400 hover:bg-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all transform hover:scale-105">
                        تسوق الآن
                    </a>
                    <a href="#dubai-service" className="px-8 py-4 border border-gold-400 text-lg font-bold rounded-lg text-gold-400 hover:bg-gold-400/10 transition-all">
                        طلب خاص من دبي
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
