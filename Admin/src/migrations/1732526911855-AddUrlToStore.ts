import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUrlToStore1732526911855 implements MigrationInterface {
  name = "AddUrlToStore1732526911855";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "store_url",
        type: "varchar",
        length: "452",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store", "url");
  }
}
