import Link from 'next/link';
import { ShoppingCart, Utensils } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Utensils /> Yu's Foodies
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
}import Link from 'next/link';
import { ShoppingCart, Utensils } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-orange-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
          <Utensils /> Yu's Foodies
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
