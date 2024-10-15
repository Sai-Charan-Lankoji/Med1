import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddVendorIdToSalesChannel1727248266287 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("sales_channel", new TableColumn({
            name: "vendor_id",
            type: "varchar",
            isNullable: true, 
        }));

        await queryRunner.query(`CREATE INDEX "SalesChannelVendorId" ON "sales_channel" ("vendor_id")`);

        await queryRunner.query(`
            ALTER TABLE "sales_channel"
            ADD CONSTRAINT "FK_sales_channel_vendor_id"
            FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales_channel" DROP CONSTRAINT "FK_sales_channel_vendor_id"`);

        await queryRunner.query(`DROP INDEX "SalesChannelVendorId"`);

        await queryRunner.dropColumn("sales_channel", "vendor_id");
    }

   
}
