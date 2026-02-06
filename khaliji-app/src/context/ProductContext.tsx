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

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            // Add timestamp to prevent browser caching
            const res = await fetch(`/api/products?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const data = await res.json();
                // Only update if data is different to avoid unnecessary re-renders (simple check)
                setProducts(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    // Initial fetch and Polling for Real-time Sync
    useEffect(() => {
        fetchProducts();

        // Poll every 2 seconds to keep data in sync across devices
        const intervalId = setInterval(fetchProducts, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const saveToServer = async (newProducts: Product[]) => {
        try {
            await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProducts),
            });
            // Immediately re-fetch to ensure consistency
            await fetchProducts();
        } catch (error) {
            console.error('Failed to save to server', error);
        }
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: Date.now() };
        const updated = [newProduct, ...products];
        setProducts(updated); // Optimistic update
        saveToServer(updated);
    };

    const updateProduct = (id: number, updatedData: Partial<Product>) => {
        const updated = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
        setProducts(updated); // Optimistic update
        saveToServer(updated);
    };

    const deleteProduct = (id: number) => {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated); // Optimistic update
        saveToServer(updated);
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
