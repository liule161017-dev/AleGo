// app/login/page.tsx
'use client'
import { useState } from 'react';
import './login.css'; // 引入专属的登录页特效与主题 CSS
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingConsult from '../components/FloatingConsult';
import StoryPanel from './components/StoryPanel';
import AuthForms from './components/AuthForms';

export default function LoginPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    // 使用专属的 Theme Wrapper 包裹本页面，确保样式隔离
    <div className="login-theme-wrapper min-h-screen relative transition-colors duration-500 overflow-x-hidden" data-theme={theme}>
      
      {/* 满屏噪点特效层 */}
      <div className="grain"></div>

      {/* 顶部导航 */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* 主题切换悬浮球 (沿用订单页的设计逻辑，放在页面右下角供演示) */}
      {/* <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed right-6 bottom-24 z-[90] w-12 h-12 rounded-full border flex items-center justify-center text-xl shadow-lg transition-transform hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'var(--border-color)', color: 'var(--text)' }}
      >
        {theme === 'dark' ? '☀️' : '☾'}
      </button> */}

      {/* 主体内容网格 */}
      <main className="max-w-[1160px] mx-auto px-5 py-28 relative z-10 min-h-[calc(100vh-200px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.06fr_0.94fr] gap-6 md:gap-8 w-full">
           
           {/* 左侧：品牌故事与信用背书 */}
           <div className="h-full">
             <StoryPanel />
           </div>
           
           {/* 右侧：登录与注册表单 */}
           <div className="h-full">
             <AuthForms />
           </div>

        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
      
      {/* <FloatingConsult /> */}
    </div>
  );
}