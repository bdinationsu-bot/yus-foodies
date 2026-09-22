import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to Yu's Foodies
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your favorite snacks, delivered fast to your doorstep.
        </p>
        <Link href="/menu" className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition inline-block">
          Shop Snacks
        </Link>
      </div>
    </main>
  );
}
