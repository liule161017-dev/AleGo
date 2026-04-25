// app/shop/data.ts
export interface Product {
    id: number;
    sku: string;
    title: string;
    artist: string;
    price: number;
    edition: string;
    availability: string;
    img: string;
    sales: number;
    release: number;
  }
  
  export const generateProducts = (): Product[] => {
    const products: Product[] = [];
    const sampleArtists = ["Hiro Tanaka","A. Moreau","K. Saito","V. Rossi","Y. Nakamura","L. Chen","M. Adler","S. Kagemori","Various","E. Park"];
    const levels = ["Collector","Premium","Cute"];
    const statuses = ["In Stock","Pre-order"];
    const titles = ["Celestial Guardian", "Mechanized Colossus", "Aurora Trio", "Arcane Archivist", "Kawaii Scout", "Luna Prototype", "Rune Sentinel", "Atlas Prime", "Mimi Explorer", "Noir Muse"];
  
    for (let i = 1; i <= 50; i++) {
      const imgIndex = ((i - 1) % 4) + 1; // 借用你首页的4张默认图轮换
      const defaultImages = [
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&fit=crop",
        "https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=600&fit=crop",
        "https://images.unsplash.com/photo-1580477659142-b8f8045f95ca?q=80&w=600&fit=crop",
        "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=600&fit=crop"
      ];
  
      products.push({
        id: i,
        sku: `AT-${1000 + i}`,
        title: `${titles[i % titles.length]} #${i}`,
        artist: sampleArtists[i % sampleArtists.length],
        price: Math.round((50 + Math.pow(i, 1.15) * 4) % 1300) + (i % 5 === 0 ? 400 : 0),
        edition: levels[i % 3],
        availability: statuses[i % 2],
        img: defaultImages[imgIndex - 1],
        sales: Math.floor(Math.random() * 400 + (i % 7) * 12),
        release: Date.now() - (i * 86400000 * (i % 30)),
      });
    }
    return products;
  };