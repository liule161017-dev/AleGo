'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 必须引入
import { Search, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // 新增：搜索状态
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理回车搜索
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
        // 跳转到 Shop 页，并带上查询参数
        router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/shop'); // 为空则去全部页面
      }
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${scrolled ? 'bg-[#060607]/95 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent'}`}>
      
      <Link href="/" className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#ff6b9a] to-[#6ee7f2] bg-[length:300%_auto] text-transparent bg-clip-text font-serif cursor-pointer hover:opacity-80 transition-opacity">
        ALeToys
      </Link>

      <nav className="hidden md:block">
        <ul className="flex gap-8 items-center text-gray-300 text-sm tracking-wider font-semibold">
          <li><Link href="/" className="hover:text-[#6ee7f2] hover:-translate-y-0.5 transition-all block">Home</Link></li>
          <li><Link href="/shop" className="hover:text-[#6ee7f2] hover:-translate-y-0.5 transition-all block">Category</Link></li>
          <li><Link href="/account" className="hover:text-[#6ee7f2] hover:-translate-y-0.5 transition-all block">Profile</Link></li>
          <li><Link href="/about" className="hover:text-[#6ee7f2] hover:-translate-y-0.5 transition-all block">AboutUs</Link></li>
        </ul>
      </nav>

      <div className="flex items-center gap-5 text-gray-300">
        {/* 重点修改：搜索框绑定事件 */}
        <div className="hidden md:flex items-center bg-white/5 rounded-full px-3 py-1.5 border border-white/5 focus-within:border-[#6ee7f2]/50 transition-colors">
          <Search size={16} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search statues..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-transparent border-none text-white placeholder-gray-500 text-sm outline-none w-32 focus:w-48 transition-all" 
          />
        </div>
        <Link href="/login"><User size={20} className="cursor-pointer hover:text-[#6ee7f2] transition-colors" /></Link>
        <Link href="/wishlist" className="relative p-2 text-gray-400 hover:text-[#00edce] transition-colors">
          <ShoppingCart size={22} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff4fa6] rounded-full"></span>
        </Link>
      </div>
    </header>
  );
}