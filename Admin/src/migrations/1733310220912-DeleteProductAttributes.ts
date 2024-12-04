import { MigrationInterface, QueryRunner } from "typeorm"

export class DeleteProductAttributes1733310220912 implements MigrationInterface {
  name = "DeleteProductAttributes1733310220912";

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "subtitle"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "handle"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "is_giftcard"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "thumbnail"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "height"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "length"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "width"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "hs_code"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "origin_country"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "mid_code"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "material"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "collection_id"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "type_id"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "external_id"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "title" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "subtitle" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "description" text`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "handle" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "is_giftcard" boolean`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "thumbnail" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "weight" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "height" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "length" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "width" integer`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "hs_code" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "origin_country" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "mid_code" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "material" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "metadata" jsonb`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "collection_id" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "type_id" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "status" character varying`);
    await queryRunner.query(`ALTER TABLE "product" ADD COLUMN "external_id" character varying`);
  }
}
