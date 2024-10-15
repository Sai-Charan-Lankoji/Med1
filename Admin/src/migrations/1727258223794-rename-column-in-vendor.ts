import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumnInVendor1727258223794 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename the column
        await queryRunner.renameColumn("vendor", "business_nature", "business_type");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the column name back to original
        await queryRunner.renameColumn("vendor", "business_type", "business_nature");
    }
}
