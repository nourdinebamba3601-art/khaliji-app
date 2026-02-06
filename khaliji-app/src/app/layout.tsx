import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';
import { OrderProvider } from '@/context/OrderContext';
import { DubaiRequestProvider } from '@/context/DubaiRequestContext';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import FloatingCart from '@/components/FloatingCart';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: 'أناقة الخليج | الاناقة و الفخامة',
  description: 'متجر أناقة الخليج للعطور والساعات والنظارات الفاخرة.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: '#0a0a0a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'أناقة الخليج',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-tajawal bg-dark-900 text-white`}>
        <AuthProvider>
          <SettingsProvider>
            <ProductProvider>
              <DubaiRequestProvider>
                <OrderProvider>
                  <CartProvider>
                    {children}
                    <WhatsAppButton />
                    <FloatingCart />
                  </CartProvider>
                </OrderProvider>
              </DubaiRequestProvider>
            </ProductProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

