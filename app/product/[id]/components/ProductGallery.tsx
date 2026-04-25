'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const IMAGES = [
  "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800&fit=crop",
  "https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=800&fit=crop",
  "https://images.unsplash.com/photo-1580477659142-b8f8045f95ca?q=80&w=800&fit=crop",
  "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&fit=crop"
];

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 自动轮播
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isModalOpen]);

  const nextImg = () => setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
  const prevImg = () => setCurrentIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  return (
    <div className="bg-[#0f1518] p-5 rounded-2xl border border-white/5 relative">
      {/* 咨询快捷入口 */}
      <div className="absolute left-8 top-8 z-20 bg-white/5 backdrop-blur-md border border-[#00e0c6]/20 p-2.5 rounded-xl shadow-lg flex items-center gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all">
        <span className="text-white text-xs font-bold">Curious about finish?</span>
        <span className="bg-black/30 text-white text-xs font-bold px-2 py-1 rounded-lg border border-[#00e0c6]/10">Ask studio</span>
      </div>

      {/* 主图区 */}
      <div className="relative h-[360px] md:h-[480px] bg-[#050608] rounded-xl overflow-hidden group">
        <Image 
          src={IMAGES[currentIndex]} alt="Product" fill 
          className="object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-105" 
          onClick={() => setIsModalOpen(true)}
        />
        <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><ChevronLeft size={20}/></button>
        <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><ChevronRight size={20}/></button>
        <div className="absolute left-4 bottom-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-gray-400">
          {currentIndex + 1} / {IMAGES.length}
        </div>
      </div>

      {/* 缩略图 */}
      <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
        {IMAGES.map((img, idx) => (
          <div key={idx} onClick={() => setCurrentIndex(idx)} className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${idx === currentIndex ? 'border-[#00e0c6] shadow-[0_8px_30px_rgba(0,224,198,0.2)]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <Image src={img} alt="Thumb" width={80} height={64} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 放大弹窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#02060a]/95 z-[9999] flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 w-10 h-10 bg-black/50 rounded-lg flex items-center justify-center text-white hover:bg-white/10" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={e => e.stopPropagation()}>
             <Image src={IMAGES[currentIndex]} alt="Enlarged" fill className="object-contain" />
             <button onClick={prevImg} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center text-white hover:scale-110"><ChevronLeft size={24}/></button>
             <button onClick={nextImg} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 rounded-lg flex items-center justify-center text-white hover:scale-110"><ChevronRight size={24}/></button>
          </div>
        </div>
      )}
    </div>
  );
}