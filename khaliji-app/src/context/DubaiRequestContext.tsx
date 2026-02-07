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
    addRequest: (request: Omit<DubaiRequest, 'id' | 'status' | 'createdAt'> & { userId?: string }) => Promise<string>;
    updateRequestPrice: (id: string, price: number, shippingCost: number) => void;
    updateRequestStatus: (id: string, status: DubaiRequestStatus) => void;
    deleteRequest: (id: string) => void;
};

const DubaiRequestContext = createContext<DubaiRequestContextType | undefined>(undefined);

export function DubaiRequestProvider({ children }: { children: React.ReactNode }) {
    const [requests, setRequests] = useState<DubaiRequest[]>([]);

    // Fetch requests from API with Smart Sync
    const fetchRequests = async () => {
        try {
            const res = await fetch(`/api/dubai-requests?t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
            });
            if (res.ok) {
                const serverData = await res.json();

                setRequests(prev => {
                    // 1. If server is empty but we have local data, keep local and sync up
                    if (serverData.length === 0 && prev.length > 0) {
                        saveToServer(prev); // Background sync
                        return prev;
                    }

                    // 2. If server has data, trust it (or merge if needed)
                    // For now, simple check: if different, update
                    if (JSON.stringify(prev) !== JSON.stringify(serverData)) {
                        return serverData;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    useEffect(() => {
        // 1. Specify Local Storage Key
        const LOCAL_STORAGE_KEY = 'khaliji_dubai_requests_backup';

        // 2. Load from Local Storage immediately for instant visibility
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                setRequests(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse local requests", e);
            }
        }

        // 3. Fetch from Server
        fetchRequests();
        const intervalId = setInterval(fetchRequests, 2000);

        return () => clearInterval(intervalId);
    }, []);

    // 4. Save to Local Storage on every update
    useEffect(() => {
        if (requests.length > 0) {
            localStorage.setItem('khaliji_dubai_requests_backup', JSON.stringify(requests));
        }
    }, [requests]);

    const saveToServer = async (newRequests: DubaiRequest[]) => {
        try {
            const res = await fetch('/api/dubai-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequests),
            });
            if (!res.ok) throw new Error("Save failed");
            await fetchRequests();
            return true;
        } catch (error) {
            console.error('Failed to save to server', error);
            await fetchRequests(); // Rollback
            return false;
        }
    };

    const addRequest = async (data: Omit<DubaiRequest, 'id' | 'status' | 'createdAt'>) => {
        const newRequest: DubaiRequest = {
            ...data,
            id: `DXB-${Date.now().toString().slice(-6)}`,
            status: 'new',
            createdAt: new Date().toISOString()
        };
        const updated = [newRequest, ...requests];
        setRequests(updated);

        // Immediate Local Backup
        localStorage.setItem('khaliji_dubai_requests_backup', JSON.stringify(updated));

        await saveToServer(updated);
        return newRequest.id;
    };

    const updateRequestPrice = async (id: string, price: number, shippingCost: number) => {
        const updated = requests.map(r =>
            r.id === id ? { ...r, price, shippingCost, status: 'searching' as const } : r
        );
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests_backup', JSON.stringify(updated)); // Local Backup
        await saveToServer(updated);
    };

    const updateRequestStatus = async (id: string, status: DubaiRequestStatus) => {
        const updated = requests.map(r => r.id === id ? { ...r, status } : r);
        setRequests(updated);
        localStorage.setItem('khaliji_dubai_requests_backup', JSON.stringify(updated)); // Local Backup
        await saveToServer(updated);
    };

    const deleteRequest = async (id: string) => {
        const previous = [...requests];
        const updated = requests.filter(r => r.id !== id);

        // 1. Optimistic Update
        setRequests(updated);

        // 2. Remove from Local Storage Immediately
        localStorage.setItem('khaliji_dubai_requests_backup', JSON.stringify(updated));

        // 3. Try Server Delete
        const success = await saveToServer(updated);

        if (!success) {
            // Even if server fails (e.g. no internet), we keep local deletion valid for user experience
            // We only rollback if it's a critical logic error, but network error shouldn't undo user action locally
            console.warn("Server sync failed during delete, but kept local change.");
            // OPTIONAL: Restore if you want strict consistency:
            // setRequests(previous);
            // alert("فشل الحذف من السيرفر، لكن تم الحذف من جهازك");
        }
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
