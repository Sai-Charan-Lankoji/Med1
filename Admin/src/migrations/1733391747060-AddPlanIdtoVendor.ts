import { MigrationInterface, QueryRunner } from "typeorm"

export class AddPlanIdtoVendor1733391747060 implements MigrationInterface {
    name= "AddPlanIdtoVendor1733391747060"
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the plan_id column to the vendor table
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD "plan_id" varchar(256) NULL;
        `);

        // Optionally, create a foreign key constraint if needed
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD CONSTRAINT "FK_vendor_plan" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE SET NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the foreign key constraint and the plan_id column
        await queryRunner.query(`
            ALTER TABLE "vendor"
            DROP CONSTRAINT "FK_vendor_plan";
        `);
        await queryRunner.query(`
            ALTER TABLE "vendor"
            DROP COLUMN "plan_id";
        `);
    }
}
