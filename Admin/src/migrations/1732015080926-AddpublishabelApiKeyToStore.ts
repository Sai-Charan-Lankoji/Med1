import { MigrationInterface, QueryRunner,TableColumn } from "typeorm"

export class AddpublishabelApiKeyToStore1732015080926 implements MigrationInterface {
    name = "AddpublishabelApiKeyToStore1732015080926"
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "store",
            new TableColumn({
              name: "publishableapikey",
              type: "varchar",
              length: "255",
              isNullable: true,  
            })
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("store", "publishableapikey");
    }

}
