import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: string
  features: string[]
  discount: number
  isActive: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
  description?: string
}

interface PlanCardProps {
  plan: Plan
  onUpdate: (plan: Plan) => void
  onDelete: (planId: string) => void
}

export function PlanCard({ plan, onUpdate, onDelete }: PlanCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <Badge variant={plan.isActive ? "default" : "secondary"}>
            {plan.isActive ? "Active" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold">${plan.price}</p>
        <ul className="mt-4 space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onUpdate(plan)}>
          <Pencil className="w-4 h-4 mr-2" />
          {plan.isActive ? "Deactivate" : "Activate"}
        </Button>
        <Button variant="destructive" onClick={() => onDelete(plan.id)}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

