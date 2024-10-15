
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateApparelDesign1727779739641 implements MigrationInterface {
  name = "CreateApparelDesign1727779739641";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "apparel_upload" (
        "id" character varying NOT NULL,
        "url" character varying(250),
        "apparelDesign_id" character varying(120),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_apparel_uploads_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "ApparelDesigneUploadId" ON "apparel_upload" ("apparelDesign_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "ApparelDesigneUploadId"`);
    await queryRunner.query(`DROP TABLE "apparel_upload"`);
  }
}
