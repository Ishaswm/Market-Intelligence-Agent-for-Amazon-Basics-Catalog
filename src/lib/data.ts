import type { Opportunity } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const opportunities: Opportunity[] = [
  {
    id: '1',
    name: 'Smart Water Bottle',
    category: 'Home Goods',
    tam: 500,
    margin: 60,
    easeOfEntry: 75,
    score: 85,
    imageUrl: PlaceHolderImages.find(p => p.id === 'smart-water-bottle')?.imageUrl ?? '',
    imageHint: PlaceHolderImages.find(p => p.id === 'smart-water-bottle')?.imageHint ?? '',
  },
  {
    id: '2',
    name: 'Ergonomic Desk Chair',
    category: 'Office Furniture',
    tam: 1200,
    margin: 45,
    easeOfEntry: 60,
    score: 78,
    imageUrl: PlaceHolderImages.find(p => p.id === 'ergonomic-desk-chair')?.imageUrl ?? '',
    imageHint: PlaceHolderImages.find(p => p.id === 'ergonomic-desk-chair')?.imageHint ?? '',
  },
  {
    id: '3',
    name: 'Portable Blender',
    category: 'Kitchen Appliances',
    tam: 300,
    margin: 55,
    easeOfEntry: 80,
    score: 72,
    imageUrl: PlaceHolderImages.find(p => p.id === 'portable-blender')?.imageUrl ?? '',
    imageHint: PlaceHolderImages.find(p => p.id === 'portable-blender')?.imageHint ?? '',
  },
  {
    id: '4',
    name: 'Wireless Charging Pad',
    category: 'Electronics',
    tam: 800,
    margin: 50,
    easeOfEntry: 70,
    score: 91,
    imageUrl: PlaceHolderImages.find(p => p.id === 'wireless-charging-pad')?.imageUrl ?? '',
    imageHint: PlaceHolderImages.find(p => p.id === 'wireless-charging-pad')?.imageHint ?? '',
  },
    {
    id: '5',
    name: 'Noise-Cancelling Headphones',
    category: 'Electronics',
    tam: 1500,
    margin: 65,
    easeOfEntry: 50,
    score: 88,
    imageUrl: PlaceHolderImages.find(p => p.id === 'noise-cancelling-headphones')?.imageUrl ?? '',
    imageHint: PlaceHolderImages.find(p => p.id === 'noise-cancelling-headphones')?.imageHint ?? '',
    },
];

export const marketTrendData = [
    { month: 'Jan', "Smart Home": 4000, "Wearables": 2400 },
    { month: 'Feb', "Smart Home": 3000, "Wearables": 1398 },
    { month: 'Mar', "Smart Home": 2000, "Wearables": 9800 },
    { month: 'Apr', "Smart Home": 2780, "Wearables": 3908 },
    { month: 'May', "Smart Home": 1890, "Wearables": 4800 },
    { month: 'Jun', "Smart Home": 2390, "Wearables": 3800 },
    { month: 'Jul', "Smart Home": 3490, "Wearables": 4300 },
    { month: 'Aug', "Smart Home": 3600, "Wearables": 4100 },
    { month: 'Sep', "Smart Home": 3800, "Wearables": 4500 },
    { month: 'Oct', "Smart Home": 4200, "Wearables": 5000 },
    { month: 'Nov', "Smart Home": 4800, "Wearables": 5500 },
    { month: 'Dec', "Smart Home": 5200, "Wearables": 6000 },
];

export const chartConfig = {
    views: {
      label: "Page Views",
    },
    "Smart Home": {
      label: "Smart Home",
      color: "hsl(var(--chart-1))",
    },
    "Wearables": {
      label: "Wearables",
      color: "hsl(var(--chart-2))",
    },
  }
