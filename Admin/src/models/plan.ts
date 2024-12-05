import { BeforeInsert, Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./product";
import { Address } from "./address";
import { Store } from "./store";
import { SalesChannel } from "./salesChannel";
import { Customer } from "./customer";
import { Order } from "./order";
import { Vendor } from "./vendor"; // Import Vendor model

export enum BusinessModel {
  ApparelDesign = "Apparel Design",
  GroceryStore = "GroceryStore",
  PaperDesignPrinting = "PaperDesignPrinting",
  FootballFranchise = "FootballFranchise",
  BaseballFranchise = "Baseball Franchise"
}

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

  // One-to-one relation with Vendor model
  @OneToOne(() => Vendor, (vendor) => vendor.plan)
  vendor: Vendor;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "plan");
  }
}
