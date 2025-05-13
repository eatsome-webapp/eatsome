'use client';

import React from 'react';
import POSHeader from '@/components/pos/POSHeader';

export default function POSPageClient() {
  // For now, we'll render the POS interface
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <POSHeader />
      
      {/* The actual content is implemented in layout.tsx */}
      <div className="flex-1 flex overflow-hidden">
        {/* POS content will be rendered here from layout.tsx */}
      </div>
    </div>
  );
} 