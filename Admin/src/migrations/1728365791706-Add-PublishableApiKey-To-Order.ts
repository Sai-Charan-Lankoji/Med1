import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishableAndPublicApiKeyToOrder1728365791706 implements MigrationInterface {
    name = 'AddPublishableAndPublicApiKeyToOrder1728365791706'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
       // Add the `public_api_key` column to the `order` table
        await queryRunner.query(`
            ALTER TABLE "order"
            ADD COLUMN "public_api_key" VARCHAR(255) NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        // Remove the `public_api_key` column from the `order` table
        await queryRunner.query(`
            ALTER TABLE "order"
            DROP COLUMN "public_api_key";
        `);
    }
}
