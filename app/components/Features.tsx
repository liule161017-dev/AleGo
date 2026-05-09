// app/components/Features.tsx
import { Award, Palette, Truck } from 'lucide-react';

export default function Features() {
  const features = [
    { 
      icon: <Award size={32} />, 
      title: "Elite Authenticity", 
      desc: "Guaranteed authentic private custom GK and premium studio releases." 
    },
    { 
      icon: <Palette size={32} />, 
      title: "Artisan Hand-Painted", 
      desc: "100% hand-painted by master artisans, capturing every detail in high-grade resin." 
    },
    { 
      icon: <Truck size={32} />, 
      title: "Museum-Grade Shipping", 
      desc: "Reinforced wooden crating and insured global dispatch to protect your investment." 
    }
  ];

  return (
    <section className="flex flex-col md:flex-row justify-center items-center gap-6 py-16 px-6 max-w-[1200px] mx-auto relative z-10">
      {features.map((f, i) => (
        <div key={i} className="w-full md:w-1/3 bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center cursor-default transition-all duration-400 hover:-translate-y-2 hover:border-[#ff4fa6]/40 hover:bg-white/10 group shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/50 text-[#00e0c6] mb-6 transition-all duration-400 group-hover:scale-110 group-hover:text-[#ff4fa6] group-hover:shadow-[0_0_20px_rgba(255,79,166,0.3)]">
            {f.icon}
          </div>
          <h3 className="text-lg font-bold mb-2 text-white tracking-wide uppercase">{f.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}