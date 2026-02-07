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
    addProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
    updateProduct: (id: number, updatedData: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products from API
    const fetchProducts = async (): Promise<Product[]> => {
        try {
            const res = await fetch(`/api/products?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
                return data;
            }
            return products; // Return existing if fetch fails but network ok
        } catch (error) {
            console.error('Failed to fetch products', error);
            return products; // Fallback to current state
        }
    };

    // Initial fetch and Polling for Real-time Sync
    useEffect(() => {
        fetchProducts();

        // Poll every 2 seconds to keep data in sync across devices
        const intervalId = setInterval(fetchProducts, 2000);

        return () => clearInterval(intervalId);
    }, []);

    const saveToServer = async (newProducts: Product[]): Promise<boolean> => {
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProducts),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'فشل الاتصال بقاعدة البيانات');
            }

            // Server confirmed save. Now update UI sources.
            return true;
        } catch (error) {
            console.error('Server Sync Error:', error);
            // Re-throw to be handled by the caller UI
            throw error;
        }
    };

    const addProduct = async (product: Omit<Product, 'id'>) => {
        // 1. Get fresh data first to ensure we don't overwrite others' work
        const currentProducts = await fetchProducts();

        // 2. Prepare new list
        const newProduct = { ...product, id: Date.now() };
        const updated = [newProduct, ...currentProducts];

        // 3. Send to Server (Wait for it!)
        try {
            await saveToServer(updated);
            // 4. Update UI only after success
            setProducts(updated);
            return true;
        } catch (e) {
            console.error("Add failed", e);
            throw e; // Let the UI show the error
        }
    };

    const updateProduct = async (id: number, updatedData: Partial<Product>) => {
        const currentProducts = await fetchProducts();
        const updated = currentProducts.map(p => p.id === id ? { ...p, ...updatedData } : p);

        try {
            await saveToServer(updated);
            setProducts(updated);
        } catch (e) {
            console.error("Update failed", e);
            throw e;
        }
    };

    const deleteProduct = async (id: number) => {
        // 1. Get fresh data
        const currentProducts = await fetchProducts(); // Ensure we delete from latest version

        // 2. Validate existence
        if (!currentProducts.find(p => p.id === id)) {
            throw new Error("المنتج غير موجود أو تم حذفه مسبقاً");
        }

        // 3. Prepare new list
        const updated = currentProducts.filter(p => p.id !== id);

        // 4. Send to Server (Wait!)
        try {
            await saveToServer(updated);
            // 5. Update UI only after success
            setProducts(updated);
        } catch (e) {
            console.error("Delete failed", e);
            throw new Error("فشل الحذف من قاعدة البيانات. يرجى التحقق من الإنترنت المحاولة مرة أخرى.");
        }
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
