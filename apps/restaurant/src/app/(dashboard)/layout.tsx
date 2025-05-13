import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { DashboardProvider } from '@/context/DashboardContext';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restaurant Dashboard | Eatsome',
  description: 'Manage your restaurant operations with Eatsome',
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  try {
    const supabase = await createClient();
    
    // First, we need to refresh the session
    await supabase.auth.getSession();
    
    // Then try to get the user
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Authentication error:", error);
      return redirect('/?auth_error=session_expired');
    }
    
    if (!data?.user) {
      return redirect('/');
    }

    return (
      <DashboardProvider initialRole={data?.user?.user_metadata?.role || 'owner'}>
        <DashboardContainer>
          <div className="min-h-screen bg-neutral-50">
            <main className="container mx-auto p-4">
              {children}
            </main>
          </div>
        </DashboardContainer>
      </DashboardProvider>
    );
  } catch (err) {
    console.error("Unexpected error in dashboard layout:", err);
    return redirect('/?error=unexpected'); 
  }
} 