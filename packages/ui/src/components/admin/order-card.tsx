'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Clock, Package, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { LayeredCard } from '../ui/layered-card';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

interface OrderCardProps {
  id: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  time: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    options?: string[];
  }[];
  total: number;
  isNew?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onStatusChange?: (status: OrderStatus) => void;
  className?: string;
}

export function OrderCard({
  id,
  customerName,
  orderNumber,
  status,
  time,
  items,
  total,
  isNew = false,
  onAccept,
  onReject,
  onStatusChange,
  className,
}: OrderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Status color mapping
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    preparing: "bg-blue-100 text-blue-800",
    ready: "bg-emerald-100 text-emerald-800",
    delivering: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  
  // Status label mapping
  const statusLabels = {
    pending: "Pending",
    preparing: "Preparing",
    ready: "Ready",
    delivering: "Delivering",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  
  // Next status mapping
  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: "preparing",
    preparing: "ready",
    ready: "delivering",
    delivering: "completed",
  };
  
  // GSAP animation for new orders
  useEffect(() => {
    if (!cardRef.current || !isNew) return;
    
    const card = cardRef.current;
    
    gsap.fromTo(
      card,
      { 
        scale: 0.95,
        opacity: 0,
        y: 20
      },
      { 
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)",
        onComplete: () => {
          // Pulse animation
          gsap.to(card, {
            boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.3)",
            duration: 0.5,
            repeat: 3,
            yoyo: true,
          });
        }
      }
    );
  }, [isNew]);
  
  return (
    <LayeredCard
      ref={cardRef}
      className={cn(
        "overflow-hidden",
        isNew && "border-amber-300",
        className
      )}
      depth={isNew ? "deep" : "medium"}
      hover={false}
    >
      {/* Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <div>
          <span className="text-sm text-slate-500">Order #{orderNumber}</span>
          <h3 className="font-medium text-slate-800">{customerName}</h3>
        </div>
        
        <div className="flex items-center">
          <span className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            statusColors[status]
          )}>
            {statusLabels[status]}
          </span>
        </div>
      </div>
      
      {/* Order content */}
      <div className="p-5">
        {/* Time */}
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>{time}</span>
        </div>
        
        {/* Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-start">
              <span className="font-medium text-slate-700 mr-2">{item.quantity}x</span>
              <div className="flex-grow">
                <p className="text-slate-800">{item.name}</p>
                {item.options && item.options.length > 0 && (
                  <p className="text-sm text-slate-500">{item.options.join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="font-medium text-slate-700">Total</span>
          <span className="font-semibold text-slate-900">€{total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 flex justify-between">
        {status === "pending" ? (
          // Accept/Reject actions for pending orders
          <>
            <button 
              onClick={onReject}
              className="flex items-center px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-1.5" />
              Reject
            </button>
            <button 
              onClick={onAccept}
              className="flex items-center px-3 py-1.5 bg-white border border-green-200 text-green-600 rounded-md hover:bg-green-50"
            >
              <Check className="h-4 w-4 mr-1.5" />
              Accept
            </button>
          </>
        ) : (
          // Status update actions for other statuses
          <>
            {status !== "completed" && status !== "cancelled" && (
              <button 
                onClick={() => onStatusChange?.(nextStatus[status] as OrderStatus)}
                className="flex items-center px-3 py-1.5 bg-secondary text-white rounded-md hover:bg-secondary/90"
              >
                <Package className="h-4 w-4 mr-1.5" />
                {status === "pending" ? "Start Preparing" : 
                 status === "preparing" ? "Mark Ready" :
                 status === "ready" ? "Start Delivery" :
                 status === "delivering" ? "Complete Order" : ""}
              </button>
            )}
            
            {/* View Details button, positioned to the right when there's a primary action */}
            <button className="flex items-center px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50">
              View Details
            </button>
          </>
        )}
      </div>
    </LayeredCard>
  );
} 