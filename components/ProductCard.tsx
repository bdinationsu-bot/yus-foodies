'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function ProductCard({ id, name, price, image }: { id: string, name: string, price: number, image: string }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-orange-600 font-bold mt-2">{price} MMK</p>
        <button 
          onClick={() => addItem({ id, name, price, image, quantity: 1 })}
          className="mt-4 w-full bg-orange-600 text-white py-2 rounded flex justify-center items-center gap-2 hover:bg-orange-700 transition"
        >
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
