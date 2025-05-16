'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 via-white to-amber-50" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24 h-full flex flex-col">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Column - Conversion */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                Premium Food, <br />
                <span className="text-primary">Delivered Fast</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Experience restaurant-quality meals from the best local chefs, delivered to your door in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="text-lg px-8 py-6">
                  Order Now
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Menu
                </Button>
              </div>
            </motion.div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {[
                { icon: '🚀', title: 'Fast Delivery', desc: '30 min or free' },
                { icon: '🍽️', title: '100+ Restaurants', desc: 'Endless choices' },
                { icon: '⭐', title: '4.9/5', desc: '10,000+ reviews' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                  className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-amber-100"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Login */}
          <div className="lg:col-span-5 flex items-center">
            <BentoCard 
              variant="elevated"
              className="w-full p-8 space-y-6"
              motionProps={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.3, duration: 0.6 }
              }}
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Welcome Back</h2>
                <p className="text-muted-foreground">Sign in to your account</p>
              </div>
              
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input id="email" type="email" placeholder="your@email.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <a href="#" className="text-sm text-primary hover:underline">Forgot?</a>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" className="h-12" />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary" />
                  <label htmlFor="remember" className="text-sm font-medium">Remember me</label>
                </div>
                
                <Button type="submit" className="w-full h-12 text-lg">
                  Sign In
                </Button>
                
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <a href="#" className="font-medium text-primary hover:underline">Sign up</a>
                </p>
              </form>
              
              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Button variant="outline" className="h-11">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="h-11">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
    </section>
  );
}
