import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export const Toast = ({ message, type, onClose, duration = 5000 }: ToastProps) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    const icons = {
        success: <CheckCircle className="text-emerald-400" size={20} />,
        error: <AlertCircle className="text-red-400" size={20} />,
        info: <Info className="text-[#29ABE2]" size={20} />,
    };

    const backgrounds = {
        success: 'bg-emerald-500/10 border-emerald-500/20',
        error: 'bg-red-500/10 border-red-500/20',
        info: 'bg-[#29ABE2]/10 border-[#29ABE2]/20',
    };

    return (
        <div className={`
            flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-2xl
            min-w-[300px] max-w-md animate-in slide-in-from-right duration-300
            ${backgrounds[type]}
            ${isExiting ? 'animate-out fade-out slide-out-to-right duration-300' : ''}
        `}>
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-white flex-1">{message}</p>
            <button
                onClick={handleClose}
                className="shrink-0 p-1 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
            >
                <X size={16} />
            </button>
        </div>
    );
};
