'use client';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MenuPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Snacks Menu</h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name} 
                price={product.price} 
                image={product.image} 
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
