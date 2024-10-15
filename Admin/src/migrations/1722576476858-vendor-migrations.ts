import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorMigrations1722576476858 implements MigrationInterface {
    name = "VendorMigrations1722576476858"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "vendor" (
                "id" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "company_name" character varying(250) UNIQUE,
                "contact_name" character varying(250),
                "registered_number" character varying(250),
                "contact_email" character varying(120),
                "contact_phone_number" character varying(20),
                "tax_number" character varying(120),
                "vendor_address_id" character varying(120),
                "registration_address_id" character varying(120),
                "business_nature" character varying NOT NULL DEFAULT 'RetailSeller',
                CONSTRAINT "PK_vendor_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "VendorAddressId" ON "vendor" ("vendor_address_id")`);
        await queryRunner.query(`CREATE INDEX "RegistrationAddressId" ON "vendor" ("registration_address_id")`);
        
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD CONSTRAINT "FK_vendor_vendor_address_id"
            FOREIGN KEY ("vendor_address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
        
        await queryRunner.query(`
            ALTER TABLE "vendor"
            ADD CONSTRAINT "FK_vendor_registration_address_id"
            FOREIGN KEY ("registration_address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor" DROP CONSTRAINT "FK_vendor_registration_address_id"`);
        await queryRunner.query(`ALTER TABLE "vendor" DROP CONSTRAINT "FK_vendor_vendor_address_id"`);
        await queryRunner.query(`DROP INDEX "RegistrationAddressId"`);
        await queryRunner.query(`DROP INDEX "VendorAddressId"`);
        await queryRunner.query(`DROP TABLE "vendor"`);
    }
}

