import {
  Entity,
  Column,
  ManyToOne,
  Index,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Vendor } from "./vendor";
import { Address as MedusaAddress } from "@medusajs/medusa";

@Entity()
export class Address extends MedusaAddress { 
  @Index("VendorAddressId")
  @Column({ nullable: true })
  vendor_address_id?: string;

  
  @Index("VendorRegistrationAddressId")
  @Column({ nullable: true })
  registration_address_id?: string;


  @ManyToOne(() => Vendor, (vendor) => vendor.vendorAddresses)
  @JoinColumn({ name: "vendor_address_id", referencedColumnName: "id" })
  address_of_vendor: Vendor;
  
  @ManyToOne(() => Vendor, (vendor) => vendor.vendorRegistrationAddresses)
  @JoinColumn({ name: "registration_address_id", referencedColumnName: "id" })
  registrared_address_of_vendor: Vendor;
}
