'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderMode } from '@/app/(dashboard)/pos/layout';
import { useOrder } from '@/context/OrderContext';
import { formatCurrency } from '@/lib/utils';
import { User, MapPin, CreditCard, DollarSign, Percent, Trash2, Plus, Minus, Pencil } from 'lucide-react';
import OrderItem from './OrderItem';

interface OrderSummaryProps {
  mode: OrderMode;
  compactMode?: boolean;
}

const OrderSummary = ({ mode, compactMode = false }: OrderSummaryProps) => {
  const [activeSection, setActiveSection] = useState<'items' | 'customer' | 'payment'>('items');
  const { 
    currentOrder, 
    removeItem, 
    updateItemQuantity, 
    updateItemNotes,
    clearOrder,
    sendOrder,
    loading
  } = useOrder();
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateItemQuantity(itemId, newQuantity);
  };
  
  const handleNotesChange = (itemId: string, notes: string) => {
    updateItemNotes(itemId, notes);
  };
  
  const handleSendOrder = async () => {
    try {
      await sendOrder();
      // Order was sent successfully
      console.log('Order sent successfully');
    } catch (error) {
      console.error('Error sending order:', error);
    }
  };
  
  if (!currentOrder) {
    return <div className="flex-1 flex items-center justify-center text-neutral-400">Loading order...</div>;
  }
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 border-b border-neutral-200">
          <TabsList className="w-full grid grid-cols-3 h-10">
            <TabsTrigger
              value="items"
              onClick={() => setActiveSection('items')}
              className="text-xs"
            >
              Items ({currentOrder.items.length})
            </TabsTrigger>
            <TabsTrigger
              value="customer"
              onClick={() => setActiveSection('customer')}
              className="text-xs"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              onClick={() => setActiveSection('payment')}
              className="text-xs"
            >
              Payment
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="items" className="flex-1 overflow-auto m-0 p-0">
          {currentOrder.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-neutral-400">
              <p className="text-center mb-2">No items added to the order yet</p>
              <p className="text-center text-sm">
                Select items from the menu to add them to this order
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              {currentOrder.items.map(item => (
                <OrderItem
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                  onNotesChange={(notes) => handleNotesChange(item.id, notes)}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="customer" className="flex-1 overflow-auto m-0 p-3 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer Name</label>
            <div className="relative">
              <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input 
                type="text" 
                placeholder="Enter customer name" 
                className="pl-8" 
                value={currentOrder.customer?.name || ''} 
                onChange={(e) => {/* Update customer name */}} 
              />
            </div>
          </div>
          
          {mode === OrderMode.DELIVERY && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input 
                  type="text" 
                  placeholder="Enter delivery address" 
                  className="pl-8" 
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input 
              type="tel" 
              placeholder="Enter phone number" 
              value={currentOrder.customer?.phone || ''} 
              onChange={(e) => {/* Update phone */}} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Special Requests</label>
            <textarea 
              placeholder="Enter any special requests"
              className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={currentOrder.notes || ''}
              onChange={(e) => {/* Update notes */}}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="payment" className="flex-1 overflow-auto m-0 p-3 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3"
                onClick={() => {/* Set payment method */}}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Card
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-auto py-3"
                onClick={() => {/* Set payment method */}}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Cash
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Tip Amount</label>
            <Input 
              type="number" 
              placeholder="Enter tip amount" 
              value={currentOrder.tip || ''} 
              onChange={(e) => {/* Update tip */}} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Discount</label>
            <div className="relative">
              <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input 
                type="number" 
                placeholder="Enter discount amount" 
                className="pl-8" 
                value={currentOrder.discount || ''} 
                onChange={(e) => {/* Update discount */}} 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Order Summary */}
      <div className="border-t border-neutral-200 p-3 space-y-3 bg-neutral-50">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal</span>
          <span>{formatCurrency(currentOrder.subtotal)}</span>
        </div>
        
        {!!currentOrder.discount && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Discount</span>
            <span>- {formatCurrency(currentOrder.discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <span>{formatCurrency(currentOrder.tax)}</span>
        </div>
        
        {!!currentOrder.tip && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Tip</span>
            <span>{formatCurrency(currentOrder.tip)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-2 border-t border-neutral-200">
          <span>Total</span>
          <span>{formatCurrency(currentOrder.total)}</span>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={clearOrder}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          <Button 
            size="sm" 
            className="flex-1"
            onClick={handleSendOrder}
            disabled={currentOrder.items.length === 0 || loading}
          >
            Send Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 