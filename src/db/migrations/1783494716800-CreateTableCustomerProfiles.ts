import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCustomerProfiles1783494716800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Create customer profiles table....");

        await queryRunner.query(`
            CREATE TABLE "customer_profiles" (
            "id" UUID DEFAULT uuid_generate_v7() PRIMARY KEY,
            "user_id" UUID NOT NULL UNIQUE,
            "phone" VARCHAR(20),
            "address" TEXT,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "FK_customer_profiles_user"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            )
        `);
        }
        
        
        public async down(queryRunner: QueryRunner): Promise<void> {
            console.log("Reverting migration: CreateTableCustomerProfiles");
            await queryRunner.query(`DROP TABLE IF EXISTS "customer_profiles"`);
        }

}
