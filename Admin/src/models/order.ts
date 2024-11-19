import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Order as MedusaOrder } from "@medusajs/medusa";
import { Vendor } from "./vendor"; 
import { Store } from "./store";

@Entity()
export class Order extends MedusaOrder {
  @Index("OrderVendorId")
  @Column({ nullable: true })
  vendor_id?: string;

  @Column({ type: 'jsonb', nullable: true })
  line_items: Record<string, any>; 

  @Column({ nullable: true })
  total_amount: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.orders)
  @JoinColumn({ name: 'vendor_id', referencedColumnName: 'id' })
  vendor?: Vendor;

  @Index()
  @Column({ nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.orders)
  @JoinColumn({ name: "store_id" })
  store?: Store;
  
  // Remove publishable API key reference if not needed
  // If you want to keep public_api_key, add it directly without a ManyToOne relation
  @Column({ nullable: true })
  public_api_key: string; // This should reflect your intent to use public_api_key
}
