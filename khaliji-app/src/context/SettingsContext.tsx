'use client';

import { createContext, useContext, useState, useEffect } from 'react';

export type Settings = {
    storeName: string;
    logoUrl?: string;
    whatsappNumber: string;
    bankilyNumber: string;
    shippingFee: number;
    dubaiShippingTime: string;
    isSalesMode: boolean;
    topBarAnnouncement: string;
};

type SettingsContextType = {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
    storeName: 'أناقة الخليج',
    whatsappNumber: '41069964',
    bankilyNumber: '41069964',
    shippingFee: 0,
    dubaiShippingTime: '7-12 أيام عمل',
    isSalesMode: false,
    topBarAnnouncement: '🚚 توصيل مجاني لجميع مناطق نواكشوط بمناسبة الافتتاح!'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        const saved = localStorage.getItem('khaliji_app_settings');
        if (saved) {
            setSettings(JSON.parse(saved));
        }

        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'khaliji_app_settings' && e.newValue) {
                setSettings(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const updateSettings = (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('khaliji_app_settings', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage')); // Notify other listeners in same tab
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
