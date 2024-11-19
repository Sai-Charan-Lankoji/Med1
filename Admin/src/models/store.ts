import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index
} from "typeorm";
import {
  Store as MedusaStore
} from "@medusajs/medusa";
import { User } from "./user";
import { Product } from "./product";
import { Vendor } from "./vendor"; 
import { Order } from "./order";

@Entity()
export class Store extends MedusaStore {
  @Column({ type: "varchar", length: 120, nullable: true })
  store_type: string | null;

@OneToMany(() => User, (user) => user?.store)
members?: User[];

@OneToMany(() => Product, (product) => product?.store)
products?: Product[];
@Index("StoreVendorId")
@Column({ type: "varchar", nullable: true })
vendor_id?: string;

@ManyToOne(() => Vendor, (vendor) => vendor.stores, { nullable: true })
@JoinColumn({ name: "vendor_id" })  
vendor?: Vendor;

@OneToMany(() => Order, (order) => order.store)
orders?: Order[];

}
