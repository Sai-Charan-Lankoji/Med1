import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToVendor1724070680888 implements MigrationInterface {
    name = "AddPasswordToVendor1724070680888"

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the password column with a default value
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD COLUMN "password" character varying(255) NOT NULL DEFAULT 'defaultPassword';
        `);

        // Optionally, remove the default if you don't want future rows to use it
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ALTER COLUMN "password" DROP DEFAULT;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the password column
        await queryRunner.query(`
            ALTER TABLE "vendor"
            DROP COLUMN "password";
        `);
    }
}
