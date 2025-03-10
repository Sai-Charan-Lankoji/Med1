"use client";

import { useState } from "react";
import { PackageSearch, Plus, Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { AddPlanDialog } from "./add-plan-model";
import { PlanCard } from "./plan-card";
import { useGetPlans } from "../../hooks/plan/useGetPlans";
import { useUpdatePlan, UpdatePlanData } from "../../hooks/plan/useUpdatePlan";
import { useDeletePlan } from "../../hooks/plan/useDeletePlan";
import { EditPlanDialog } from "./edit-plan-dialog";
import { LoadingDots } from "@/app/components/ui/Loding";
import { motion } from "framer-motion";
  

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  discount: number;
  isActive: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  description?: string;
  no_stores: string;
  commission_rate: number;
}

export default function PlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const { data: plans, refetch, isLoading } = useGetPlans();
  const updatePlanMutation = useUpdatePlan();
  const deletePlanMutation = useDeletePlan();

  const filteredPlans = plans?.filter((plan) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlans = filteredPlans?.filter((plan) => plan.isActive);
  const inactivePlans = filteredPlans?.filter((plan) => !plan.isActive);

  const handleUpdatePlan = (id: string, updateData: UpdatePlanData) => {
    updatePlanMutation.mutate({ id, ...updateData }, { onSuccess: refetch });
  };

  const handleDeletePlan = (planId: string) => {
    deletePlanMutation.mutate(planId);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsEditDialogOpen(true);
  };

  const renderPlanSection = (title: string, plans: Plan[] | undefined) => (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">{title}</h2>
      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onUpdate={handleUpdatePlan}
              onDelete={handleDeletePlan}
              onEdit={handleEditPlan}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No plans in this section.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl bg-white/95 dark:bg-gray-800/95 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
              <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-100">Subscription Plans</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-base mt-2">
                Manage your subscription plans and pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search plans..."
                    className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-md rounded-full px-6 py-2"
                >
                  <Plus className="h-5 w-5" /> Add New Plan
                </Button>
              </div>

              {isLoading ? (
                <LoadingDots message="Loading plans..." />
              ) : filteredPlans?.length === 0 ? (
                <div className="text-center py-16">
                  <PackageSearch className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-200">No plans found</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    {!plans || plans.length === 0
                      ? "Start by adding a new subscription plan."
                      : "Try adjusting your search term."}
                  </p>
                  {(!plans || plans.length === 0) && (
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      variant="outline"
                      className="mt-6 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900 transition-all duration-200 rounded-full px-6 py-2"
                    >
                      <Plus className="mr-2 h-5 w-5" /> Add Your First Plan
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {renderPlanSection("Active Plans", activePlans)}
                  {renderPlanSection("Drafts", inactivePlans)}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AddPlanDialog
        isOpen={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          refetch();
        }}
      />

      <EditPlanDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        plan={editingPlan}
        onUpdate={handleUpdatePlan}
      />
    </div>
  );
}