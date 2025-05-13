'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@eatsome/auth/client';
import Image from 'next/image';

export default function RestaurantRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'restaurant_owner',
            restaurant_name: restaurantName
          }
        }
      });

      if (signUpError) throw signUpError;

      // Show success message and redirect to login
      alert('Registratie geslaagd! Controleer je email om je account te bevestigen.');
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden bij het registreren.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image 
              src="/logo.png" 
              alt="Eatsome Restaurant" 
              width={120} 
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Registreer je restaurant</h1>
          <p className="text-gray-500 mt-2">Maak een account aan om je restaurant te beheren</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700 mb-1">
              Naam van je restaurant
            </label>
            <input
              id="restaurantName"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Restaurant naam"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="restaurant@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="Minimaal 8 tekens"
            />
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              Door te registreren ga je akkoord met onze{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Algemene Voorwaarden
              </Link>{' '}
              en{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Privacybeleid
              </Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
          >
            {loading ? 'Bezig met registreren...' : 'Registreer je restaurant'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Heb je al een account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Log hier in
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>
            Hulp nodig? Neem contact op met{' '}
            <a href="mailto:partners@eatsome.nl" className="font-medium text-primary-600 hover:text-primary-500">
              partners@eatsome.nl
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 