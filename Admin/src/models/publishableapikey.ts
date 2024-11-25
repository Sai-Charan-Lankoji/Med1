import { Column, Entity, Index, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { PublishableApiKey as MedusaPublishableApiKey } from "@medusajs/medusa";
import { Store } from "./store";

@Entity()
export class PublishableApiKey extends MedusaPublishableApiKey {

  @OneToOne(() => Store, (store) => store.publishableapikey)
  @JoinColumn({name: 'publishableapikey', referencedColumnName: 'id'  })
  store?: Store;

  
}
