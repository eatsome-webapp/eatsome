'use client';

import { motion } from 'framer-motion';
import { BentoCard } from '../ui/bento-grid';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Blogger',
    avatar: '/images/avatars/avatar-1.jpg',
    content: 'The food arrived hot and fresh, just like dining in a restaurant. The delivery was faster than expected!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Regular Customer',
    avatar: '/images/avatars/avatar-2.jpg',
    content: 'Amazing selection of restaurants. I love trying new cuisines without leaving my home. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'Office Manager',
    avatar: '/images/avatars/avatar-3.jpg',
    content: 'Perfect for our team lunches. The group ordering feature saves us so much time and hassle.',
    rating: 4,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers have to say about their experience with EatSome.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="h-full"
            >
              <BentoCard className="h-full p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 overflow-hidden mr-4">
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </BentoCard>
              </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-2">Ready to join thousands of satisfied customers?</h3>
          <p className="text-muted-foreground mb-6">Sign up now and get $10 off your first order!</p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
