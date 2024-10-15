import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddAddressAndRegistrationaddressToAddress1724243054907 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "vendor_address_id",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "address",
      new TableColumn({
        name: "registration_address_id",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.createIndex(
      "address",
      new TableIndex({
        name: "VendorAddressId",
        columnNames: ["vendor_address_id"],
      })
    );

    await queryRunner.createIndex(
      "address",
      new TableIndex({
        name: "VendorRegistrationAddressId",
        columnNames: ["registration_address_id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("address", "VendorAddressId");
    await queryRunner.dropIndex("address", "VendorRegistrationAddressId");
    await queryRunner.dropColumn("address", "vendor_address_id");
    await queryRunner.dropColumn("address", "registration_address_id");
  }
}
