import { useState } from "react"
import { Edit, Trash, Check, X, Circle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Plan {
  id: string
  name: string
  price: string
  features: string[]
  isActive: boolean
  description?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

interface PlanCardProps {
  plan: Plan
  onUpdate: (updatedPlan: Plan) => void
  onDelete: (planId: string) => void
}

export function PlanCard({ plan, onUpdate, onDelete }: PlanCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSave = () => {
    onUpdate(editedPlan)
    setIsEditing(false)
  }

  // Convert price to number, handling potential string input
  const priceValue = parseFloat(plan.price)
  const isValidPrice = !isNaN(priceValue)

  return (
    <>
      <Card className="flex flex-col h-full transition-all hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-semibold">{plan.name}</span>
              <div className="flex items-center">
                {plan.isActive ? (
                  <div className="flex items-center text-green-500">
                    <Circle className="h-3 w-3 mr-1 fill-current" />
                    <span className="text-xs">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <Circle className="h-3 w-3 mr-1 fill-current" />
                    <span className="text-xs">Inactive</span>
                  </div>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editedPlan.name}
                  onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  value={editedPlan.price}
                  onChange={(e) => setEditedPlan({ ...editedPlan, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="active">Status</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="active"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={editedPlan.isActive}
                    onChange={(e) => setEditedPlan({ ...editedPlan, isActive: e.target.checked })}
                  />
                  <Label htmlFor="active">{editedPlan.isActive ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={editedPlan.features.join(", ")}
                  onChange={(e) => setEditedPlan({ ...editedPlan, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Price</span>
                <div className="text-right">
                  <span className="font-medium text-lg">
                    {isValidPrice ? `$${priceValue.toFixed(2)}` : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Features:</h3>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-muted-foreground">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="ml-auto flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Check className="mr-2 h-4 w-4" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {plan.name} plan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(plan.id)
                setShowDeleteDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}