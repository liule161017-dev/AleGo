// app/shop/components/ShopFilters.tsx
'use client'

interface FiltersProps {
  level: string;
  setLevel: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onApply: () => void;
}

export default function ShopFilters({
  level, setLevel, status, setStatus, sort, setSort, minPrice, setMinPrice, maxPrice, setMaxPrice, onApply
}: FiltersProps) {
  
  const levels = ["All", "Collector", "Premium", "Cute"];
  const statuses = ["All", "In Stock", "Pre-order"];

  return (
    <aside className="sticky top-[90px] bg-gradient-to-b from-white/[0.012] to-white/[0.01] rounded-xl p-5 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      <h4 className="text-gray-400 text-sm font-semibold mb-4">Filters</h4>

      {/* Product Level */}
      <div className="mb-6">
        <h5 className="text-gray-400 text-xs font-semibold mb-2">Product Level</h5>
        <div className="flex flex-wrap gap-2">
          {levels.map(l => (
            <button key={l} onClick={() => setLevel(l)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                level === l ? 'bg-gradient-to-r from-[#ff6b9a]/10 to-[#6ee7f2]/10 text-[#ff6b9a] border border-[#ff6b9a]/20' 
                : 'bg-transparent text-gray-400 border border-white/5 hover:text-[#6ee7f2] hover:-translate-y-0.5'
              }`}>
              {l === "Collector" ? "Collector's Edition" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Product Status */}
      <div className="mb-6">
        <h5 className="text-gray-400 text-xs font-semibold mb-2">Product Status</h5>
        <div className="flex flex-wrap gap-2">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                status === s ? 'bg-gradient-to-r from-[#ff6b9a]/10 to-[#6ee7f2]/10 text-[#ff6b9a] border border-[#ff6b9a]/20' 
                : 'bg-transparent text-gray-400 border border-white/5 hover:text-[#6ee7f2] hover:-translate-y-0.5'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h5 className="text-gray-400 text-xs font-semibold mb-2">Price (USD)</h5>
        <div className="flex items-center gap-2 mb-2">
          <input type="number" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-gray-400 text-sm outline-none focus:border-[#6ee7f2]/50" />
          <span className="text-gray-500">—</span>
          <input type="number" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full bg-transparent border border-white/5 rounded-lg px-2 py-1.5 text-gray-400 text-sm outline-none focus:border-[#6ee7f2]/50" />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <h5 className="text-gray-400 text-xs font-semibold mb-2">Sort By</h5>
        <select value={sort} onChange={e => setSort(e.target.value)} className="w-full bg-[#0a0b0c] border border-white/5 rounded-lg px-3 py-2 text-gray-400 text-sm outline-none focus:border-[#6ee7f2]/50">
          <option value="new">Newest arrivals</option>
          <option value="release_asc">Release date ↑</option>
          <option value="release_desc">Release date ↓</option>
          <option value="sales_desc">Best selling</option>
          <option value="price_asc">Price: low → high</option>
          <option value="price_desc">Price: high → low</option>
        </select>
      </div>

      <button onClick={onApply} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b9a] to-[#6ee7f2] text-[#07121a] font-bold shadow-[0_8px_26px_rgba(110,231,242,0.15)] hover:opacity-90 transition-opacity">
        Apply filters
      </button>
    </aside>
  );
}