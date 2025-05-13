'use client';

import React, { createContext, useContext, useState } from 'react';

interface Restaurant {
  id: string;
  name: string;
  address?: string;
  logo?: string;
  // Add other restaurant properties as needed
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  setRestaurant: (restaurant: Restaurant) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider = ({ 
  children,
  initialData 
}: { 
  children: React.ReactNode;
  initialData?: Restaurant | null;
}) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(initialData || null);
  
  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}; 