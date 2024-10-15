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

@Entity()
export class Store extends MedusaStore {

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
}
