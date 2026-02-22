import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/ui/Toast';
import { subscribeToToasts } from '../utils/toast';

interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

const ToastContext = createContext<{
    show: (message: string, type: ToastType) => void;
} | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const show = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        return subscribeToToasts(({ message, type }) => {
            show(message, type);
        });
    }, [show]);

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => remove(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
