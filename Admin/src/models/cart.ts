import { Column, Entity } from "typeorm";
import { Cart as MedusaCart } from "@medusajs/medusa";

@Entity()
export class Cart extends MedusaCart {

  @Column({ type: 'jsonb', nullable: true })
  designs: Record<string, any>; 

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  quantity: number;

}

