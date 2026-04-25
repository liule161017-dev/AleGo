// app/login/components/AuthForms.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase'; // 引入刚才创建的客户端
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthForms() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 表单数据状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  // --- 功能 1：检查免登录状态 ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/account'); // 如果已有会话，直接跳到个人中心
      }
    };
    checkUser();
  }, [router]);

  
 // --- 功能 2：处理注册 ---
 const handleSignUp = async () => {
  // 基础校验
  if (!formData.email.includes('@')) return setErrorMsg('Please enter a valid email.');
  if (formData.password.length < 8) return setErrorMsg('Password must be at least 8 characters.');

  setLoading(true);
  setErrorMsg('');

  // 1. 调用 Supabase 注册接口
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (authError) {
    setErrorMsg(authError.message);
    setLoading(false);
    return;
  }

  if (authData.user) {
    // 2. 插入数据到 profiles 表
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          display_name: `${formData.firstName} ${formData.lastName}`,
          collector_id: `ALET-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
        }
      ]);

    if (profileError) {
      setErrorMsg('Account created, but profile update failed. Please contact support.');
      setLoading(false);
    } else {
      // 3. 注册并插入资料成功，直接跳转首页并刷新全站状态
      router.push('/');
      router.refresh(); // 极其重要：强制 Next.js 刷新服务端状态，让导航栏的“登录”按钮立刻变成“用户头像”
    }
  }
};

  // --- 功能 3：处理登录 ---
  const handleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrorMsg('Invalid email or password.');
      setLoading(false);
    } else {
      router.push('/'); // 登录成功，跳转
    }
  };

  return (
    <section className="rounded-2xl border overflow-hidden flex flex-col" style={{ background: 'var(--panel)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow)' }}>
      {/* 选项卡切换 */}
      <div className="p-5 pb-0">
        <div className="flex gap-2 p-1.5 rounded-2xl border bg-white/5 border-white/10">
          <button onClick={() => setActiveTab('signin')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'signin' ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Sign In</button>
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'create' ? 'bg-white/10 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>Create Account</button>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={(e) => { e.preventDefault(); activeTab === 'signin' ? handleSignIn() : handleSignUp(); }} className="space-y-4">
          
          {/* 注册模式下的姓名输入 */}
          {activeTab === 'create' && (
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" required placeholder="First Name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00edce]/50 text-white"
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                type="text" required placeholder="Last Name" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00edce]/50 text-white"
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          )}

          {/* 邮箱 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" required placeholder="collector@example.com" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00edce]/50 text-white"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-widest">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} required placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00edce]/50 text-white"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {errorMsg && <p className="text-red-400 text-xs py-1 px-2 bg-red-400/10 rounded-lg border border-red-400/20">{errorMsg}</p>}

          {/* 提交按钮 */}
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-black tracking-widest text-[#071018] bg-gradient-to-r from-[#ff2aa6] to-[#00edce] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : (activeTab === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>
        </form>
      </div>
    </section>
  );
}