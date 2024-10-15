import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserStoreIdAndVendorId1721094961832 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if the column "store_id" exists in the "user" table
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns 
                WHERE table_name='user' AND column_name='store_id'
            )
        `);

        // If the column does not exist, add it
        if (!columnExists[0].exists) {
            await queryRunner.query(
                `ALTER TABLE "user" ADD "store_id" character varying`
            );
        }

        // Check if the column "vendor_id" exists in the "user" table
        const vendorColumnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns 
                WHERE table_name='user' AND column_name='vendor_id'
            )
        `);

        // If the column does not exist, add it
        if (!vendorColumnExists[0].exists) {
            await queryRunner.query(
                `ALTER TABLE "user" ADD "vendor_id" character varying`
            );
        }

        // Create indices if they do not exist
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "UserStoreId" ON "user" ("store_id")`
        );
        await queryRunner.query(
            `CREATE INDEX IF NOT EXISTS "UserVendorId" ON "user" ("vendor_id")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indices if they exist
        await queryRunner.query(
            `DROP INDEX IF EXISTS "public"."UserStoreId"`
        );
        await queryRunner.query(
            `DROP INDEX IF EXISTS "public"."UserVendorId"`
        );

        // Check if the column "store_id" exists in the "user" table
        const columnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns 
                WHERE table_name='user' AND column_name='store_id'
            )
        `);

        // If the column exists, drop it
        if (columnExists[0].exists) {
            await queryRunner.query(
                `ALTER TABLE "user" DROP COLUMN "store_id"`
            );
        }

        // Check if the column "vendor_id" exists in the "user" table
        const vendorColumnExists = await queryRunner.query(`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns 
                WHERE table_name='user' AND column_name='vendor_id'
            )
        `);

        // If the column exists, drop it
        if (vendorColumnExists[0].exists) {
            await queryRunner.query(
                `ALTER TABLE "user" DROP COLUMN "vendor_id"`
            );
        }
    }
}
