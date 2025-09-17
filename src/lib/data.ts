import type { Opportunity } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const opportunities: Opportunity[] = [
 
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
