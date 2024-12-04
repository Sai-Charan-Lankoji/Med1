import { Column, Entity, ManyToOne } from "typeorm";
import { Vendor } from "./vendor";

@Entity()
export class DesignedProduct {
  @Column({ primary: true, type: "varchar" })
  id: string;

  @Column({ type: "jsonb", nullable: true })
  designs: Record<string, any>;

  @Column({ type: "varchar", nullable: true })
  designState: string;

  @Column({ type: "jsonb", nullable: true })
  propsState: Record<string, any>;

  @Column({ type: "varchar", nullable: true })
  store_id: string;

  @Column({ type: "varchar", nullable: true })
  vendor_id: string;

  @Column({ type: "boolean", default: false })
  customizable: boolean;

  @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp with time zone", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "timestamp with time zone", nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Vendor, (vendor) => vendor.designedProducts, {
    onDelete: "CASCADE",
  })
  vendor: Vendor;
}
