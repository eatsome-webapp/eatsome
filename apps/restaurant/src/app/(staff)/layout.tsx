'use client';

import { signOut } from '@repo/auth';
import Link from 'next/link';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/staff-login';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold">EatSome Staff</h2>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/(staff)/orders"
                className="block px-6 py-3 text-gray-600 hover:bg-gray-100"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link 
                href="/(staff)/kitchen"
                className="block px-6 py-3 text-gray-600 hover:bg-gray-100"
              >
                Kitchen View
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto p-6">
          <button 
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
} 