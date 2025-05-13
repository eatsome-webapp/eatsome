'use client';

import { useEffect } from 'react';

export default function RestaurantLoginPage() {
  useEffect(() => {
    // Redirect to homepage using direct page navigation
    window.location.href = '/';
  }, []);

  // Return empty div while redirecting
  return <div />;
}