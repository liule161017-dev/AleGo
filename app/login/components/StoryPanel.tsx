// app/login/components/StoryPanel.tsx
'use client'

export default function StoryPanel() {
  const trustItems = [
    { title: "Verified email = smoother deposit follow-up", desc: "For deposit items, we notify you when the balance payment window opens. A real email ensures you don’t miss your slot.", mini: "We never sell your contact info." },
    { title: "Transparent production timelines", desc: "Made-to-order and limited runs vary. We show clear estimates and update you when your piece moves stages.", mini: "You’ll always know what’s next." },
    { title: "Collector-grade packaging & insurance", desc: "Protective inner foam, reinforced corners, and optional shipping insurance for high-value orders.", mini: "Unbox with confidence." },
    { title: "Authenticity & limited numbering", desc: "Numbered editions where applicable, studio QC photos for select drops, and documented releases.", mini: "Built for long-term collections." }
  ];

  return (
    <section className="relative rounded-2xl border p-6 md:p-8 overflow-hidden flex flex-col justify-between" style={{ background: 'linear-gradient(180deg, var(--panel), transparent)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow)' }}>
      <div className="storyGlow" aria-hidden="true"></div>
      
      <div className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2.5 text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--muted)' }}>
          <span className="w-2 h-2 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.05)]" style={{ background: 'var(--grad)' }}></span> 
          Collector-first • Studio-grade • Made with care
        </div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 text-[var(--text)]">
          Where <span className="text-gradient">craft</span> meets character.
        </h1>
        <p className="text-[15px] leading-relaxed max-w-[56ch]" style={{ color: 'var(--muted)' }}>
          ALeToys is a home for high-end designer collectibles — pieces that feel alive in your hands. 
          Each release is shaped by real artists, refined through careful finishing, and shipped with 
          collector-level protection. No hype copy — just honest detail, measured quality, and a story you can keep.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {trustItems.map((item, idx) => (
          <div key={idx} className="rounded-2xl p-4 transition-all hover:-translate-y-1 hover:border-[#00edce]/40" style={{ background: 'rgba(0,0,0,0.16)', border: '1px solid var(--border-color)' }}>
            <h4 className="text-[13px] font-bold mb-1.5 text-[var(--text)]">{item.title}</h4>
            <p className="text-[12.5px] leading-relaxed m-0" style={{ color: 'var(--muted)' }}>{item.desc}</p>
            <div className="text-[12px] mt-2" style={{ color: 'var(--muted2)' }}>{item.mini}</div>
          </div>
        ))}
      </div>

      <div className="relative z-10 p-5 rounded-2xl border border-dashed" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border-color)' }}>
        <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--muted)' }}>
          “Our best compliment is when a collector tells us the piece feels <b className="text-[var(--text)]">warmer than a product</b> — 
          like a tiny scene from their favorite world, captured in resin, paint, and patience.”
        </p>
        <div className="text-[12px] mt-2.5" style={{ color: 'var(--muted2)' }}>— ALeToys Studio Team</div>
      </div>
    </section>
  );
}