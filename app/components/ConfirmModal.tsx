// app/components/ConfirmModal.tsx
'use client'
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel} />
      
      {/* 弹窗主体 */}
      <div className="relative w-full max-w-md bg-[#0f1113] border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300">
        
        {/* 顶部装饰条：粉蓝渐变 */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ff4fa6] to-[#00edce]" />

        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#ff4fa6]/10 flex items-center justify-center text-[#ff4fa6] shadow-[0_0_20px_rgba(255,74,166,0.1)]">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-serif tracking-wide">{title}</h3>
              <div className="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold mt-1">Action Required</div>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onCancel}
              className="py-3 rounded-xl border border-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="py-3 rounded-xl bg-gradient-to-r from-[#ff4fa6] to-[#00edce] text-[#071018] font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>

        {/* 装饰性噪点背景 */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      </div>
    </div>
  );
}