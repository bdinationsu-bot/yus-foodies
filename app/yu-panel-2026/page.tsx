'use client';

import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  payment_method: string;
  total: number;
  status: string;
  items: any[];
  created_at: string;
}

export default function AdminPage() {
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  }

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return alert('Please fill name and price.');
    const { error } = await supabase.from('products').insert({
      name,
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=60',
    });
    if (error) alert('Error: ' + error.message);
    else {
      setName(''); setPrice(''); setImage('');
      fetchProducts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  }

  async function handleOrderStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('products')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${tab === 'products' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Products
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${tab === 'orders' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            <Package size={18} /> Orders ({orders.length})
          </button>
        </div>

        {tab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={24} /> Add New Product
              </h2>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" required />
                <input type="number" placeholder="Price (MMK)" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" required />
                <input type="text" placeholder="Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" />
                <button type="submit" className="md:col-span-3 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition">Add Product</button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Products ({products.length})</h2>
              {loading ? <p className="text-gray-500">Loading...</p> : (
                <div className="space-y-3">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between border-b py-3 last:border-0">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded" />
                        <div>
                          <h3 className="font-semibold text-gray-800">{product.name}</h3>
                          <p className="text-sm text-orange-600 font-bold">{product.price} MMK</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">All Orders ({orders.length})</h2>
            {orders.length === 0 ? <p className="text-gray-500">No orders yet.</p> : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{order.customer_name}</h3>
                        <p className="text-sm text-gray-600">📞 {order.phone}</p>
                        <p className="text-sm text-gray-600">📍 {order.address}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-600">{order.total} MMK</p>
                        <p className="text-sm text-gray-600">{order.payment_method}</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      {order.items.map((item: any, i: number) => (
                        <p key={i} className="text-sm text-gray-600">• {item.name} x {item.quantity} = {item.price * item.quantity} MMK</p>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleOrderStatus(order.id, 'confirmed')} className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Confirm</button>
                      <button onClick={() => handleOrderStatus(order.id, 'delivered')} className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600">Delivered</button>
                      <button onClick={() => handleOrderStatus(order.id, 'cancelled')} className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
