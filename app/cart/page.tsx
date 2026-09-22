'use client';

import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/cart';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, getTotal } = useCartStore();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.price} MMK x {item.quantity}</p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-orange-600">{getTotal()} MMK</span>
            </div>
            
            <Link href="/checkout" className="mt-6 block text-center w-full bg-orange-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition">
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
