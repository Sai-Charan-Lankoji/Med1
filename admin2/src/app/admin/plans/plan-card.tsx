"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UpdatePlanData } from "../../hooks/plan/useUpdatePlan";
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
  no_stores: string | null;
  commission_rate: number;
}

interface PlanCardProps {
  plan: Plan;
  onUpdate: (id: string, data: UpdatePlanData) => void;
  onDelete: (planId: string) => void;
  onEdit: (plan: Plan) => void;
}

export function PlanCard({ plan, onUpdate, onDelete, onEdit }: PlanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleStatusChange = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    onUpdate(plan.id, { isActive: !plan.isActive });
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(plan.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <Card className="flex flex-col h-full border-none shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600 mt-1">{plan.description || "No description available"}</CardDescription>
            </div>
            <Badge
              variant={plan.isActive ? "default" : "secondary"}
              className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors duration-200 ${
                plan.isActive
                  ? "bg-green-200 text-green-800 hover:bg-green-300"
                  : "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
              }`}
              onClick={handleStatusChange}
            >
              {plan.isActive ? "Active" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
          {plan.discount > 0 && (
            <p className="text-sm text-green-600 mt-1">Discount: {plan.discount}%</p>
          )}
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <svg
                  className="w-5 h-5 mr-3 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          {plan.no_stores && (
            <p className="mt-4 text-sm text-gray-600">Stores Allowed: <span className="font-medium">{plan.no_stores}</span></p>
          )}
        </CardContent>
        <CardFooter className="p-6 flex justify-between bg-gray-50/50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => onEdit(plan)}
            className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200 flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </CardFooter>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-lg shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to delete the plan &quot;{plan.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>     
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-gray-600 hover:bg-gray-100">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="rounded-lg shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-gray-900">Confirm Status Change</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                Are you sure you want to {plan.isActive ? "deactivate" : "activate"} &quot;{plan.name}&quot;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-gray-600 hover:bg-gray-100">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmStatusChange} className="bg-blue-600 hover:bg-blue-700">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </motion.div>
  );
}