import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Vendor } from "./vendor";
import { Cart } from "./cart";

@Entity()
export class Customer extends MedusaCustomer {
  @Index("CustomerVendorId")
  @Column({ nullable: true })
  vendor_id?: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.customers)
  @JoinColumn({name: 'vendor_id', referencedColumnName: 'id'  })
  vendor?: Vendor;

  
}
