import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddVendoridToCustomers1727353409435 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("customer", new TableColumn({
            name: "vendor_id",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.query(`CREATE INDEX "CustomerVendorId" ON "customer" ("vendor_id")`);

        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD CONSTRAINT "FK_customer_vendor_id"
            FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_customer_vendor_id"`);
        await queryRunner.query(`DROP INDEX "CustomerVendorId"`);
        await queryRunner.dropColumn("customer", "vendor_id");
    }

}
