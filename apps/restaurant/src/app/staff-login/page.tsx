'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPIN } from '@repo/auth';

export default function StaffLoginPage() {
  const [pin, setPin] = useState('');
  const [restaurantId, setRestaurantId] = useState('demo-restaurant'); // In a real app, get this from URL or context
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom') || '/(staff)/orders';
  
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin || pin.length < 4) {
      setError('Please enter a valid PIN');
      return;
    }
    
    setLoading(true);
    
    try {
      // Try to sign in with PIN
      await signInWithPIN(restaurantId, pin);
      
      // Navigate to the redirected path or default staff page
      router.push(redirectedFrom);
    } catch (err) {
      setError('Invalid PIN. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-4xl font-bold text-center">
        Staff Login
      </h1>
      <p className="mt-3 text-xl">
        Enter your PIN to access the restaurant dashboard
      </p>
      
      <form onSubmit={handleSubmit} className="mt-6 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="pin" className="block text-gray-700 font-medium mb-2">
            Staff PIN
          </label>
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={handlePinChange}
            placeholder="Enter your PIN"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
            autoComplete="off"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md 
                     ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
} 