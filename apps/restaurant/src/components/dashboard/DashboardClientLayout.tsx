'use client';

import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import { OrderProvider } from '@/context/OrderContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { ReactNode } from 'react';

interface DashboardClientLayoutProps {
  children: ReactNode;
  userRole: string;
}

export default function DashboardClientLayout({
  children,
  userRole,
}: DashboardClientLayoutProps) {
  return (
    <OrderProvider>
      <DashboardProvider initialRole={userRole}>
        <div className="flex h-screen bg-neutral-50 overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </DashboardProvider>
    </OrderProvider>
  );
} 