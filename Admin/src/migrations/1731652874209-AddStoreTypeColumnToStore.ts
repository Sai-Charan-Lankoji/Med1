import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export  class AddStoreTypeColumnToStore1731652874209 implements MigrationInterface {
    name = "AddAuthorsAndPosts1690876698954"

   public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store",
      new TableColumn({
        name: "store_type",
        type: "varchar",
        length: "255",
        isNullable: true,  
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store", "store_type");
  }

}
