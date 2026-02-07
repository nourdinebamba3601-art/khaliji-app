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
    addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    deleteOrder: (id: string) => void;
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

    // Fetch orders from API
    const fetchOrders = async () => {
        try {
            const res = await fetch(`/api/orders?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                setAllOrders(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) return data;
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling every 5 seconds for new orders
        const intervalId = setInterval(fetchOrders, 5000);
        return () => clearInterval(intervalId);
    }, []);

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

    const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Date.now().toString().slice(-6)}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            userId: orderData.userId || user?.id,
            source: 'local' // Default source
        };

        const updated = [newOrder, ...allOrders];
        setAllOrders(updated);
        saveToServer(updated);

        return newOrder.id;
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        const updated = allOrders.map(o => o.id === id ? { ...o, status } : o);
        setAllOrders(updated);
        saveToServer(updated);
    };

    const deleteOrder = (id: string) => {
        const updated = allOrders.filter(o => o.id !== id);
        setAllOrders(updated);
        saveToServer(updated);
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
