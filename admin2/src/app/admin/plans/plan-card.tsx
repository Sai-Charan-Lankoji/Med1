import { useState } from "react"
import { Edit, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  discount: number
}

interface PlanCardProps {
  plan: Plan
  onUpdate: (updatedPlan: Plan) => void
  onDelete: (planId: string) => void
}

export function PlanCard({ plan, onUpdate, onDelete }: PlanCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPlan, setEditedPlan] = useState(plan)

  const handleSave = () => {
    onUpdate(editedPlan)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editedPlan.name}
                onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={editedPlan.price}
                onChange={(e) => setEditedPlan({ ...editedPlan, price: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={editedPlan.discount}
                onChange={(e) => setEditedPlan({ ...editedPlan, discount: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                value={editedPlan.features.join(", ")}
                onChange={(e) => setEditedPlan({ ...editedPlan, features: e.target.value.split(", ") })}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>Price: ${plan.price.toFixed(2)}</p>
            <p>Discount: {plan.discount}%</p>
            <p>Features:</p>
            <ul className="list-disc list-inside">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => onDelete(plan.id)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

