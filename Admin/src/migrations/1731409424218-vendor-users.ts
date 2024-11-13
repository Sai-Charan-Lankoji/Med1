import { MigrationInterface, QueryRunner } from "typeorm"

export class VendorUsers1731409424218 implements MigrationInterface {
  name = "VendorUsers1731409424218";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "vendor_user" (
        "id" character varying NOT NULL,
        "email" character varying(250) UNIQUE,
        "password" character varying(250),
        "first_name" character varying(250),
        "last_name" character varying(120) NOT NULL,
        "role" character varying(20) NOT NULL,
        "vendor_id" character varying(120),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
        CONSTRAINT "PK_vendor_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_vendor_user_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "vendor_user"`);
  }
}

