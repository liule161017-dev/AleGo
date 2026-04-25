// app/components/Features.tsx
import { Award, Palette, Truck } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: <Award size={32} />, title: "Authenticity", desc: "Guaranteed original and licensed products only." },
    { icon: <Palette size={32} />, title: "Hand Crafted", desc: "All statues are handmade and hand-painted." },
    { icon: <Truck size={32} />, title: "Global Shipping", desc: "Fast, insured, and safe worldwide dispatch." }
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