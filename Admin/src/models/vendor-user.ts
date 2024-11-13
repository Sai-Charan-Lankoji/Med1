import { Column, Entity, JoinColumn, ManyToOne, BeforeInsert } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { Vendor } from "./vendor";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class VendorUser extends SoftDeletableEntity {
  @Column({ type: "varchar", length: 250, unique: true })
  email: string;

  @Column({ type: "varchar", length: 250 })
  password: string;

  @Column({ type: "varchar", length: 250, nullable: true })
  first_name: string | null;

  @Column({ type: "varchar", length: 120, nullable: false })
  last_name: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  role: string;

  @Column({ nullable: true })
  vendor_id: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.vendorUsers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "vendor_id" })
  vendor: Vendor;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "vendoruser");
  }
}