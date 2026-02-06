'use client';
import { createContext, useContext, useState, useEffect } from 'react';

export type DubaiRequestStatus = 'new' | 'searching' | 'purchased' | 'shipping' | 'ready' | 'cancelled';

export type DubaiRequest = {
    id: string;
    customerName: string;
    phone: string;
    productName: string;
    productDescription: string;
    productLink?: string; // NEW
    budget?: string;      // NEW
    image: string;
    status: DubaiRequestStatus;
    price?: number;
    shippingCost?: number;
    createdAt: string;
    userId?: string;
};

type DubaiRequestContextType = {
    requests: DubaiRequest[];
    addRequest: (request: Omit<DubaiRequest, 'id' | 'status' | 'createdAt'> & { userId?: string }) => string;
    updateRequestPrice: (id: string, price: number, shippingCost: number) => void;
    updateRequestStatus: (id: string, status: DubaiRequestStatus) => void;
    deleteRequest: (id: string) => void;
};

const DubaiRequestContext = createContext<DubaiRequestContextType | undefined>(undefined);

export function DubaiRequestProvider({ children }: { children: React.ReactNode }) {
    const [requests, setRequests] = useState<DubaiRequest[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('khaliji_dubai_requests');
        if (saved) {
            setRequests(JSON.parse(saved));
        }
    }, []);

    const addRequest = (data: Omit<DubaiRequest, 'id' | 'status' | 'createdAt'>) => {
        const newRequest: DubaiRequest = {
            ...data,
            id: `DXB-${Date.now().toString().slice(-6)}`,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        const updated = [newRequest, ...requests];
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests', JSON.stringify(updated));
        return newRequest.id;
    };

    const updateRequestPrice = (id: string, price: number, shippingCost: number) => {
        const updated = requests.map(r =>
            r.id === id ? { ...r, price, shippingCost, status: 'searching' as const } : r
        );
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests', JSON.stringify(updated));
    };

    const updateRequestStatus = (id: string, status: DubaiRequestStatus) => {
        const updated = requests.map(r => r.id === id ? { ...r, status } : r);
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests', JSON.stringify(updated));
    };

    const deleteRequest = (id: string) => {
        const updated = requests.filter(r => r.id !== id);
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests', JSON.stringify(updated));
    };

    return (
        <DubaiRequestContext.Provider value={{ requests, addRequest, updateRequestPrice, updateRequestStatus, deleteRequest }}>
            {children}
        </DubaiRequestContext.Provider>
    );
}

export function useDubaiRequests() {
    const context = useContext(DubaiRequestContext);
    if (context === undefined) {
        throw new Error('useDubaiRequests must be used within a DubaiRequestProvider');
    }
    return context;
}
