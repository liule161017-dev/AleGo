'use client'
import { useState } from 'react';

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details & Gallery' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews (89)' },
    { id: 'returns', label: 'Returns & Care' },
  ];

  return (
    <div className="mt-8 bg-[#0f1518] p-6 rounded-2xl border border-white/5">
      {/* 选项卡头部 */}
      <div className="flex gap-2 border-b border-white/5 pb-4 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-[#ff4fa6] to-[#00e0c6] text-[#071018] shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 选项卡内容区 */}
      <div className="min-h-[200px] text-gray-400 text-sm leading-relaxed">
        {activeTab === 'details' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-white text-lg font-bold mb-3">A story in every brushstroke</h3>
            <p className="mb-4">Kitsune Artisan — No.032 is the result of an intimate studio process led by sculptor Y. Nakamoto. Each edition is cast from a refined original and finished by hand...</p>
            <p>We design limited editions with provenance in mind. Every purchase includes a numbered certificate, a padded collector's box, and a handwritten note from the artist.</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5"><strong className="text-gray-300">Artist</strong><div className="text-white mt-1">Y. Nakamoto</div></div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5"><strong className="text-gray-300">Edition</strong><div className="text-white mt-1">Limited to 250</div></div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5"><strong className="text-gray-300">Material</strong><div className="text-white mt-1">Resin core, hand-applied acrylics</div></div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5"><strong className="text-gray-300">Size</strong><div className="text-white mt-1">28 cm × 16 cm</div></div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-gray-500 mb-2">★★★★★ • <strong className="text-gray-300">Marina, CA</strong> • 2 weeks ago</div>
                <p>I own several ALeToys pieces and this is one of the most refined. The finish and presentation felt gallery-level...</p>
             </div>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-xs text-gray-500 mb-2">★★★★★ • <strong className="text-gray-300">James, UK</strong> • 1 month ago</div>
                <p>Beautiful sculpt and attentive studio support. A minor paint variance was handled quickly...</p>
             </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="animate-in fade-in duration-500">
             <p className="mb-4">Because each piece is hand-finished, subtle variations are part of the story and are not considered defects. If an item is damaged in transit, contact us within 7 days for repair or replacement.</p>
             <p>Care tips: avoid prolonged direct sunlight; dust gently with a soft brush; never use solvents or abrasive cleaners.</p>
          </div>
        )}
      </div>
    </div>
  );
}