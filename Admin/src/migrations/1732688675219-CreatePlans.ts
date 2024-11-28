import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePlans1732688675219 implements MigrationInterface {
    name = "CreatePlans1732688675219"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "plan" (
                "id" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "name" character varying(100) NOT NULL,
                "description" text,
                "price" numeric NOT NULL,
                "features" jsonb,
                "is_active" boolean NOT NULL DEFAULT true,
                "duration" character varying(50),
                CONSTRAINT "PK_plan_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`CREATE INDEX "PlanNameIndex" ON "plan" ("name")`);
        await queryRunner.query(`CREATE INDEX "PlanIsActiveIndex" ON "plan" ("is_active")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "PlanIsActiveIndex"`);
        await queryRunner.query(`DROP INDEX "PlanNameIndex"`);
        await queryRunner.query(`DROP TABLE "plan"`);
    }
}
