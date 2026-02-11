'use client';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

export type OrderItem = {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    source: 'local' | 'dubai';
};

export type Order = {
    id: string;
    customerName: string;
    phone: string;
    address: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'contacted' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
    source: 'local' | 'dubai';
    userId?: string; // Add userId for privacy filtering
};

type OrderContextType = {
    orders: Order[];
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<string>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const { user, isAdminLogged } = useAuth();

    // Optimization: Memoize the filtered list to prevent heavy re-calculates
    const orders = useMemo(() => {
        const filtered = isAdminLogged
            ? allOrders
            : allOrders.filter(o => o.userId === user?.id);

        return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [allOrders, user?.id, isAdminLogged]);

    // Fetch orders with Smart Sync
    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (res.ok) {
                const serverData = await res.json();

                setAllOrders(prev => {
                    // Smart Sync: If server is empty/lost but we have local data, re-upload local data
                    if (serverData.length === 0 && prev.length > 0) {
                        // We do this silently in background
                        fetch('/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(prev),
                        }).catch(err => console.error("Background sync failed", err));

                        return prev; // Keep local data
                    }

                    // Normal Sync: Trust server if it has data
                    if (JSON.stringify(prev) !== JSON.stringify(serverData)) {
                        return serverData;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    // 1. Initial Load & Sync
    useEffect(() => {
        // Load from LocalStorage immediately
        const saved = localStorage.getItem('khaliji_orders_backup');
        if (saved) {
            try {
                setAllOrders(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse local orders", e);
            }
        }

        // Start Server Sync
        fetchOrders();
        const intervalId = setInterval(fetchOrders, 3000); // Poll every 3s
        return () => clearInterval(intervalId);
    }, []);

    // 2. Persist to LocalStorage on every change
    useEffect(() => {
        if (allOrders.length > 0) {
            localStorage.setItem('khaliji_orders_backup', JSON.stringify(allOrders));
        }
    }, [allOrders]);

    const saveToServer = async (newOrders: Order[]) => {
        try {
            await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrders),
            });
            await fetchOrders();
        } catch (error) {
            console.error('Failed to save to server', error);
        }
    };

    const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<string> => {
        // Create new order object
        const newOrder: Order = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            customerName: orderData.customerName,
            phone: orderData.phone,
            address: orderData.address,
            items: orderData.items,
            total: orderData.total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            source: (orderData as any).source || 'local',
            userId: (orderData as any).userId || user?.id,
        };

        // Optimistic UI Update
        const updated = [newOrder, ...allOrders];
        setAllOrders(updated);

        // Save to Server (Critical)
        try {
            await saveToServer(updated);
            return newOrder.id;
        } catch (error) {
            // Rollback if server fails
            setAllOrders(allOrders);
            throw new Error('فشل إرسال الطلب للسيرفر، يرجى المحاولة مرة أخرى');
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        const originalOrders = [...allOrders];
        const updated = allOrders.map(o => o.id === id ? { ...o, status } : o);
        setAllOrders(updated);

        try {
            await saveToServer(updated);
        } catch (error) {
            console.error("Failed to update status", error);
            setAllOrders(originalOrders); // Rollback
            throw new Error('فشل تحديث الحالة');
        }
    };

    const deleteOrder = async (id: string) => {
        const originalOrders = [...allOrders];
        const updated = allOrders.filter(o => o.id !== id);
        setAllOrders(updated);

        try {
            await saveToServer(updated);
        } catch (error) {
            console.error("Failed to delete order", error);
            setAllOrders(originalOrders); // Rollback
            throw new Error('فشل حذف الطلب');
        }
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
