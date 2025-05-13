'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Edit, Plus, Save, Table as TableIcon } from 'lucide-react';
import { Table } from '@/types';
import { cn } from '@/lib/utils';

// Mock data for tables
const MOCK_TABLES: Table[] = [
  { id: 't1', name: 'Table 1', x: 100, y: 100, width: 80, height: 80, seats: 2, status: 'available' },
  { id: 't2', name: 'Table 2', x: 220, y: 100, width: 80, height: 80, seats: 2, status: 'occupied' },
  { id: 't3', name: 'Table 3', x: 100, y: 220, width: 160, height: 80, seats: 4, status: 'available' },
  { id: 't4', name: 'Table 4', x: 300, y: 220, width: 160, height: 80, seats: 4, status: 'reserved' },
  { id: 't5', name: 'Table 5', x: 100, y: 340, width: 240, height: 80, seats: 6, status: 'available' },
  { id: 't6', name: 'Table 6', x: 380, y: 100, width: 80, height: 80, seats: 2, status: 'available' },
  { id: 't7', name: 'Table 7', x: 500, y: 100, width: 80, height: 240, seats: 8, status: 'occupied' },
];

// Table component for the floor plan
const TableComponent = ({ 
  table, 
  isSelected, 
  isEditing, 
  onSelect,
  onDragEnd
}: { 
  table: Table, 
  isSelected: boolean, 
  isEditing: boolean,
  onSelect: () => void,
  onDragEnd?: (table: Table, x: number, y: number) => void
}) => {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(table.x);
  const y = useMotionValue(table.y);
  const dragControls = useDragControls();
  
  useEffect(() => {
    x.set(table.x);
    y.set(table.y);
  }, [table.x, table.y, x, y]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-200';
      case 'occupied':
        return 'bg-red-100 border-red-200';
      case 'reserved':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-neutral-100 border-neutral-200';
    }
  };
  
  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd(table, x.get(), y.get());
    }
  };
  
  return (
    <motion.div
      className={cn(
        "absolute rounded-md border-2 cursor-pointer flex items-center justify-center select-none",
        getStatusColor(table.status),
        isSelected && "ring-2 ring-primary-500"
      )}
      style={{ 
        x, 
        y, 
        width: table.width, 
        height: table.height,
        zIndex: isSelected ? 10 : 5
      }}
      whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
      onClick={onSelect}
      drag={isEditing}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
    >
      <div className="text-center">
        <div className="font-medium text-sm">{table.name}</div>
        <div className="text-xs text-neutral-600">{table.seats} seats</div>
      </div>
    </motion.div>
  );
};

const FloorPlan = () => {
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const floorplanRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Set up zoom animation with GSAP
  const zoomIn = () => {
    if (scale < 2) {
      gsap.to(floorplanRef.current, {
        scale: scale + 0.1,
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "power2.out",
        onComplete: () => setScale(scale + 0.1)
      });
    }
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      gsap.to(floorplanRef.current, {
        scale: scale - 0.1,
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "power2.out",
        onComplete: () => setScale(scale - 0.1)
      });
    }
  };

  const resetView = () => {
    gsap.to(floorplanRef.current, {
      scale: 1,
      x: 0,
      y: 0,
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: "power2.out",
      onComplete: () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    });
  };

  // Handle mouse/touch events for dragging the floor plan
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isEditing) return;
    
    setIsDragging(true);
    
    if ('touches' in e) {
      setStartPos({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    } else {
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || isEditing) return;
    
    let newX: number, newY: number;
    
    if ('touches' in e) {
      newX = e.touches[0].clientX - startPos.x;
      newY = e.touches[0].clientY - startPos.y;
    } else {
      newX = e.clientX - startPos.x;
      newY = e.clientY - startPos.y;
    }
    
    setPosition({ x: newX, y: newY });
    
    if (floorplanRef.current) {
      floorplanRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${scale})`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle table selection
  const handleTableSelect = (tableId: string) => {
    if (isEditing) return;
    setSelectedTable(tableId === selectedTable ? null : tableId);
  };

  // Handle table drag end in edit mode
  const handleTableDragEnd = (table: Table, x: number, y: number) => {
    setTables(tables.map(t => 
      t.id === table.id ? { ...t, x, y } : t
    ));
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedTable(null);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-0 shadow-none">
      <div className="p-3 border-b border-neutral-200 flex justify-between items-center bg-white sticky top-0 z-10">
        <h2 className="font-semibold text-lg">Floor Plan</h2>
        
        <div className="flex gap-2">
          <div className="flex bg-neutral-100 rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <span className="text-lg">-</span>
            </Button>
            
            <div className="px-2 flex items-center text-sm">
              {Math.round(scale * 100)}%
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={zoomIn}
              disabled={scale >= 2}
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={resetView}
          >
            Reset
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleEditMode}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isEditing ? "Exit Edit Mode" : "Edit Floor Plan"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {isEditing && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Table</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Table Name</label>
                    <Input placeholder="e.g. Table 8" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Seats</label>
                      <Input type="number" min="1" defaultValue="2" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Shape</label>
                      <select className="w-full h-10 border rounded-md px-3">
                        <option>Rectangle</option>
                        <option>Circle</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Width</label>
                      <Input type="number" min="50" defaultValue="80" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Height</label>
                      <Input type="number" min="50" defaultValue="80" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Table
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                // Save floor plan logic here
                setIsEditing(false);
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        <div 
          className="absolute inset-0 bg-neutral-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Floor plan background with grid */}
          <div 
            ref={floorplanRef}
            className="absolute origin-center w-full h-full"
            style={{ 
              backgroundImage: 'radial-gradient(circle, #00000005 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
            }}
          >
            {/* Tables */}
            {tables.map(table => (
              <TableComponent 
                key={table.id}
                table={table}
                isSelected={selectedTable === table.id}
                isEditing={isEditing}
                onSelect={() => handleTableSelect(table.id)}
                onDragEnd={handleTableDragEnd}
              />
            ))}
          </div>
        </div>
      </div>
      
      {selectedTable && !isEditing && (
        <div className="p-3 border-t border-neutral-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">
                {tables.find(t => t.id === selectedTable)?.name}
              </h3>
              <p className="text-sm text-neutral-500">
                {tables.find(t => t.id === selectedTable)?.seats} seats - {' '}
                <span className="capitalize">
                  {tables.find(t => t.id === selectedTable)?.status}
                </span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
              >
                View Orders
              </Button>
              
              <Button size="sm">
                <TableIcon className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FloorPlan; 