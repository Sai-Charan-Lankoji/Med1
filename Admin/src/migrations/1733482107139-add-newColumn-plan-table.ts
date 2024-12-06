import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNewColumnPlanTable1733482107139 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "plan",
            new TableColumn({
                name: "no_stores",
                type: "varchar", 
                isNullable: true, 
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("plan", "no_stores");
    }
}
