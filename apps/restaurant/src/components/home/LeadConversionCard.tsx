'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/components/animations/AnimationProvider';
import { AnimatedLogo } from '@/components/ui/animated-logo';
import { 
  SparklesIcon, 
  BarChart3Icon, 
  ClockIcon, 
  Tablet
} from 'lucide-react';

const features = [
  {
    icon: <SparklesIcon className="w-5 h-5" />,
    title: "Intuitive Menus",
    description: "Create and update your menu in minutes with our drag-and-drop interface."
  },
  {
    icon: <BarChart3Icon className="w-5 h-5" />,
    title: "Real-Time Analytics",
    description: "Track sales, orders, and customer trends with live dashboard updates."
  },
  {
    icon: <ClockIcon className="w-5 h-5" />,
    title: "Time-Saving Automation",
    description: "Automate order processing, inventory management, and staff scheduling."
  },
  {
    icon: <Tablet className="w-5 h-5" />,
    title: "Multi-Device Access",
    description: "Manage your restaurant from anywhere on any device."
  }
];

export function LeadConversionCard() {
  const { reducedMotion } = useAnimation();
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="bg-white p-8 md:p-12 flex flex-col h-full">
      {/* Desktop logo and tagline, hidden on mobile */}
      <div className="hidden md:flex md:flex-col md:items-start mb-8">
        <AnimatedLogo size="medium" />
        <motion.h1 
          className="text-3xl font-bold mt-4 text-neutral-900"
          variants={itemVariants}
        >
          Restaurant Management,{" "}
          <span className="text-primary-600">Simplified</span>
        </motion.h1>
        <motion.p 
          className="text-neutral-600 mt-2 max-w-md"
          variants={itemVariants}
        >
          Streamline your operations, delight your customers, and grow your business with Eatsome.
        </motion.p>
      </div>
      
      {/* Feature list */}
      <motion.div 
        className="space-y-6 my-auto"
        variants={reducedMotion ? {} : { visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index}
            className="flex gap-4 items-start"
            variants={itemVariants}
          >
            <div className="rounded-full p-2.5 bg-primary-100 text-primary-600 flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{feature.title}</h3>
              <p className="text-neutral-600 text-sm mt-1">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div
        className="mt-8"
        variants={itemVariants}
      >
        <Button size="lg" width="full" className="font-medium">
          Get Started Free
        </Button>
        <p className="text-center text-sm text-neutral-500 mt-3">
          No credit card required. Free 14-day trial.
        </p>
      </motion.div>
    </div>
  );
} 