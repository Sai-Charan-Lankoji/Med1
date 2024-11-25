import { MigrationInterface, QueryRunner,TableColumn } from "typeorm"

export class AddPlanToVendor1732519966388 implements MigrationInterface {
  name = "AddPlanToVendor1732519966388";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "vendor",
      new TableColumn({
        name: "plan",
        type: "varchar",
        length: "255", // Maximum length for the varchar
        isNullable: true, // Allows NULL values
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("vendor", "plan");
  }
}
