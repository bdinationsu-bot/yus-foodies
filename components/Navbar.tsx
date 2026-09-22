'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function Navbar() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <nav className="bg-orange-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Yu's Foodies Logo"
            className="h-14 w-14 object-cover rounded-full bg-white shadow-sm"
          />
          <span className="text-2xl font-bold">Yu's Foodies</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/menu" className="hover:text-orange-200">Menu</Link>
          <Link href="/cart" className="relative flex items-center gap-1 hover:text-orange-200">
            <ShoppingCart size={22} />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-orange-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
