import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUseridToVendor1723026081489 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("vendor", new TableColumn({
            name: "user_id",
            type: "character varying",
            isNullable: true,
        }));

        await queryRunner.query(`CREATE INDEX "UserId" ON "vendor" ("user_id")`);

        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD CONSTRAINT "FK_vendor_user_id"
            FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor" DROP CONSTRAINT "FK_vendor_user_id"`);
        await queryRunner.query(`DROP INDEX "UserId"`);
        await queryRunner.dropColumn("vendor", "user_id");
    }
}
