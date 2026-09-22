'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Home, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/yu-panel-2026/login');
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-1">Yu's Foodies</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          href="/yu-panel-2026"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            pathname === '/yu-panel-2026' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition"
        >
          <Home size={20} /> View Shop
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
