import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTemplate1732689576941 implements MigrationInterface {
    name = "CreateTemplate1732689576941"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "template" (
                "id" character varying NOT NULL,
                "name" character varying(100) NOT NULL,
                "description" text,
                "default_features" jsonb,
                "is_active" boolean NOT NULL DEFAULT true,
                "thumbnail_url" character varying,
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
                CONSTRAINT "PK_template_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`CREATE INDEX "TemplateNameIndex" ON "template" ("name")`);
        await queryRunner.query(`CREATE INDEX "TemplateIsActiveIndex" ON "template" ("is_active")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "TemplateIsActiveIndex"`);
        await queryRunner.query(`DROP INDEX "TemplateNameIndex"`);
        await queryRunner.query(`DROP TABLE "template"`);
    }
}
