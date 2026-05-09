// app/components/FAQSection.tsx
import { HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      q: "Are the GK statues authentic and hand-painted?",
      a: "Yes. Every resin statue at ALeToys is 100% hand-painted by master artisans. We source directly from top-tier studios, guaranteeing authenticity and museum-grade quality."
    },
    {
      q: "How do you ensure statues survive global shipping?",
      a: "We implement a strict Tri-Layer Protection protocol. All high-end resin statues are shipped using custom pearl cotton, reinforced color boxes, and external wooden crates for international dispatch."
    },
    {
      q: "What payment methods do you accept for international orders?",
      a: "For international collectors, we support secure payments including PayPal, ensuring your high-value transactions are fully protected."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto relative z-10" itemScope itemType="https://schema.org/FAQPage">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-widest uppercase text-white mb-4">Collector FAQ</h2>
        <p className="text-gray-400">Everything you need to know about our artisan statues and shipping.</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8" itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
            <h3 className="text-xl font-bold text-white mb-3 flex items-start gap-3" itemProp="name">
              <HelpCircle className="text-[#00e0c6] shrink-0 mt-1" size={20} />
              {faq.q}
            </h3>
            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
              <p className="text-gray-400 leading-relaxed pl-8" itemProp="text">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}