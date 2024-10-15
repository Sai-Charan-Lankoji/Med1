import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from "typeorm"
import {
    User as MedusaUser,
} from "@medusajs/medusa"
import { Store } from "./store"
import { Vendor } from "./vendor" 

@Entity()
export class User extends MedusaUser {
    @Index("UserStoreId")
    @Column({ nullable: true })
    store_id?: string

    @ManyToOne(() => Store, (store) => store.members)
    @JoinColumn({ name: "store_id", referencedColumnName: "id" })
    store?: Store

    @Index("UserVendorId")
    @Column({ nullable: true })
    vendor_id?: string

    @ManyToOne(() => Vendor, (vendor) => vendor.users)
    @JoinColumn({ name: "vendor_id", referencedColumnName: "id" })
    vendor?: Vendor
}
