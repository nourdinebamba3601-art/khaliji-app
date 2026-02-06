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

    useEffect(() => {
        const saved = localStorage.getItem('khaliji_orders');
        if (saved) {
            setAllOrders(JSON.parse(saved));
        }

        // Real-time synchronization for same-origin tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'khaliji_orders' && e.newValue) {
                setAllOrders(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Optimization: Memoize the filtered list to prevent heavy re-calculates
    const orders = useMemo(() => {
        const filtered = isAdminLogged
            ? allOrders
            : allOrders.filter(o => o.userId === user?.id); // Guests see nothing from global state unless we track session ID, which strictly isolates their view.

        return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [allOrders, user?.id, isAdminLogged]);



    const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Date.now().toString().slice(-6)}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
            userId: orderData.userId || user?.id // Prioritize explicit userId
        };

        const updated = [newOrder, ...allOrders];
        setAllOrders(updated);
        localStorage.setItem('khaliji_orders', JSON.stringify(updated));

        // Dispatch event for other listeners in same tab
        window.dispatchEvent(new Event('storage'));

        return newOrder.id;
    };


    const updateOrderStatus = (id: string, status: Order['status']) => {
        const updated = allOrders.map(o => o.id === id ? { ...o, status } : o);
        setAllOrders(updated);
        localStorage.setItem('khaliji_orders', JSON.stringify(updated));
    };

    const deleteOrder = (id: string) => {
        const updated = allOrders.filter(o => o.id !== id);
        setAllOrders(updated);
        localStorage.setItem('khaliji_orders', JSON.stringify(updated));
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
