'use client';

import { ShoppingCart, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

export default function ProductCard({ id, name, price, image }: { id: string, name: string, price: number, image: string }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id, name, price, image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-orange-600 font-bold mt-2">{price} MMK</p>
        <button
          onClick={handleAdd}
          className={`mt-4 w-full py-2 rounded flex justify-center items-center gap-2 transition font-semibold ${
            added
              ? 'bg-green-600 text-white'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          {added ? (
            <>
              <Check size={18} /> Added!
            </>
          ) : (
            <>
              <ShoppingCart size={18} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
