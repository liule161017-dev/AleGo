// app/orders/data.ts

export interface Order {
    id: string;
    title: string;
    note: string;
    status: 'pending' | 'shipped' | 'delivered';
    price: number;
    created: string;
    artisanNote: string;
    provenance: string;
    shipping: string;
    thumbnail: string;
  }
  
  export const MOCK_ORDERS: Order[] = [
    {
      id: 'AT-10081',
      title: 'Nocturne Watcher — Signed Edition',
      note: 'Hand-painted patina; numbered 18/50',
      status: 'pending',
      price: 420,
      created: '2025-09-12T09:30:00Z',
      artisanNote: "Sculpted by Mara Lenn; glaze finished by J. Ortiz. Slight brush texture on the left ear is intentional.",
      provenance: "Limited edition: 50 pcs. Certificate: signed by Mara Lenn.",
      shipping: "Preparing — expected dispatch within 3 business days.",
      thumbnail: '🕯️'
    },
    {
      id: 'AT-10054',
      title: 'Harbor Fox — One-off',
      note: 'Unique one-off piece — original sculpt preserved',
      status: 'shipped',
      price: 1250,
      created: '2025-08-02T14:00:00Z',
      artisanNote: "This piece was fired at lower temp for a softer finish. Imperfection near tail fixed by hand.",
      provenance: "One-off original. Sculptor: R. Solace.",
      shipping: "Shipped — Tracking: TRK123456789 (in transit)",
      thumbnail: '🦊'
    },
    {
      id: 'AT-10011',
      title: 'Lumen Hare — Collector Set',
      note: 'Set of 3 with dusk glaze',
      status: 'delivered',
      price: 780,
      created: '2025-05-21T10:10:00Z',
      artisanNote: "Painted by E. Hart — each eye received a hand-applied silver leaf highlight.",
      provenance: "Certificate issued, artist signature included.",
      shipping: "Delivered — left at front desk on 2025-06-02",
      thumbnail: '🐇'
    },
    {
      id: 'AT-10092',
      title: 'Mariner Totem — Studio Run',
      note: 'Signed plate attached underneath',
      status: 'shipped',
      price: 320,
      created: '2025-09-29T11:20:00Z',
      artisanNote: "Compressed clay details on the base — manually textured.",
      provenance: "Studio run 2025 — plate numbered.",
      shipping: "Shipped — Awaiting customs clearance.",
      thumbnail: '🪵'
    },
    {
      id: 'AT-10003',
      title: 'Aurora Sprite — Preview',
      note: 'Pre-order, expected winter delivery',
      status: 'pending',
      price: 220,
      created: '2025-10-02T08:00:00Z',
      artisanNote: "Prototype approved — color may vary slightly from product photos.",
      provenance: "Preview run — certificate included upon finalization.",
      shipping: "Pre-order — production scheduled.",
      thumbnail: '🌌'
    }
  ];