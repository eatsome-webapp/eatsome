'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Order } from '@/types';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Utensils,
  ShoppingBag,
  Truck,
  Info,
  ClipboardCheck
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ActiveOrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

const ActiveOrderCard = ({ order, onStatusUpdate }: ActiveOrderCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  // Format creation time as relative time
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };
  
  // Get the right icon for the order type
  const getOrderTypeIcon = (type: string) => {
    switch(type) {
      case 'dine_in':
        return <Utensils className="h-4 w-4" />;
      case 'takeout':
        return <ShoppingBag className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'preparing':
        return 'bg-amber-100 text-amber-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
      case 'completed':
        return 'bg-neutral-100 text-neutral-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Get the next status options based on current status
  const getNextStatusOptions = (currentStatus: string) => {
    switch(currentStatus) {
      case 'new':
        return [
          { value: 'confirmed', label: 'Confirm Order' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'confirmed':
        return [
          { value: 'preparing', label: 'Start Preparing' },
          { value: 'cancelled', label: 'Cancel Order' }
        ];
      case 'preparing':
        return [
          { value: 'ready', label: 'Mark as Ready' }
        ];
      case 'ready':
        return order.orderType === 'delivery'
          ? [{ value: 'delivered', label: 'Mark as Delivered' }]
          : [{ value: 'completed', label: 'Mark as Completed' }];
      default:
        return [];
    }
  };
  
  const nextStatusOptions = getNextStatusOptions(order.status);
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <motion.div
      className="flex flex-col"
      layout={!prefersReducedMotion}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`border ${isExpanded ? 'border-b-0 rounded-b-none' : ''} cursor-pointer transition-colors`}
        onClick={toggleExpand}
      >
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium">{order.orderNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div className="text-sm text-neutral-500 mt-1 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {getTimeAgo(order.createdAt)}
                </div>
                
                <div className="w-1 h-1 rounded-full bg-neutral-300" />
                
                <div className="flex items-center gap-1 capitalize">
                  {getOrderTypeIcon(order.orderType)}
                  {order.orderType}
                </div>
              </div>
              
              <div className="text-sm mt-1">
                {order.orderType === 'dine_in' ? (
                  <span>Table {order.tableId?.replace('t', '')}</span>
                ) : (
                  <span>{order.customer?.name || 'Anonymous Customer'}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="font-medium">{formatCurrency(order.total)}</div>
                <div className="text-xs text-neutral-500">{order.items.length} items</div>
              </div>
              
              <div className="text-neutral-400">
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      {isExpanded && (
        <Card className="border border-t-0 rounded-t-none mb-2">
          <div className="p-3 pt-0">
            <div className="border-t border-neutral-200 pt-3 mt-1">
              <h4 className="text-sm font-medium mb-2">Order Items:</h4>
              <ul className="space-y-1">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-neutral-600">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Tax:</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {!!order.tip && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Tip:</span>
                    <span>{formatCurrency(order.tip)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium mt-1 pt-1 border-t border-neutral-100">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
              
              {order.customer && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <h4 className="text-sm font-medium mb-1">Customer:</h4>
                  <div className="text-sm">
                    <div>{order.customer.name}</div>
                    {order.customer.phone && <div>{order.customer.phone}</div>}
                    {order.customer.email && <div>{order.customer.email}</div>}
                  </div>
                </div>
              )}
              
              {order.orderType === 'delivery' && order.deliveryAddress && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <h4 className="text-sm font-medium mb-1">Delivery Address:</h4>
                  <div className="text-sm">
                    <div>{order.deliveryAddress.street}</div>
                    <div>
                      {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}
                    </div>
                  </div>
                </div>
              )}
              
              {nextStatusOptions.length > 0 && (
                <div className="mt-4 flex gap-2">
                  {nextStatusOptions.map(option => (
                    <Button 
                      key={option.value}
                      variant={option.value === 'cancelled' ? 'destructive' : 'default'}
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling expanded state
                        onStatusUpdate(order.id, option.value);
                      }}
                    >
                      {option.value === 'cancelled' ? null : (
                        <ClipboardCheck className="h-4 w-4 mr-1" />
                      )}
                      {option.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ActiveOrderCard; 