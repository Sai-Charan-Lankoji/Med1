import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddVendorIdToStore1727246961674 implements MigrationInterface { 

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.addColumn("store", new TableColumn({
            name: "vendor_id",
            type: "varchar",
            isNullable: true,  
        }));

        await queryRunner.query(`CREATE INDEX "StoreVendorId" ON "store" ("vendor_id")`);

        await queryRunner.query(`
            ALTER TABLE "store"
            ADD CONSTRAINT "FK_store_vendor_id"
            FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP CONSTRAINT "FK_store_vendor_id"`);

        await queryRunner.query(`DROP INDEX "StoreVendorId"`);

        await queryRunner.dropColumn("store", "vendor_id");
    }

   

}
