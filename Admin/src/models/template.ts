import { Entity, Column } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";

@Entity()
export class Template extends SoftDeletableEntity {

    @Column({ type: "varchar", length: 100 })
    name: string; // Name of the template (e.g., Design UI, Grocery)

    @Column({ type: "text", nullable: true })
    description: string; // A brief description of the template

    @Column({ type: "jsonb", nullable: true })
    features: Record<string, any>; // Features included in the template

    @Column({ type: "boolean", default: true })
    isActive: boolean; // Status to determine if the template is active

    @Column({ type: "varchar", nullable: true })
    thumbnailUrl: string; // Optional URL for the template's thumbnail image

    @Column({ type: "timestamp with time zone", nullable: true })
    createdAt: Date; // Creation timestamp

    @Column({ type: "timestamp with time zone", nullable: true })
    updatedAt: Date; // Update timestamp
}
