'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '@/components/animations/AnimationProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeOffIcon, ChefHatIcon } from 'lucide-react';
import { Label } from '@/components/ui/Label';
import { createClient } from '@eatsome/auth/client';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { reducedMotion } = useAnimation();
  const supabase = createClient();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Real authentication with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Check if user has restaurant_owner role
      const isRestaurantOwner = data.user?.user_metadata?.role === 'restaurant_owner';

      if (!isRestaurantOwner) {
        throw new Error('Geen toegang. Alleen restaurant eigenaren kunnen inloggen op dit platform.');
      }
      
      // Force full page refresh instead of client-side navigation to prevent Next.js version skew issues
      window.location.href = '/dashboard';
    } catch (err: any) {
      // Special handling for "Cannot read properties of undefined" error which is likely a Next.js version skew issue
      if (err.message && (err.message.includes('Cannot read properties of undefined') || 
                           err.message.includes('property of undefined') || 
                           err.message.includes('is not a function'))) {
        setError('Er is een probleem met de sessie. Probeer de pagina te vernieuwen.');
        console.error('Next.js version skew detected:', err);
      } else {
        setError(err.message || 'Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-primary-50 p-8 md:p-12 flex flex-col h-full">
      <motion.div
        className="flex flex-col h-full justify-center"
        variants={reducedMotion ? {} : { visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center">
            <ChefHatIcon size={28} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold mt-3">Welcome Back</h2>
          <p className="text-neutral-600 text-sm mt-1">Sign in to access your restaurant dashboard</p>
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          variants={itemVariants}
        >
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@restaurant.com"
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <a href="/auth/reset-password" className="text-xs text-primary-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            width="full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </motion.form>
        
        <motion.div
          className="border-t border-neutral-200 mt-8 pt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-neutral-600">
            New to Eatsome?{' '}
            <a href="/auth/register" className="text-primary-600 font-medium hover:underline">
              Create an account
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 