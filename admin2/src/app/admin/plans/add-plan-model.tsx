import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Plan {
  name: string
  price: number
  features: string[]
  discount: number
}

interface AddPlanDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (plan: Plan) => void
}

export function AddPlanDialog({ isOpen, onClose, onAdd }: AddPlanDialogProps) {
  const [newPlan, setNewPlan] = useState<Plan>({
    name: "",
    price: 0,
    features: [],
    discount: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(newPlan)
    setNewPlan({ name: "", price: 0, features: [], discount: 0 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Plan</DialogTitle>
          <DialogDescription>Create a new subscription plan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newPlan.name}
                onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newPlan.price}
                onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={newPlan.discount}
                onChange={(e) => setNewPlan({ ...newPlan, discount: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                value={newPlan.features.join(", ")}
                onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value.split(", ") })}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit">Add Plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

