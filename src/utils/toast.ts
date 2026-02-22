type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
    message: string;
    type: ToastType;
}

let toastSubscriber: ((options: ToastOptions) => void) | null = null;

export const subscribeToToasts = (callback: (options: ToastOptions) => void) => {
    toastSubscriber = callback;
    return () => {
        toastSubscriber = null;
    };
};

export const showToast = (message: string, type: ToastType = 'info') => {
    if (toastSubscriber) {
        toastSubscriber({ message, type });
    }
};
