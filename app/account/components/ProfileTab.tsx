'use client'
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

export default function ProfileTab({ profile }: { profile: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFlow, setShowPasswordFlow] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 1. 状态绑定：用于捕获用户输入
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    first_name: profile?.first_name || '',
    gender: profile?.gender || 'male',
    dob: profile?.dob || ''
  });
  const { showToast } = useNotification(); // 2. 获取调用函数



  const handleUpdate = async () => {
  
    showToast('loading', 'Updating your sanctum...'); // 显示加载中
    // 调用 Supabase 更新 profile 数据
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        first_name: formData.first_name,
        // gender: formData.gender,
        // dob: formData.dob
      })
      .eq('id', profile.id);

      if (error) {
        showToast('error', error.message); // 失败提示
      } else {
        showToast('success', 'Profile updated successfully!'); // 成功提示
      }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleUpdate();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
   

      <div className="rounded-2xl p-8 md:p-12 relative overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
        
        <div className="flex justify-between items-center mb-10 pb-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="text-2xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>Essential Details</h2>
          <button 
            onClick={toggleEdit}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2"
            style={isEditing 
              ? { background: 'var(--gradient-main)', color: '#fff', border: '1px solid transparent', boxShadow: '0 4px 15px rgba(0, 237, 206, 0.3)' } 
              : { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEditing ? (loading ? 'Updating...' : 'Save Changes') : 'Edit Profile'}
          </button>
        </div>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8" onSubmit={(e) => e.preventDefault()}>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>Collector ID</label>
            <input type="text" className="form-input readonly-state px-4 py-3 rounded-lg text-[15px]" value={profile?.collector_id} readOnly />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input type="text" className="form-input readonly-state px-4 py-3 rounded-lg text-[15px]" value={profile?.email} readOnly />
          </div>
          
          {/* 可编辑字段增加 onChange 绑定 */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
            <input 
              type="text" 
              className={`form-input px-4 py-3 rounded-lg text-[15px] ${!isEditing ? 'readonly-state' : ''}`} 
              value={formData.display_name}
              onChange={(e) => setFormData({...formData, display_name: e.target.value})}
              readOnly={!isEditing} 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>First Name</label>
            <input 
              type="text" 
              className={`form-input px-4 py-3 rounded-lg text-[15px] ${!isEditing ? 'readonly-state' : ''}`} 
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              readOnly={!isEditing} 
            />
          </div>

          {/* <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>Gender</label>
            <select 
              className={`form-input px-4 py-3 rounded-lg text-[15px] ${!isEditing ? 'readonly-state' : ''}`} 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              disabled={!isEditing}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[1.5px] font-bold" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
            <input 
              type="date" 
              className={`form-input px-4 py-3 rounded-lg text-[15px] ${!isEditing ? 'readonly-state' : ''}`} 
              value={formData.dob}
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
              readOnly={!isEditing} 
            />
          </div> */}
        </form>
      </div>
    </div>
  );
}