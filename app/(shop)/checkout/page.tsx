'use client';

import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('COD');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (!name || !phone || !address) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.from('orders').insert({
      customer_name: name,
      phone: phone,
      address: address,
      payment_method: payment,
      items: items,
      total: getTotal(),
    });

    setLoading(false);

    if (error) {
      alert('Error placing order: ' + error.message);
    } else {
      alert('Order placed successfully! We will contact you soon.');
      // Cart ကို ရှင်းပါ
      useCartStore.setState({ items: [] });
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>
        
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Your cart is empty. Please add items to checkout.</p>
        ) : (
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="09xxxxxxxxx"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Delivery Address</label>
                  <textarea 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full address"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="COD" checked={payment === 'COD'} onChange={(e) => setPayment(e.target.value)} className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="KPay" checked={payment === 'KPay'} onChange={(e) => setPayment(e.target.value)} className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700">KPay / WavePay (Manual Transfer)</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between border-b py-2">
                  <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold text-gray-800">{item.price * item.quantity} MMK</span>
                </div>
              ))}
              <div className="mt-4 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-orange-600">{getTotal()} MMK</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
