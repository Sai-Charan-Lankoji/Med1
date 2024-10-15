
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApparelUpload1727779824988 implements MigrationInterface {
  name = "CreateApparelUpload1727779824988";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "apparel_design" (
        "id" character varying NOT NULL,
        "design" jsonb,
        "thumbnail_images" character varying,
        "isActive" boolean DEFAULT true,
        "archive" boolean DEFAULT false,
        "customer_id" character varying(120),
        "vendor_id" character varying(120),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_apparel_design_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "apparel_design"`);
  }
}

