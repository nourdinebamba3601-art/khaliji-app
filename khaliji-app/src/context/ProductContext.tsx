'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type Product = {
    id: number;
    name: string;
    nameEn?: string;
    brand?: string;
    description: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    category: string;
    source: 'local' | 'dubai';
    shippingDuration?: string;
    images: string[];
    specs?: any;
    isBestSeller?: boolean;
    salesCount?: number;
    // Glasses specific fields
    gender?: 'men' | 'women' | 'unisex';
    lensType?: 'sun' | 'medical';
    frameMaterial?: 'metal' | 'plastic';
    frameShape?: 'round' | 'square' | 'aviator' | 'cat-eye' | 'other';
    hasFullSet?: boolean; // Box and warranty
    // Watch specific fields
    watchMovement?: 'automatic' | 'quartz';
    strapMaterial?: 'metal' | 'leather' | 'rubber' | 'other';
    caseMaterial?: string;
    // Perfume specific fields
    perfumeLongevity?: 'long' | 'medium' | 'high';
    perfumeVolume?: '50ml' | '100ml' | 'others';
    perfumeScent?: string; // e.g. "oud, woody, fruity"
    videoUrl?: string; // Base64 or external link
};

type ProductContextType = {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, updatedData: Partial<Product>) => void;
    deleteProduct: (id: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('khaliji_products');
        if (saved) {
            setProducts(JSON.parse(saved));
        } else {
            // Initial Mock Data to start with if empty
            setProducts([
                {
                    id: 1,
                    name: "عطر العود الملكي",
                    brand: "الرصاصي",
                    description: "عطر مميز جداً للمناسبات الرسمية، يجمع بين عبق الشرق وفخامة التصميم.",
                    price: 18000,
                    quantity: 10,
                    category: "perfumes",
                    source: "local",
                    images: ["https://images.unsplash.com/photo-1594035910387-fea4779426e9?w=800&auto=format&fit=crop"],
                    isBestSeller: true,
                    salesCount: 120,
                    gender: "men",
                    perfumeLongevity: "high",
                    perfumeVolume: "100ml",
                    perfumeScent: "عود ملکی، أخشاب دافئة"
                },
                {
                    id: 2,
                    name: "رولكس دايتونا",
                    brand: "Rolex",
                    description: "ساعة فاخرة طلب خاص، تجسيد للأناقة والدقة العالمية.",
                    price: 450000,
                    quantity: 1,
                    category: "watches",
                    source: "dubai",
                    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop"]
                },
                {
                    id: 3,
                    name: "ساعة أوميغا سيمستر",
                    brand: "Omega",
                    description: "تصميم كلاسيكي يجمع بين القوة والأناقة، متوفرة الآن في محلنا.",
                    price: 250000,
                    quantity: 3,
                    category: "watches",
                    source: "local",
                    images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop"],
                    isBestSeller: true,
                    salesCount: 45
                },
                {
                    id: 4,
                    name: "عطر ليبر من إيف سام لوران",
                    brand: "YSL",
                    description: "عطر الأنوثة والحرية، متوفر للطلب الخاص من دبي.",
                    price: 22000,
                    quantity: 5,
                    category: "perfumes",
                    source: "dubai",
                    shippingDuration: "7 أيام",
                    images: ["https://images.unsplash.com/photo-1583467875263-d50dec37a88c?w=800&auto=format&fit=crop"],
                    isBestSeller: true,
                    salesCount: 85,
                    gender: "women",
                    perfumeLongevity: "high",
                    perfumeVolume: "50ml",
                    perfumeScent: "زهور بيضاء، فواكه منعشة"
                },
                {
                    id: 5,
                    name: "نظارة ري بان كلاسيك",
                    brand: "Ray-Ban",
                    description: "نظارة شمسية كلاسيكية توفر حماية كاملة من الأشعة فوق البنفسجية.",
                    price: 8500,
                    quantity: 15,
                    category: "glasses",
                    source: "local",
                    images: ["https://images.unsplash.com/photo-1511499767350-a1590fdb2e17?w=800&auto=format&fit=crop"],
                    gender: "unisex",
                    lensType: "sun",
                    frameShape: "aviator",
                    hasFullSet: true
                },
                {
                    id: 6,
                    name: "نظارة كارتييه سانتوس",
                    brand: "Cartier",
                    description: "فخامة لا تضاهى مع إطار معدني مطلي بالذهب، متوفرة لطلب خاص.",
                    price: 32000,
                    quantity: 1,
                    category: "glasses",
                    source: "dubai",
                    shippingDuration: "5 أيام",
                    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop"],
                    gender: "men",
                    lensType: "sun",
                    frameShape: "square",
                    hasFullSet: true
                }
            ]);
        }
    }, []);

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: Date.now() };
        const updated = [newProduct, ...products];
        setProducts(updated);
        localStorage.setItem('khaliji_products', JSON.stringify(updated));
    };

    const updateProduct = (id: number, updatedData: Partial<Product>) => {
        const updated = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
        setProducts(updated);
        localStorage.setItem('khaliji_products', JSON.stringify(updated));
    };

    const deleteProduct = (id: number) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem('khaliji_products', JSON.stringify(updated));
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
