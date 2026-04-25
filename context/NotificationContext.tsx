// context/NotificationContext.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface NotificationContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (type: ToastType, message: string, duration = 3000) => {
    setToast({ type, message });
    setIsVisible(true);

    // 自动关闭逻辑
    if (type !== 'loading') {
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setToast(null), 300); // 等待动画结束
      }, duration);
    }
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}

      {/* 全局通知 UI 组件 */}
      {toast && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[1000] px-6 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
        } ${
          toast.type === 'success' ? 'bg-[#00edce]/10 border-[#00edce]/30 text-[#00edce]' :
          toast.type === 'error' ? 'bg-[#ff2aa6]/10 border-[#ff2aa6]/30 text-[#ff2aa6]' :
          'bg-white/10 border-white/20 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <AlertCircle size={18} />}
          {toast.type === 'info' && <Info size={18} />}
          {toast.type === 'loading' && <Loader2 size={18} className="animate-spin" />}
          
          <span className="text-sm font-bold tracking-wide">{toast.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

// 导出自定义 Hook 方便调用
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};