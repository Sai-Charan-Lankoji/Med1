import React from 'react';
import { PlanSelection } from '@/components/planselection';
import { Navigation } from "@/components/navigation";

const PlansPage: React.FC = () => {
    return (
        <main>
     <Navigation />
      
          
          <PlanSelection />
        
      
    </main>
    );
};

export default PlansPage;