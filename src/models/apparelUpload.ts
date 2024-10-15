import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { ApparelDesign } from "./apparelDesign";

@Entity()
export class ApparelUpload extends SoftDeletableEntity {
  @Column({ type: "varchar", length: 250, nullable: true })
  url: string | null;

  @Index("ApparelDesignUploadId")
  @Column({ type: "varchar", length: 120, nullable: true })
  apparelDesign_id?: string;

  @ManyToOne(() => ApparelDesign, (apparelDesign) => apparelDesign.apparelUploads)
  @JoinColumn({name: 'apparelDesign_id', referencedColumnName: 'id'  })
  apparelDesign?: ApparelDesign;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "apparelUploads");
  }
}
