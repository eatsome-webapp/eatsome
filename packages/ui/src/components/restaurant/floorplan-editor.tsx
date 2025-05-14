'use client';

import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { 
  DndContext, DragEndEvent, useDraggable, 
  useDroppable, DragStartEvent
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { LayeredCard, CardHeader, CardContent, CardFooter } from '../ui/layered-card';
import { Button } from '../ui/button';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '../ui/tabs';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { gsap } from 'gsap';
import { cn } from '../../lib/utils';
import { 
  Trash2, Save, Undo, Redo, Plus, Minus, 
  Move, Grid, Eye, EyeOff, ChevronRight, ChevronLeft,
  Square, Circle, Coffee, Users, Utensils, Table, MessageSquareText,
  Layers
} from 'lucide-react';

// Define interfaces for our object types
interface FloorplanObject {
  id: string;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  angle: number;
  fill: string;
  name?: string;
  capacity?: number;
  status?: 'available' | 'reserved' | 'occupied' | 'unavailable';
  reservationId?: string;
  customProperties?: Record<string, any>;
}

interface Floor {
  id: string;
  name: string;
  objects: FloorplanObject[];
  background?: string;
  grid?: boolean;
  gridSize?: number;
}

interface FloorplanEditorProps {
  className?: string;
  initialFloors?: Floor[];
  onSave?: (floors: Floor[]) => void;
  readOnly?: boolean;
  showReservations?: boolean;
  reservations?: any[]; // Type for reservations data
}

type EditorMode = 'design' | 'reservations';

// Draggable palette item
function PaletteItem({ type, label, icon }: { type: string; label: string; icon: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type }
  });
  
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-lg cursor-grab bg-white border border-slate-200 transition-all",
        isDragging ? "shadow-lg opacity-50" : "hover:shadow-md",
      )}
      style={{
        transform: CSS.Translate.toString(transform)
      }}
    >
      <div className="text-slate-700 mb-1">
        {icon}
      </div>
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}

