import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";

@Entity()
export class Plan extends SoftDeletableEntity {
    

    @Column({ type: "varchar", length: 100 })
    name: string; // Plan name (e.g., Basic, Professional, Enterprise)

    @Column({ type: "text", nullable: true })
    description: string; // A brief description of the plan

    @Column({ type: "numeric", nullable: false })
    price: number; // Price for the plan

    @Column({ type: "jsonb", nullable: true })
    features: Record<string, any>; // List of features included in the plan

    @Column({ type: "boolean", default: true })
    isActive: boolean; // Status to determine if the plan is active


}
