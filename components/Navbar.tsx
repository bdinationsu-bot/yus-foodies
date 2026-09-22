import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function Navbar() {
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
          <Link href="/cart" className="flex items-center gap-1 hover:text-orange-200">
            <ShoppingCart size={20} /> Cart
          </Link>
        </div>
      </div>
    </nav>
  );
}
