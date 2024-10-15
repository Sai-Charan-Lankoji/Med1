import { Column, Entity, Index, ManyToOne, JoinColumn } from "typeorm";
import { SalesChannel as MedusaSalesChannel } from "@medusajs/medusa";
import { Vendor } from "./vendor";

@Entity()
export class SalesChannel extends MedusaSalesChannel {
  
  @Index("SalesChannelVendorId")
  @Column({ type: "varchar", nullable: true })
  vendor_id?: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.salesChannels)
  @JoinColumn({ name: "vendor_id" })  
  vendor?: Vendor;  
}
