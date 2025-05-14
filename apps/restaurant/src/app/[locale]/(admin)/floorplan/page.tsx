'use client';

import React, { useState } from 'react';
import { FloorplanEditor } from '@eatsome/ui';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'FloorPlan' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

interface Floor {
  id: string;
  name: string;
  objects: any[];
  background?: string;
  grid?: boolean;
  gridSize?: number;
}

export default function FloorPlanPage() {
  const [floors, setFloors] = useState<Floor[]>([
    {
      id: 'floor-1',
      name: 'Main Floor',
      objects: [
        {
          id: 'table-rect-1',
          type: 'table-rect',
          left: 150,
          top: 150,
          width: 120,
          height: 80,
          angle: 0,
          fill: '#dcfce7',
          name: 'T1',
          capacity: 4,
          status: 'available',
        },
        {
          id: 'table-round-1',
          type: 'table-round',
          left: 350,
          top: 200,
          width: 100,
          height: 100,
          angle: 0,
          fill: '#fef3c7',
          name: 'T2',
          capacity: 6,
          status: 'occupied',
        },
        {
          id: 'wall-1',
          type: 'wall',
          left: 100,
          top: 50,
          width: 400,
          height: 20,
          angle: 0,
          fill: '#94a3b8',
        },
        {
          id: 'text-1',
          type: 'text',
          left: 250,
          top: 300,
          width: 150,
          height: 30,
          angle: 0,
          fill: 'transparent',
          name: 'Dining Area',
        },
      ],
      grid: true,
      gridSize: 20,
    },
  ]);

  const handleSave = (updatedFloors: Floor[]) => {
    setFloors(updatedFloors);
    console.log('Saved floors:', updatedFloors);
    // Here you would typically save to your database
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-4">Restaurant Floor Plan</h1>
      <div className="h-[calc(100%-3rem)]">
        <FloorplanEditor
          initialFloors={floors}
          onSave={handleSave}
          className="h-full"
        />
      </div>
    </div>
  );
} 