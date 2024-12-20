"use client";

import { useState } from "react";
import { PackageSearch, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddPlanDialog } from "./add-plan-model";
import { PlanCard } from "./plan-card";
import { useGetPlans } from "../../hooks/plan/useGetPlans";
import { useUpdatePlan, UpdatePlanData } from "../../hooks/plan/useUpdatePlan";
import { useDeletePlan } from "../../hooks/plan/useDeletePlan";
import { EditPlanDialog } from "./edit-plan-dialog";

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
  no_stores : string;
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
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <p className="text-muted-foreground">No plans in this section.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8">
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Subscription Plans</CardTitle>
            <CardDescription>Manage your subscription plans and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search plans..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Plan
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading plans...</p>
              </div>
            ) : filteredPlans?.length === 0 ? (
              <div className="text-center py-12">
                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No plans found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {!plans || plans.length === 0
                    ? "Start by adding a new subscription plan."
                    : "Try adjusting your search term."}
                </p>
                {(!plans || plans.length === 0) && (
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Plan
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
