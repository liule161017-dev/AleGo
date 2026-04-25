'use client'
import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingConsult() {
  const [showConsult, setShowConsult] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowConsult(window.scrollY > window.innerHeight - 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContact = () => {
    const msg = "Hi ALeToys, I'm interested in your statues.";
    window.open(`https://wa.me/YOUR_NUMBER?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <button 
      onClick={handleContact}
      className={`fixed bottom-8 right-8 w-14 h-14 bg-[#4f6eff] text-white rounded-full flex items-center justify-center shadow-[0_4px_18px_rgba(52,110,255,0.3)] z-50 transition-all duration-300 hover:bg-gradient-to-br hover:from-[#4f6eff] hover:to-[#b07dff] hover:scale-110 hover:-translate-y-1 ${showConsult ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-8'}`}
    >
      <MessageCircle size={28} />
    </button>
  );
}