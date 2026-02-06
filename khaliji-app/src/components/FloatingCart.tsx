'use client';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FloatingCart() {
    const { cartCount, items } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const [hasPerfume, setHasPerfume] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (cartCount > 0) {
            setShouldAnimate(true);
            const timer = setTimeout(() => setShouldAnimate(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    useEffect(() => {
        // Show after a short delay or if scrolled
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Check if cart contains perfumes for the reminder
        const perfumeInCart = items.some(item => {
            // This is a bit tricky without full product data, 
            // but we can assume based on the item name if needed or just show for all
            // For now, let's just use it as a general reminder
            return true;
        });
        setHasPerfume(perfumeInCart);
    }, [items]);

    if (cartCount === 0) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{
                        scale: shouldAnimate ? [1, 1.2, 1] : 1,
                        rotate: shouldAnimate ? [0, -10, 10, -10, 0] : 0,
                        opacity: 1,
                        y: 0
                    }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    className="fixed bottom-24 right-6 z-[60] group"
                >
                    {/* Reminder Nudge */}
                    {hasPerfume && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute bottom-full right-0 mb-4 w-48 bg-gold-gradient p-3 rounded-2xl shadow-xl border border-white/20 hidden group-hover:block"
                        >
                            <p className="text-dark-900 text-[10px] font-black text-center ltr">
                                لا تفوت الفرصة! قطعك المختارة تنتظرك في السلة ✨
                            </p>
                            <div className="absolute top-full right-6 w-3 h-3 bg-gold-500 rotate-45 -mt-1.5"></div>
                        </motion.div>
                    )}

                    <Link href="/cart">
                        <button className="relative w-16 h-16 bg-gold-gradient rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] flex items-center justify-center border-2 border-white/20 hover:scale-110 active:scale-90 transition-all group overflow-hidden">
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <ShoppingCart className="w-8 h-8 text-dark-900" />

                            {/* Badger */}
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="absolute -top-1 -left-1 w-7 h-7 bg-red-600 text-white text-xs font-black rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                            >
                                {cartCount}
                            </motion.span>

                            {/* Pulse effect */}
                            <div className="absolute inset-0 rounded-full animate-ping bg-gold-400/20 -z-10 group-hover:animate-none"></div>
                        </button>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
