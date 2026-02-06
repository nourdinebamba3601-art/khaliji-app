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

    // Fetch requests from API
    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/dubai-requests?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Pragma': 'no-cache',
                    'Cache-Control': 'no-cache'
                }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(prev => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    useEffect(() => {
        fetchRequests();
        const intervalId = setInterval(fetchRequests, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const saveToServer = async (newRequests: DubaiRequest[]) => {
        try {
            await fetch('/api/dubai-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequests),
            });
            await fetchRequests();
        } catch (error) {
            console.error('Failed to save to server', error);
        }
    };

    const addRequest = (data: Omit<DubaiRequest, 'id' | 'status' | 'createdAt'>) => {
        const newRequest: DubaiRequest = {
            ...data,
            id: `DXB-${Date.now().toString().slice(-6)}`,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        const updated = [newRequest, ...requests];
        setRequests(updated);
        saveToServer(updated);
        return newRequest.id;
    };

    const updateRequestPrice = (id: string, price: number, shippingCost: number) => {
        const updated = requests.map(r =>
            r.id === id ? { ...r, price, shippingCost, status: 'searching' as const } : r
        );
        setRequests(updated);
        saveToServer(updated);
    };

    const updateRequestStatus = (id: string, status: DubaiRequestStatus) => {
        const updated = requests.map(r => r.id === id ? { ...r, status } : r);
        setRequests(updated);
        saveToServer(updated);
    };

    const deleteRequest = (id: string) => {
        const updated = requests.filter(r => r.id !== id);
        setRequests(updated);
        saveToServer(updated);
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
