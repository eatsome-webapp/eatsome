'use client';

import { motion } from 'framer-motion';
import { BentoCard } from '@/components/ui/bento-grid';
import { Clock, Shield, Truck, Utensils } from 'lucide-react';

const features = [
  {
    icon: <Truck className="w-8 h-8 text-primary" />,
    title: 'Fast Delivery',
    description: 'Get your favorite meals delivered to your door in under 30 minutes.',
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: '100% Safe',
    description: 'Contactless delivery and strict hygiene standards for your safety.',
  },
  {
    icon: <Utensils className="w-8 h-8 text-primary" />,
    title: 'Top Restaurants',
    description: 'Choose from hundreds of top-rated restaurants in your city.',
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to assist you.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-zinc-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose EatSome</h2>
          <p className="text-muted-foreground text-lg">
            We're committed to providing you with the best food delivery experience possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <BentoCard className="h-full p-6 hover:shadow-md transition-shadow duration-300">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </BentoCard>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to satisfy your cravings?
            </h3>
            <p className="text-muted-foreground mb-6">
              Download our app and get 50% off your first order. Limited time offer!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                Download on the App Store
              </button>
              <button className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                Get it on Google Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
