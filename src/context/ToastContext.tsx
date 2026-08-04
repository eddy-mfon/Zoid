import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, Heart, X } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message: string;
  image?: string;
  type?: 'cart' | 'wishlist' | 'info';
}

interface ToastContextType {
  showToast: (title: string, message: string, image?: string, type?: 'cart' | 'wishlist' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (title: string, message: string, image?: string, type: 'cart' | 'wishlist' | 'info' = 'cart') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, title, message, image, type };
    
    setToasts((prev) => [...prev.slice(-2), newToast]); // max 3 active

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto bg-[#0A0A0A]/95 backdrop-blur-md border border-neutral-800 rounded-xl p-3 shadow-2xl flex items-center gap-3 text-white"
            >
              {toast.image ? (
                <img
                  src={toast.image}
                  alt={toast.title}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-800 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#C21E3C]/20 text-[#C21E3C] flex items-center justify-center shrink-0">
                  {toast.type === 'cart' ? <ShoppingBag className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
                </div>
              )}

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C21E3C]"></span>
                  <p className="font-display tracking-wider text-sm uppercase text-white truncate font-bold">
                    {toast.title}
                  </p>
                </div>
                <p className="text-xs text-neutral-400 truncate">{toast.message}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-neutral-500 hover:text-white p-1 rounded-md transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
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
