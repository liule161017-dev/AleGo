// app/components/Reviews.tsx
'use client'
import { useState, useEffect } from 'react';

export default function Reviews() {
  const reviews = [
    { text: "Absolutely stunning piece! The details are out of this world.", author: "John D." },
    { text: "Worth every penny. The packaging ensured it arrived perfectly safe.", author: "Sarah K." },
    { text: "Beautiful details and excellent build quality. A true masterpiece.", author: "Mike T." },
    { text: "A centerpiece for my collection. Everyone asks where I got it.", author: "Emily R." },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex((prev) => (prev + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="py-24 relative z-10 border-t border-white/5 mt-12 bg-black/20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 tracking-widest uppercase text-white">Collectors' Voices</h2>
      
      <div className="max-w-4xl mx-auto px-6 relative">
        <div className="relative h-[200px] flex items-center justify-center">
          {reviews.map((review, index) => (
            <div key={index} className={`absolute w-full text-center transition-all duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 -z-10 pointer-events-none'}`}>
              {/* 霓虹双色引号 */}
              <div className="text-gradient-primary text-5xl font-serif mb-4 leading-none">"</div>
              <p className="text-lg md:text-2xl italic text-gray-300 mb-6 px-4 md:px-12 leading-relaxed">
                {review.text}
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-6 h-px bg-[#00e0c6]"></span>
                <span className="text-sm font-bold tracking-widest uppercase text-[#ff4fa6]">
                  {review.author}
                </span>
                <span className="w-6 h-px bg-[#00e0c6]"></span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-3 mt-12">
          {reviews.map((_, index) => (
            <button
              key={index} onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${index === currentIndex ? 'w-10 bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}