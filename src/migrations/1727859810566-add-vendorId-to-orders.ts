

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddVendorIdToOrders1727859810566 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("order", new TableColumn({
            name: "vendor_id",
            type: "varchar",
            isNullable: true, 
        }));

        await queryRunner.query(`CREATE INDEX "OrderVendorId" ON "order" ("vendor_id")`);

        await queryRunner.query(`
            ALTER TABLE "order"
            ADD CONSTRAINT "FK_order_vendor_id"
            FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_order_vendor_id"`);

        await queryRunner.query(`DROP INDEX "OrderVendorId"`);

        await queryRunner.dropColumn("order", "vendor_id");
    }

   
}
