"use client";

import { useState, useRef } from "react";
import { Check, Zap, Sparkles, Store, BarChart3 } from "lucide-react";
import VendorForm from "./vendorForm/vendor-form";
import { useGetPlans } from "@/app/hooks/plan/useGetPlans";
import { motion, useInView } from "framer-motion";

export function PlanSelection() {
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const { data: plans } = useGetPlans();
  const plansRef = useRef(null);
  const plansInView = useInView(plansRef, { amount: 0.1, once: true });

  // Simplified plan-specific details without floating elements
  const planDetails = {
    Starter: {
      icon: <Store className="h-8 w-8 text-accent" />,
      color: "accent"
    },
    Professional: {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      color: "primary"
    },
    Enterprise: {
      icon: <Sparkles className="h-8 w-8 text-secondary" />,
      color: "secondary"
    }
  };

  if (selectedPlan) {
    return <VendorForm plan={selectedPlan} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4">
      <div className="container mx-auto relative z-10 py-8 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: plansInView ? 1 : 0, y: plansInView ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="badge badge-primary mx-auto mb-4">Find Your Perfect Fit</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Plan</h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Select the plan that best suits your business needs and start growing your e-commerce presence today.
          </p>
        </motion.div>

        <div ref={plansRef} className="grid gap-8 md:grid-cols-3">
          {plans?.map((plan, index) => {
            const details = planDetails[plan.name as keyof typeof planDetails] || planDetails.Starter;
            
            return (
              <motion.div 
                key={plan.id} 
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: plansInView ? 1 : 0, y: plansInView ? 0 : 30 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`card bg-base-100 border border-base-300 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 relative ${plan.name === "Professional" ? "md:-mt-4 md:-mb-4 md:scale-105" : ""}`}>
                  {/* Browser-like header - Added back */}
                  <div className="bg-base-200 p-4 border-b border-base-300">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-error"></div>
                      <div className="w-3 h-3 rounded-full bg-warning"></div>
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <div className="ml-4 text-sm opacity-70">{plan.name} Plan</div>
                    </div>
                  </div>
                  
                  <div className="card-body relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-full bg-${details.color}/10`}>
                        {details.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        {plan.name === "Professional" && <div className="badge badge-sm badge-outline">Most Popular</div>}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-base-content/70 mb-1">/month</span>
                      </div>
                      <p className="text-sm text-base-content/70 mt-1">Billed monthly or ${(plan.price * 10).toFixed(2)} yearly</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan?.features.map((feature, fIndex) => (
                        <motion.li
                          key={fIndex}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: plansInView ? 1 : 0, x: plansInView ? 0 : -20 }}
                          transition={{ delay: 0.5 + (index * 0.1) + (fIndex * 0.05) }}
                        >
                          <Check className="h-5 w-5 text-success mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <div className="card-actions mt-auto">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedPlan({
                          name: plan.name,
                          id: plan.id
                        })}
                        className={`btn btn-${details.color} w-full`}
                      >
                        {plan.name === "Professional" && <Zap className="mr-2 h-5 w-5" />}
                        {plan.name === "Enterprise" && <Sparkles className="mr-2 h-5 w-5" />}
                        Select {plan.name} Plan
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Highlight for popular plan */}
                  {plan.name === "Professional" && (
                    <div className="absolute top-0 inset-x-0">
                      <div className="bg-primary text-primary-content text-center text-sm py-1.5 font-medium">
                        Most Popular Choice
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: plansInView ? 1 : 0 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-lg mb-6">Not sure which plan to choose? <span className="font-medium">Contact our sales team</span></p>
          <button className="btn btn-outline">
            Schedule a Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
}