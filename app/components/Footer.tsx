import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaWeixin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/5 bg-gradient-to-b from-[#060607]/90 to-[#060607] text-gray-400 py-10 px-6">
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
        
        {/* 左侧品牌与社媒 */}
        <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
          <div className="text-xl font-bold text-white font-serif">ALeToys</div>
          <div className="hidden md:block w-px h-4 bg-gray-700"></div>
          <div className="text-xs text-gray-500 tracking-wide text-center md:text-left">
            Designer collectibles · Limited releases · Worldwide shipping
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            {[FaFacebook, FaTwitter, FaInstagram, FaWeixin, FaWhatsapp].map((Icon, idx) => (
              <a key={idx} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center bg-transparent border border-white/5 text-gray-400 hover:bg-white/5 hover:text-[#6ee7f2] hover:-translate-y-1 transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* 中间快捷链接 */}
        {/* <div className="flex items-center gap-6 text-xs font-semibold tracking-wider">
          <Link href="/shop" className="hover:text-white transition-colors">Shop All</Link>
          <Link href="#" className="hover:text-white transition-colors">Limited</Link>
          <Link href="#" className="hover:text-white transition-colors">Guide</Link>
          <Link href="#" className="hover:text-white transition-colors">Support</Link>
        </div> */}

        {/* 右侧订阅与版权 */}
        <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
          {/* <div className="flex items-center gap-2 w-full max-w-sm">
            <input 
              type="email" 
              placeholder="you@example.com" 
              className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6ee7f2] text-white transition-colors" 
            />
            <button className="bg-gradient-to-r from-[#ff6b9a] to-[#6ee7f2] text-[#07121a] text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
              Subscribe
            </button>
          </div> */}
          <div className="text-gray-600 text-xs mt-1">
            &copy; {new Date().getFullYear()} ALeToys. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}