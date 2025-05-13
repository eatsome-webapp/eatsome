'use client';

import React, { useState } from 'react';
import { Pencil, Trash, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderItem as OrderItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface OrderItemProps {
  item: OrderItemType;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
  onNotesChange: (notes: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
  onNotesChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(item.notes || '');
  
  const handleIncrementQuantity = () => {
    onQuantityChange(item.quantity + 1);
  };
  
  const handleDecrementQuantity = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    }
  };
  
  const handleSaveNotes = () => {
    onNotesChange(notes);
    setIsEditing(false);
  };
  
  return (
    <div className="border border-neutral-200 rounded-md p-2 mb-2 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between">
            <div className="font-medium">{item.name}</div>
            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
          </div>
          
          <div className="text-sm text-neutral-500 mt-1">
            {formatCurrency(item.price)} each
          </div>
          
          {item.notes && !isEditing && (
            <div className="text-sm text-neutral-600 mt-1 italic">
              {item.notes}
            </div>
          )}
          
          {isEditing && (
            <div className="mt-2 space-y-2">
              <Input
                type="text"
                placeholder="Add special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-sm py-1 h-auto"
              />
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleSaveNotes}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-100">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleDecrementQuantity}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="mx-2 w-6 text-center">{item.quantity}</span>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7"
            onClick={handleIncrementQuantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-neutral-500 hover:text-neutral-700"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-neutral-500 hover:text-red-500"
            onClick={onRemove}
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderItem; 