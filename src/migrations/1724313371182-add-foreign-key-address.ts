import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class AddForeignKeyAddress1724313371182 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add foreign key for vendor_address_id
    await queryRunner.createForeignKey("address", new TableForeignKey({
      columnNames: ["vendor_address_id"],
      referencedTableName: "vendor",
      referencedColumnNames: ["id"],
      name: "FK_vendor_address_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    }));

    // Add foreign key for registration_address_id
    await queryRunner.createForeignKey("address", new TableForeignKey({
      columnNames: ["registration_address_id"],
      referencedTableName: "vendor",
      referencedColumnNames: ["id"],
      name: "FK_registration_address_id",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key for vendor_address_id
    const vendorAddressForeignKey = await queryRunner.getTable("address").then(table => 
      table.foreignKeys.find(fk => fk.columnNames.indexOf("vendor_address_id") !== -1)
    );
    if (vendorAddressForeignKey) {
      await queryRunner.dropForeignKey("address", vendorAddressForeignKey);
    }

    // Drop foreign key for registration_address_id
    const registrationAddressForeignKey = await queryRunner.getTable("address").then(table => 
      table.foreignKeys.find(fk => fk.columnNames.indexOf("registration_address_id") !== -1)
    );
    if (registrationAddressForeignKey) {
      await queryRunner.dropForeignKey("address", registrationAddressForeignKey);
    }
  }
}
