'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [productName, setProductName] = useState('');

    // Auto-detect product name if on a product page
    useEffect(() => {
        // Check if we are on a product page logic
        // This is a simple improvement. In a real app we might fetch the product from context or URL ID
        if (pathname.includes('/products/')) {
            // Just a placeholder message improvement
            setProductName('هذا المنتج');
        } else {
            setProductName('');
        }
    }, [pathname]);

    const PHONE_NUMBER = "41069964";

    const handleWhatsAppClick = () => {
        let message = "أهلاً أناقة الخليج، أريد الاستفسار";
        if (productName) {
            message += ` بخصوص ${productName}`;
        } else if (pathname === '/cart') {
            message += " بخصوص طلبي في السلة";
        } else if (pathname === '/dubai-request') {
            message += " بخصوص خدمة الطلب من دبي";
        }

        const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-4">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
                        className="glass-gold p-5 rounded-[2rem] shadow-2xl mb-4 w-72 border border-gold-400/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gold-400 transition-colors bg-dark-900/50 p-1 rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center text-dark-900 shadow-lg shadow-gold-500/20">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">خدمة العملاء</h4>
                                <p className="text-[10px] text-gold-400 font-black uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
                                    متصل الآن
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                            مرحباً بك في <span className="text-gold-400 font-bold">أناقة الخليج</span>. كيف يمكننا مساعدتك اليوم في اختيار عطرك أو ساعتك المفضلة؟
                        </p>

                        <button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-gold-gradient hover:opacity-90 text-dark-900 font-black py-3 rounded-xl text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-gold-500/10"
                        >
                            <MessageCircle className="w-5 h-5" />
                            بدء المحادثة الفورية
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-green-600 to-green-400 text-white rounded-full shadow-lg hover:shadow-green-500/50 transition-shadow duration-300"
                animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 30, // Shake every 30 seconds
                    ease: "easeInOut"
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageCircle className="w-7 h-7" />

                {/* Notification Dot */}
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-900 animate-pulse"></span>

                {/* Tooltip on Hover */}
                <span className="absolute left-full ml-3 px-3 py-1 bg-dark-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -translate-x-2 group-hover:translate-x-0 hidden md:block border border-dark-700">
                    تحدث معنا
                </span>
            </motion.button>
        </div>
    );
}
