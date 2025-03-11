export interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
  }
  
export  interface ServicePlan {
    id: number;
    name: string;
    isActive: boolean;
    maxStores: number;
    price: string;
    features: Feature[];
    icon: React.ElementType;
  }