// app/product/[id]/page.tsx
import { Metadata } from 'next';
import Script from 'next/script';
import { supabase } from '@/utils/supabase';
import ProductClient from './ProductClient';

// 服务端获取数据的辅助函数
async function getProductData(id: string) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

// 🌟 修改点 1：params 类型改为 Promise<{id: string}>，并在内部 await params
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params; // 解包 Promise
  const product = await getProductData(id);
  
  if (!product) {
    return { title: 'Masterpiece Not Found | Ale Statue Vault' };
  }

  const coverImage = product.images?.[0]?.startsWith('http') 
    ? product.images[0] 
    : `https://kmcccsvgdmmnituxxaej.supabase.co/storage/v1/object/public/product-images/${product.images?.[0] || product.sku + '-01.jpg'}`;

  return {
    title: `${product.title} - ${product.edition} | Ale Statue Vault`,
    description: product.description?.substring(0, 150) + '...',
    openGraph: {
      title: `${product.title} | Artisan GK Statue`,
      description: `Explore the artisan details of ${product.title}. Secure global shipping at Ale Statue Vault.`,
      images: [coverImage],
    },
  };
}

// 🌟 修改点 2：同样解包 params
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 解包 Promise
  const product = await getProductData(id);

  // 构造喂给 AI 的 JSON-LD
  const productJsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images || [],
    "description": product.description,
    "sku": product.sku || product.id,
    "brand": { "@type": "Brand", "name": "Ale Statue Vault" },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.status === 'In Stock' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "url": `https://www.aletoys.com/product/${id}`
    }
  } : {};

  return (
    <>
      {product && (
        <Script
          id={`jsonld-product-${id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {/* 将查好的 product 和解包后的 id 直接传给客户端组件 */}
      <ProductClient id={id} initialProduct={product} />
    </>
  );
}