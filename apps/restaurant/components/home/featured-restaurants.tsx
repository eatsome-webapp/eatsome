'use client';

import { motion } from 'framer-motion';
import { BentoCard } from '@/components/ui/bento-grid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const restaurants = [
  {
    id: 1,
    name: 'Sushi Master',
    cuisine: 'Japanese',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: '/images/restaurants/sushi-master.jpg',
  },
  {
    id: 2,
    name: 'Burger House',
    cuisine: 'American',
    rating: 4.5,
    deliveryTime: '15-25 min',
    image: '/images/restaurants/burger-house.jpg',
  },
  {
    id: 3,
    name: 'Pasta Paradise',
    cuisine: 'Italian',
    rating: 4.7,
    deliveryTime: '25-35 min',
    image: '/images/restaurants/pasta-paradise.jpg',
  },
];

export function FeaturedRestaurants() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Featured Restaurants</h2>
            <p className="text-muted-foreground mt-2">Discover the best dining experiences in town</p>
          </div>
          <Button variant="ghost" className="text-primary hover:bg-primary/10">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant, i) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <BentoCard className="overflow-hidden group h-full hover:shadow-lg transition-shadow duration-300">
                <div className="relative pt-[75%] bg-zinc-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 p-4 z-20">
                    <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
                    <p className="text-sm text-white/90">{restaurant.cuisine}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    ⭐ {restaurant.rating}
                  </div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${restaurant.image})` }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>🕒 {restaurant.deliveryTime}</span>
                    </div>
                    <Button size="sm" className="rounded-full">Order Now</Button>
                  </div>
                </div>
              </BentoCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
