// app/components/Hero.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const slides = [
    "https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1920&fit=crop",
    "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1920&fit=crop",
    "https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1920&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 粉蓝双色粒子特效
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const colors = ['#ff4fa6', '#00e0c6', '#ffffff'];
    
    let particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const drawParticles = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    drawParticles();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-[#05070a]">
      {slides.map((slide, index) => (
        <div key={index} className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}>
          <Image src={slide} alt={`Slide ${index}`} fill className="object-cover opacity-40" priority={index === 0} />
          {/* 添加极暗的渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-[#05070a]/80" />
        </div>
      ))}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20 w-full px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
          <span className="w-2 h-2 rounded-full bg-[#00e0c6] shadow-[0_0_10px_#00e0c6]"></span>
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">Premium Collectibles</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
          The Pinnacle of <br/><span className="text-gradient-primary">Statue Art</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          Crafted for true enthusiasts. Discover hand-painted, limited edition masterpieces from world-class studios.
        </p>
      </div>
      
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] w-10' : 'bg-white/20 hover:bg-white/40 w-4'}`} />
        ))}
      </div>
    </section>
  );
}