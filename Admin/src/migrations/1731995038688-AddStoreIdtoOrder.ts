import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddStoreIdToOrder1731995038688 implements MigrationInterface {
  name = "AddStoreIdToOrder1731995038688";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "order",
      new TableColumn({
        name: "store_id",
        type: "varchar",
        isNullable: true, // Allow null initially for compatibility with existing data
      })
    );

    await queryRunner.createForeignKey(
      "order",
      new TableForeignKey({
        columnNames: ["store_id"],
        referencedTableName: "store",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL", // Adjust as needed (CASCADE, NO ACTION, etc.)
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("order");
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes("store_id"));
    if (foreignKey) {
      await queryRunner.dropForeignKey("order", foreignKey);
    }

    await queryRunner.dropColumn("order", "store_id");
  }
}
