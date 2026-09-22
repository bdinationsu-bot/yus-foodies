'use client';

import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Package, LogOut, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
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

const CATEGORIES = ['Chips', 'Chocolate', 'Drinks', 'Cookies', 'Popcorn', 'Other'];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Chips');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    setImage(data.publicUrl);
    setUploading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return alert('Please fill name and price.');
    if (!image) return alert('Please upload a product image.');

    const { error } = await supabase.from('products').insert({
      name,
      price: Number(price),
      category,
      image,
    });

    if (error) alert('Error: ' + error.message);
    else {
      setName(''); setPrice(''); setImage(''); setCategory('Chips');
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

  async function handleLogout() {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/yu-panel-2026/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard - Yu's Foodies</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded hover:bg-red-600">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('products')} className={`px-6 py-2 rounded-lg font-semibold transition ${tab === 'products' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            Products
          </button>
          <button onClick={() => setTab('orders')} className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${tab === 'orders' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
            <Package size={18} /> Orders ({orders.length})
          </button>
        </div>

        {tab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={24} /> Add New Product
              </h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" required />
                  <input type="number" placeholder="Price (MMK)" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2" required />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2">
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Product Image</label>
                  {image ? (
                    <div className="relative inline-block">
                      <img src={image} alt="Preview" className="w-40 h-40 object-cover rounded-lg border-2 border-orange-500" />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-500 text-sm">
                        {uploading ? 'Uploading...' : 'Click to upload product photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                </div>

                <button type="submit" disabled={uploading} className="w-full bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50">
                  Add Product
                </button>
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
                          <p className="text-sm text-gray-500">{product.category}</p>
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
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
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
    </div>
  );
}
