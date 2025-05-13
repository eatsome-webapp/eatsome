import React from 'react';
import { getUserRestaurants } from '@eatsome/auth/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Eatsome Restaurant',
  description: 'Manage your restaurant operations with Eatsome',
};

export default function RestaurantDashboardPage() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome to Your Dashboard</h1>
        <p className="text-neutral-600 mt-1">
          Manage your restaurant operations from this central hub
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            Getting Started
          </h2>
          <p className="text-neutral-700 mb-4">
            Configure your restaurant profile, add menu items, and manage staff.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-neutral-600">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs mr-2">
                    1
                  </div>
                  Complete your restaurant profile
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs mr-2">
                    2
                  </div>
                  Add your first menu items
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs mr-2">
                    3
                  </div>
                  Invite your staff
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center text-neutral-800">
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                +
              </div>
              Add Menu Item
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center text-neutral-800">
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                +
              </div>
              Add Staff Member
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors flex items-center text-neutral-800">
              <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                +
              </div>
              View Orders
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">
            Today's Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-neutral-600">Orders</div>
              <div className="text-lg font-medium">0</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-neutral-600">Revenue</div>
              <div className="text-lg font-medium">€0.00</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-neutral-600">Reservations</div>
              <div className="text-lg font-medium">0</div>
            </div>
            <div className="pt-4 border-t border-neutral-100 text-center">
              <button className="text-primary-600 text-sm hover:text-primary-700 hover:underline">
                View full analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 