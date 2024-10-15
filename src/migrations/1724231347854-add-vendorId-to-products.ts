import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddVendorIdToProducts1724231347854 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("product", new TableColumn({
            name: "vendor_id",
            type: "varchar",
            isNullable: true,
        }));

        await queryRunner.query(`CREATE INDEX "ProductVendorId" ON "product" ("vendor_id")`);

        await queryRunner.query(`
            ALTER TABLE "product"
            ADD CONSTRAINT "FK_product_vendor_id"
            FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_product_vendor_id"`);
        await queryRunner.query(`DROP INDEX "ProductVendorId"`);
        await queryRunner.dropColumn("product", "vendor_id");
    }
}
