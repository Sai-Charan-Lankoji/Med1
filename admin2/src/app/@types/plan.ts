export interface Plan {
    id?: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    isActive: boolean;
    deleted_at: string | null;
    created_at?: string;
    updated_at?: string; 
    no_stores : string;
  }
  
  export type CreatePlanData = Omit<Plan, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
  