'use client';

import { HeroSection } from '@/components/home/hero-section';
import { FeaturedRestaurants } from '@/components/home/featured-restaurants';
import { FeaturesSection } from '@/components/home/features-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { Footer } from '@/components/home/footer';

export default function HomePage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1'>
        <HeroSection />
        <FeaturedRestaurants />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