export function FloorplanEditor({
  className,
  initialFloors = [],
  onSave,
  readOnly = false,
  showReservations = false,
  reservations = []
}: FloorplanEditorProps) {
  // State
  const [floors, setFloors] = useState<Floor[]>(initialFloors.length > 0 ? initialFloors : [
    { 
      id: 'floor-1', 
      name: 'Main Floor', 
      objects: [], 
      grid: true, 
      gridSize: 20 
    }
  ]);
  const [activeFloorId, setActiveFloorId] = useState<string>(floors[0]?.id || '');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [mode, setMode] = useState<EditorMode>(showReservations ? 'reservations' : 'design');
  const [showProperties, setShowProperties] = useState<boolean>(true);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [history, setHistory] = useState<Floor[][]>([floors]);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Get active floor
  const activeFloor = floors.find(f => f.id === activeFloorId) || floors[0];
  
  // Get selected object
  const selectedObject = activeFloor?.objects.find(obj => obj.id === selectedObjectId) || null;

  // Initialize canvas when component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create canvas instance
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#f8fafc',
      selection: !readOnly,
      preserveObjectStacking: true
    });
    
    canvasInstanceRef.current = canvas;
    
    // Add grid if enabled
    if (activeFloor?.grid) {
      drawGrid(canvas, activeFloor.gridSize || 20);
    }
    
    // Load objects
    loadFloorObjects(canvas, activeFloor?.objects || []);
    
    // Set up event listeners
    if (!readOnly) {
      canvas.on('object:modified', handleObjectModified);
      canvas.on('selection:created', handleSelectionCreated);
      canvas.on('selection:updated', handleSelectionCreated);
      canvas.on('selection:cleared', handleSelectionCleared);
    }
    
    // Cleanup
    return () => {
      canvas.dispose();
    };
  }, [activeFloorId]); // Re-initialize when floor changes
  
  // Update canvas when floor objects change
  useEffect(() => {
    if (!canvasInstanceRef.current) return;
    
    // Clear canvas
    canvasInstanceRef.current.clear();
    
    // Set background
    canvasInstanceRef.current.setBackgroundColor(
      activeFloor?.background || '#f8fafc', 
      canvasInstanceRef.current.renderAll.bind(canvasInstanceRef.current)
    );
    
    // Add grid if enabled
    if (activeFloor?.grid) {
      drawGrid(canvasInstanceRef.current, activeFloor.gridSize || 20);
    }
    
    // Load objects
    loadFloorObjects(canvasInstanceRef.current, activeFloor?.objects || []);
    
  }, [activeFloor?.objects, activeFloor?.grid, activeFloor?.gridSize, activeFloor?.background]);
  
  // Apply zoom
  useEffect(() => {
    if (!canvasInstanceRef.current) return;
    
    canvasInstanceRef.current.setZoom(zoom);
    canvasInstanceRef.current.renderAll();
    
  }, [zoom]);
  
  // Apply read-only mode
  useEffect(() => {
    if (!canvasInstanceRef.current) return;
    
    canvasInstanceRef.current.selection = !readOnly;
    canvasInstanceRef.current.getObjects().forEach((obj) => {
      obj.selectable = !readOnly;
      obj.evented = !readOnly;
    });
    
    canvasInstanceRef.current.renderAll();
  }, [readOnly]);
  
  // Helper to draw grid
  const drawGrid = (canvas: fabric.Canvas, gridSize: number) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    for (let i = 0; i < width / gridSize; i++) {
      canvas.add(new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#e2e8f0',
        selectable: false,
        evented: false
      }));
    }
    
    for (let i = 0; i < height / gridSize; i++) {
      canvas.add(new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#e2e8f0',
        selectable: false,
        evented: false
      }));
    }
  };
  
  // Helper to load floor objects
  const loadFloorObjects = (canvas: fabric.Canvas, objects: FloorplanObject[]) => {
    objects.forEach(obj => {
      let fabricObj: fabric.Object;
      
      switch (obj.type) {
        case 'rect':
          fabricObj = new fabric.Rect({
            width: obj.width,
            height: obj.height,
            fill: obj.fill,
            stroke: '#64748b',
            strokeWidth: 1,
          });
          break;
          
        case 'circle':
          fabricObj = new fabric.Circle({
            radius: obj.width / 2,
            fill: obj.fill,
            stroke: '#64748b',
            strokeWidth: 1,
          });
          break;
          
        case 'table-rect':
          fabricObj = new fabric.Rect({
            width: obj.width,
            height: obj.height,
            fill: getStatusColor(obj.status || 'available'),
            stroke: '#64748b',
            strokeWidth: 1,
            rx: 5,
            ry: 5,
          });
          
          // Add table number text
          if (obj.name) {
            const text = new fabric.Text(obj.name, {
              fontSize: 14,
              fontFamily: 'Arial',
              fill: '#334155',
              originX: 'center',
              originY: 'center',
              left: obj.width / 2,
              top: obj.height / 2,
            });
            
            const group = new fabric.Group([fabricObj, text], {
              left: obj.left,
              top: obj.top,
              angle: obj.angle,
              centeredRotation: true,
            });
            
            fabricObj = group;
          }
          break;
          
        case 'table-round':
          fabricObj = new fabric.Circle({
            radius: obj.width / 2,
            fill: getStatusColor(obj.status || 'available'),
            stroke: '#64748b',
            strokeWidth: 1,
          });
          
          // Add table number text
          if (obj.name) {
            const text = new fabric.Text(obj.name, {
              fontSize: 14,
              fontFamily: 'Arial',
              fill: '#334155',
              originX: 'center',
              originY: 'center',
            });
            
            const group = new fabric.Group([fabricObj, text], {
              left: obj.left,
              top: obj.top,
              angle: obj.angle,
              centeredRotation: true,
            });
            
            fabricObj = group;
          }
          break;
          
        case 'wall':
          fabricObj = new fabric.Rect({
            width: obj.width,
            height: obj.height,
            fill: '#94a3b8',
            stroke: '#64748b',
            strokeWidth: 1,
          });
          break;
          
        case 'text':
          fabricObj = new fabric.Text(obj.name || 'Text', {
            fontSize: 16,
            fontFamily: 'Arial',
            fill: '#334155',
          });
          break;
          
        default:
          fabricObj = new fabric.Rect({
            width: obj.width,
            height: obj.height,
            fill: obj.fill,
            stroke: '#64748b',
            strokeWidth: 1,
          });
      }
      
      // Set common properties
      fabricObj.set({
        left: obj.left,
        top: obj.top,
        angle: obj.angle,
        selectable: !readOnly,
        data: { id: obj.id, type: obj.type },
      });
      
      canvas.add(fabricObj);
    });
    
    canvas.renderAll();
  };
  
  // Helper to get color based on status
  const getStatusColor = (status: 'available' | 'reserved' | 'occupied' | 'unavailable') => {
    switch (status) {
      case 'available':
        return '#dcfce7'; // Green
      case 'reserved':
        return '#fee2e2'; // Red
      case 'occupied':
        return '#fef3c7'; // Yellow
      case 'unavailable':
        return '#e2e8f0'; // Gray
      default:
        return '#ffffff'; // White
    }
  };
  
  // Event handlers
  const handleObjectModified = (e: any) => {
    if (!canvasInstanceRef.current) return;
    
    const fabricObj = e.target;
    const objId = fabricObj.data?.id;
    
    if (objId) {
      // Update object properties
      const updatedFloors = [...floors];
      const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
      
      if (floorIndex !== -1) {
        const objectIndex = updatedFloors[floorIndex].objects.findIndex(o => o.id === objId);
        
        if (objectIndex !== -1) {
          updatedFloors[floorIndex].objects[objectIndex] = {
            ...updatedFloors[floorIndex].objects[objectIndex],
            left: fabricObj.left || 0,
            top: fabricObj.top || 0,
            width: fabricObj.width || 0,
            height: fabricObj.height || 0,
            angle: fabricObj.angle || 0,
          };
          
          // Update state
          setFloors(updatedFloors);
          addToHistory(updatedFloors);
        }
      }
    }
  };
  
  const handleSelectionCreated = (e: any) => {
    const fabricObj = canvasInstanceRef.current?.getActiveObject();
    if (fabricObj && fabricObj.data?.id) {
      setSelectedObjectId(fabricObj.data.id);
    }
  };
  
  const handleSelectionCleared = () => {
    setSelectedObjectId(null);
  };
  
  // DnD event handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.data.current?.type) {
      const containerRect = canvasContainerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      // Get drop position relative to canvas
      const dropPoint = {
        x: event.delta.x + event.activatorEvent.clientX - containerRect.left,
        y: event.delta.y + event.activatorEvent.clientY - containerRect.top
      };
      
      // Adjust for canvas zoom and pan
      if (canvasInstanceRef.current) {
        const zoom = canvasInstanceRef.current.getZoom();
        dropPoint.x = dropPoint.x / zoom;
        dropPoint.y = dropPoint.y / zoom;
      }
      
      // Create new object
      const objectType = active.data.current.type;
      const newObject = createObject(objectType, dropPoint.x, dropPoint.y);
      
      addObjectToFloor(newObject);
    }
  };
  
  // Helper to create a new object
  const createObject = (type: string, left: number, top: number): FloorplanObject => {
    const id = `${type}-${Date.now()}`;
    
    // Define different object properties based on type
    switch (type) {
      case 'rect':
        return {
          id,
          type,
          left,
          top,
          width: 100,
          height: 100,
          angle: 0,
          fill: '#ffffff',
        };
        
      case 'circle':
        return {
          id,
          type,
          left,
          top,
          width: 80,
          height: 80,
          angle: 0,
          fill: '#ffffff',
        };
        
      case 'table-rect':
        return {
          id,
          type,
          left,
          top,
          width: 120,
          height: 80,
          angle: 0,
          fill: '#dcfce7',
          name: `T${Math.floor(Math.random() * 100)}`,
          capacity: 4,
          status: 'available',
        };
        
      case 'table-round':
        return {
          id,
          type,
          left,
          top,
          width: 100,
          height: 100,
          angle: 0,
          fill: '#dcfce7',
          name: `T${Math.floor(Math.random() * 100)}`,
          capacity: 4,
          status: 'available',
        };
        
      case 'wall':
        return {
          id,
          type,
          left,
          top,
          width: 200,
          height: 20,
          angle: 0,
          fill: '#94a3b8',
        };
        
      case 'text':
        return {
          id,
          type,
          left,
          top,
          width: 100,
          height: 30,
          angle: 0,
          fill: 'transparent',
          name: 'Area Label',
        };
        
      case 'bar':
        return {
          id,
          type: 'rect',
          left,
          top,
          width: 200,
          height: 80,
          angle: 0,
          fill: '#d1d5db',
          name: 'Bar',
        };
        
      default:
        return {
          id,
          type: 'rect',
          left,
          top,
          width: 100,
          height: 100,
          angle: 0,
          fill: '#ffffff',
        };
    }
  };
  
  // Helper to add object to floor
  const addObjectToFloor = (object: FloorplanObject) => {
    const updatedFloors = [...floors];
    const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
    
    if (floorIndex !== -1) {
      updatedFloors[floorIndex].objects.push(object);
      
      // Update state
      setFloors(updatedFloors);
      addToHistory(updatedFloors);
      
      // Add to canvas
      if (canvasInstanceRef.current) {
        loadFloorObjects(canvasInstanceRef.current, [object]);
      }
    }
  };
  
  // History management
  const addToHistory = (newFloors: Floor[]) => {
    // Trim history if we're not at the end
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    // Add new state to history
    setHistory([...history, [...newFloors]]);
    setHistoryIndex(historyIndex + 1);
  };
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFloors([...history[newIndex]]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFloors([...history[newIndex]]);
    }
  };
  
  // Floor management
  const handleAddFloor = () => {
    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      name: `Floor ${floors.length + 1}`,
      objects: [],
      grid: true,
      gridSize: 20,
    };
    
    const updatedFloors = [...floors, newFloor];
    setFloors(updatedFloors);
    setActiveFloorId(newFloor.id);
    addToHistory(updatedFloors);
  };
  
  const handleDeleteFloor = (floorId: string) => {
    if (floors.length <= 1) return;
    
    const updatedFloors = floors.filter(f => f.id !== floorId);
    
    // If deleting active floor, switch to another one
    if (activeFloorId === floorId) {
      setActiveFloorId(updatedFloors[0].id);
    }
    
    setFloors(updatedFloors);
    addToHistory(updatedFloors);
  };
  
  // Object management
  const handleDeleteObject = () => {
    if (!selectedObjectId) return;
    
    const updatedFloors = [...floors];
    const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
    
    if (floorIndex !== -1) {
      updatedFloors[floorIndex].objects = updatedFloors[floorIndex].objects.filter(
        o => o.id !== selectedObjectId
      );
      
      // Update state
      setFloors(updatedFloors);
      addToHistory(updatedFloors);
      
      // Remove from canvas
      if (canvasInstanceRef.current) {
        const fabricObject = canvasInstanceRef.current.getObjects().find(
          o => o.data?.id === selectedObjectId
        );
        
        if (fabricObject) {
          canvasInstanceRef.current.remove(fabricObject);
          canvasInstanceRef.current.renderAll();
        }
      }
      
      setSelectedObjectId(null);
    }
  };
  
  const handleUpdateObject = (key: string, value: any) => {
    if (!selectedObjectId) return;
    
    const updatedFloors = [...floors];
    const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
    
    if (floorIndex !== -1) {
      const objectIndex = updatedFloors[floorIndex].objects.findIndex(
        o => o.id === selectedObjectId
      );
      
      if (objectIndex !== -1) {
        updatedFloors[floorIndex].objects[objectIndex] = {
          ...updatedFloors[floorIndex].objects[objectIndex],
          [key]: value
        };
        
        // Update state
        setFloors(updatedFloors);
        
        // Refresh canvas
        if (canvasInstanceRef.current) {
          canvasInstanceRef.current.clear();
          loadFloorObjects(canvasInstanceRef.current, updatedFloors[floorIndex].objects);
        }
      }
    }
  };
  
  // Canvas dropzone
  const { setNodeRef: setDropNodeRef } = useDroppable({
    id: 'canvas-drop-area',
  });
  
  // Save floorplan
  const handleSave = () => {
    if (onSave) {
      onSave(floors);
    }
  };
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <LayeredCard className={cn("overflow-hidden h-full", className)}>
        <CardHeader className="border-b border-slate-100 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-800">
              {readOnly ? 'Floor Plan View' : 'Floor Plan Editor'}
            </h2>
            
            {!readOnly && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4 mr-1" />
                  Redo
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex mt-4 space-x-2">
            <Select 
              value={activeFloorId} 
              onValueChange={(value) => setActiveFloorId(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                {floors.map(floor => (
                  <SelectItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddFloor}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Floor
              </Button>
            )}
            
            {!readOnly && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteFloor(activeFloorId)}
                disabled={floors.length <= 1}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Floor
              </Button>
            )}
            
            <div className="ml-auto flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                disabled={zoom <= 0.5}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-slate-600">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                disabled={zoom >= 2}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProperties(!showProperties)}
            >
              {showProperties ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex h-[calc(100%-120px)]">
          {/* Tools palette (if not read-only) */}
          {!readOnly && (
            <div className="w-16 p-2 border-r border-slate-100 flex flex-col space-y-2 bg-slate-50">
              <PaletteItem
                type="table-rect"
                label="Table"
                icon={<Table className="h-6 w-6" />}
              />
              <PaletteItem
                type="table-round"
                label="Round"
                icon={<Circle className="h-6 w-6" />}
              />
              <PaletteItem
                type="wall"
                label="Wall"
                icon={<Square className="h-6 w-6" />}
              />
              <PaletteItem
                type="bar"
                label="Bar"
                icon={<Coffee className="h-6 w-6" />}
              />
              <PaletteItem
                type="text"
                label="Text"
                icon={<MessageSquareText className="h-6 w-6" />}
              />
            </div>
          )}
          
          {/* Canvas area */}
          <div 
            ref={(node) => {
              setDropNodeRef(node);
              canvasContainerRef.current = node as HTMLDivElement;
            }}
            className="flex-grow overflow-auto bg-slate-100 p-4"
          >
            <div className="relative shadow-lg">
              <canvas ref={canvasRef} />
            </div>
          </div>
          
          {/* Properties panel */}
          {showProperties && (
            <div className="w-64 border-l border-slate-100 bg-white overflow-auto">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                  {selectedObjectId ? 'Object Properties' : 'Floor Properties'}
                </h3>
                
                {selectedObjectId ? (
                  <div className="space-y-4">
                    {selectedObject && (
                      <>
                        <div>
                          <Label htmlFor="obj-name">Name</Label>
                          <Input
                            id="obj-name"
                            value={selectedObject.name || ''}
                            onChange={(e) => handleUpdateObject('name', e.target.value)}
                            disabled={readOnly}
                          />
                        </div>
                        
                        {(selectedObject.type === 'table-rect' || selectedObject.type === 'table-round') && (
                          <>
                            <div>
                              <Label htmlFor="obj-capacity">Capacity</Label>
                              <Input
                                id="obj-capacity"
                                type="number"
                                value={selectedObject.capacity || 0}
                                onChange={(e) => handleUpdateObject('capacity', parseInt(e.target.value))}
                                disabled={readOnly}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="obj-status">Status</Label>
                              <Select
                                value={selectedObject.status || 'available'}
                                onValueChange={(value) => handleUpdateObject('status', value)}
                                disabled={readOnly}
                              >
                                <SelectTrigger id="obj-status">
                                  <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="reserved">Reserved</SelectItem>
                                  <SelectItem value="occupied">Occupied</SelectItem>
                                  <SelectItem value="unavailable">Unavailable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        <div>
                          <Label htmlFor="obj-color">Color</Label>
                          <div className="flex items-center mt-1">
                            <input
                              type="color"
                              id="obj-color"
                              value={selectedObject.fill}
                              onChange={(e) => handleUpdateObject('fill', e.target.value)}
                              className="w-8 h-8 rounded border border-slate-200"
                              disabled={readOnly}
                            />
                            <span className="ml-2 text-sm text-slate-600">
                              {selectedObject.fill}
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Label className="mb-2 block">Size</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="obj-width" className="text-xs">Width</Label>
                              <Input
                                id="obj-width"
                                type="number"
                                value={Math.round(selectedObject.width)}
                                onChange={(e) => handleUpdateObject('width', parseInt(e.target.value))}
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <Label htmlFor="obj-height" className="text-xs">Height</Label>
                              <Input
                                id="obj-height"
                                type="number"
                                value={Math.round(selectedObject.height)}
                                onChange={(e) => handleUpdateObject('height', parseInt(e.target.value))}
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Label className="mb-2 block">Position</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="obj-x" className="text-xs">X</Label>
                              <Input
                                id="obj-x"
                                type="number"
                                value={Math.round(selectedObject.left)}
                                onChange={(e) => handleUpdateObject('left', parseInt(e.target.value))}
                                disabled={readOnly}
                              />
                            </div>
                            <div>
                              <Label htmlFor="obj-y" className="text-xs">Y</Label>
                              <Input
                                id="obj-y"
                                type="number"
                                value={Math.round(selectedObject.top)}
                                onChange={(e) => handleUpdateObject('top', parseInt(e.target.value))}
                                disabled={readOnly}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="obj-rotation">Rotation</Label>
                          <Slider
                            id="obj-rotation"
                            min={0}
                            max={360}
                            step={1}
                            value={[selectedObject.angle || 0]}
                            onValueChange={(value) => handleUpdateObject('angle', value[0])}
                            disabled={readOnly}
                          />
                          <div className="text-right text-sm text-slate-600">
                            {Math.round(selectedObject.angle || 0)}°
                          </div>
                        </div>
                        
                        {!readOnly && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteObject}
                            className="w-full mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Object
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  /* Floor properties when no object is selected */
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="floor-name">Floor Name</Label>
                      <Input
                        id="floor-name"
                        value={activeFloor?.name || ''}
                        onChange={(e) => {
                          const updatedFloors = [...floors];
                          const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
                          if (floorIndex !== -1) {
                            updatedFloors[floorIndex].name = e.target.value;
                            setFloors(updatedFloors);
                          }
                        }}
                        disabled={readOnly}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="floor-grid"
                        checked={activeFloor?.grid || false}
                        onChange={(e) => {
                          const updatedFloors = [...floors];
                          const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
                          if (floorIndex !== -1) {
                            updatedFloors[floorIndex].grid = e.target.checked;
                            setFloors(updatedFloors);
                          }
                        }}
                        disabled={readOnly}
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor="floor-grid" className="cursor-pointer">
                        Show Grid
                      </Label>
                    </div>
                    
                    {activeFloor?.grid && (
                      <div>
                        <Label htmlFor="grid-size">Grid Size</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="grid-size"
                            type="number"
                            value={activeFloor?.gridSize || 20}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value > 0) {
                                const updatedFloors = [...floors];
                                const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
                                if (floorIndex !== -1) {
                                  updatedFloors[floorIndex].gridSize = value;
                                  setFloors(updatedFloors);
                                }
                              }
                            }}
                            disabled={readOnly}
                            className="w-20"
                          />
                          <span className="text-sm text-slate-600">px</span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="floor-background">Background Color</Label>
                      <div className="flex items-center mt-1">
                        <input
                          type="color"
                          id="floor-background"
                          value={activeFloor?.background || '#f8fafc'}
                          onChange={(e) => {
                            const updatedFloors = [...floors];
                            const floorIndex = updatedFloors.findIndex(f => f.id === activeFloorId);
                            if (floorIndex !== -1) {
                              updatedFloors[floorIndex].background = e.target.value;
                              setFloors(updatedFloors);
                            }
                          }}
                          disabled={readOnly}
                          className="w-8 h-8 rounded border border-slate-200"
                        />
                        <span className="ml-2 text-sm text-slate-600">
                          {activeFloor?.background || '#f8fafc'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Floor Statistics
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Tables:</span>
                          <span className="font-medium">
                            {activeFloor?.objects.filter(o => 
                              o.type === 'table-rect' || o.type === 'table-round'
                            ).length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Capacity:</span>
                          <span className="font-medium">
                            {activeFloor?.objects.reduce((acc, obj) => 
                              acc + (obj.capacity || 0), 0
                            ) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Available Tables:</span>
                          <span className="font-medium text-green-600">
                            {activeFloor?.objects.filter(o => 
                              (o.type === 'table-rect' || o.type === 'table-round') && 
                              o.status === 'available'
                            ).length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Reserved/Occupied:</span>
                          <span className="font-medium text-amber-600">
                            {activeFloor?.objects.filter(o => 
                              (o.type === 'table-rect' || o.type === 'table-round') && 
                              (o.status === 'reserved' || o.status === 'occupied')
                            ).length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <CardFooter className="border-t border-slate-100 p-4 flex justify-between">
          <div className="text-sm text-slate-600">
            {selectedObjectId 
              ? `Selected: ${selectedObject?.type} (${selectedObject?.name || selectedObjectId})` 
              : `${activeFloor?.objects.length || 0} objects on this floor`
            }
          </div>
          <div className="flex space-x-2">
            {!readOnly && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Floorplan
              </Button>
            )}
          </div>
        </CardFooter>
      </LayeredCard>
    </DndContext>
  );
}
