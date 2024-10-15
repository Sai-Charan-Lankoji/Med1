import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ApparelUpload } from "./apparelUpload";
// import { ApparelUpload } from "./apparelUpload";
@Entity()
export class ApparelDesign extends SoftDeletableEntity {
  @Column({ type: "jsonb" })
  design: JSON | null;

  @Column({ type: "varchar", length: 250, nullable: true })
  thumbnail_images: string[] | null;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "boolean", default: false })
  archive: boolean;

  @Index("ApparelCustomerId")
  @Column({ type: "varchar", length: 120, nullable: true })
  customer_id?: string;

  @Index("ApparelVendorId")
  @Column({ type: "varchar", length: 120, nullable: true })
  vendor_id?: string;

  @OneToMany(() => ApparelUpload, (apparelUpload) => apparelUpload.apparelDesign)
  apparelUploads?: ApparelUpload[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "apparelDesign");
  }
}
