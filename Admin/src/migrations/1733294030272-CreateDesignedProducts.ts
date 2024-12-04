import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateDesignedProducts1733294030272 implements MigrationInterface {
  name = "CreateDesignedProducts1733294030272";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "designed_products" (
        "id" character varying NOT NULL,
        "designs" jsonb,
        "design_state" jsonb,
        "props_state" jsonb,
        "store_id" character varying(120),
        "vendor_id" character varying(120),
        "customizable" boolean DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_designed_products_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "designed_products"`);
  }
}
