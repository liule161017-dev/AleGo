// app/account/components/AddressTab.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import ConfirmModal from '../../components/ConfirmModal'; // 引入新组件
import { Phone, Plus, X, Loader2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function AddressTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const { showToast } = useNotification(); // 2. 获取调用函数





  const fetchAddresses = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (!error) setAddresses(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSaveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // 放在 await 之前防止 Event Lost
    setSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isPrimary = formData.get('is_primary') === 'on';

    try {
      // 确保唯一默认地址逻辑
      if (isPrimary) {
        await supabase
          .from('addresses')
          .update({ is_primary: false })
          .eq('user_id', user.id);
      }

      const addressData = {
        user_id: user.id,
        recipient_name: formData.get('recipient_name'),
        phone: formData.get('phone'),
        address_line1: formData.get('address_line1'),
        city: formData.get('city'),
        region: formData.get('region'),
        postal_code: formData.get('postal_code'),
        country: formData.get('country'),
        is_primary: isPrimary
      };

      let error;
      if (editingAddress) {
        const { error: err } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('addresses')
          .insert([addressData]);
        error = err;
      }

      if (error) throw error;

      showToast('success', editingAddress ? "Manifest updated." : "New manifest added to your sanctum.");
      setIsDrawerOpen(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (err: any) {
      showToast('error', err.message || "Failed to save address.");
    } finally {
      setSubmitting(false);
    }
  };


  // ... 其他状态
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // 1. 点击删除时：不直接删，而是打开弹窗并记录 ID
  const requestDelete = (id: string) => {
    setAddressToDelete(id);
    setIsConfirmOpen(true);
  };

  // 2. 真正的执行删除逻辑
  const executeDelete = async () => {
    if (!addressToDelete) return;
    
    setIsConfirmOpen(false); // 先关弹窗
    const { error } = await supabase.from('addresses').delete().eq('id', addressToDelete);
    
    if (error) {
      showToast('error', "Could not remove manifest.");
    } else {
      showToast('success', "Manifest removed successfully.");
      fetchAddresses();
    }
    setAddressToDelete(null);
  };






  return (
    <div className="relative">

      {/* 集成确认弹窗 */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Remove Manifest"
        message="Are you sure you want to delete this shipping manifest? This action is permanent and cannot be undone within your curator sanctum."
        onConfirm={executeDelete}
        onCancel={() => { setIsConfirmOpen(false); setAddressToDelete(null); }}
      />

   

      {loading ? (
        <div className="flex justify-center py-20 text-[var(--color-cyan)]"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          <div 
            className="rounded-2xl border border-dashed flex flex-col items-center justify-center text-center cursor-pointer min-h-[260px] transition-all hover:border-[var(--color-cyan)] group"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)' }}
            onClick={() => { setEditingAddress(null); setIsDrawerOpen(true); }}
          >
            <div className="text-[var(--text-secondary)] group-hover:text-[var(--color-cyan)] transition-colors mb-4">
              <Plus size={40} strokeWidth={1} />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-secondary)' }}>Add New Manifest</h3>
          </div>

          {addresses.map((addr) => (
            <div key={addr.id} className="address-card p-8 rounded-2xl flex flex-col relative group">
              {addr.is_primary && (
                <div className="absolute top-6 right-6 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-[var(--color-cyan)] text-[var(--color-cyan)] bg-[var(--color-cyan)]/10">
                  Primary
                </div>
              )}
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{addr.recipient_name}</h3>
              <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>{addr.address_line1}</p>
                <p>{addr.city}, {addr.region} {addr.postal_code}</p>
                <p>{addr.country}</p>
              </div>
              <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Phone size={14} /> {addr.phone}
              </div>
              
              <div className="mt-auto pt-6 flex gap-5">
                <button 
                  onClick={() => { setEditingAddress(addr); setIsDrawerOpen(true); }}
                  className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] hover:text-[var(--color-cyan)] transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => requestDelete(addr.id)}
                  className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 侧边抽屉逻辑保持不变 ... */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <aside 
            className="fixed right-0 top-0 h-full w-full md:w-[450px] z-[210] p-8 md:p-12 shadow-2xl animate-in slide-in-from-right duration-300"
            style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold font-serif">{editingAddress ? 'Edit Manifest' : 'New Manifest'}</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-[var(--text-secondary)] hover:text-white"><X /></button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-6">
              <div className="space-y-4">
                <input name="recipient_name" required defaultValue={editingAddress?.recipient_name} placeholder="Recipient Full Name" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                <input name="phone" required defaultValue={editingAddress?.phone} placeholder="Contact Phone" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                <input name="address_line1" required defaultValue={editingAddress?.address_line1} placeholder="Street Address" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                <div className="grid grid-cols-2 gap-4">
                  <input name="city" required defaultValue={editingAddress?.city} placeholder="City" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                  <input name="region" defaultValue={editingAddress?.region} placeholder="State/Region" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input name="postal_code" defaultValue={editingAddress?.postal_code} placeholder="Postal Code" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                  <input name="country" required defaultValue={editingAddress?.country} placeholder="Country" className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-[var(--color-cyan)]" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_primary" defaultChecked={editingAddress?.is_primary} className="w-4 h-4 rounded border-white/10 bg-white/5 text-[var(--color-cyan)] focus:ring-[var(--color-cyan)]" />
                <span className="text-sm text-[var(--text-secondary)] font-bold uppercase tracking-widest">Set as Primary Address</span>
              </label>

              <button 
                type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl font-black tracking-widest text-[#071018] shadow-lg hover:brightness-105 transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--gradient-main)' }}
              >
                {submitting ? <Loader2 className="animate-spin" /> : 'SAVE MANIFEST'}
              </button>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}