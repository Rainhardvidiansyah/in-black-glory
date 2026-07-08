import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1783492915603 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateUsersTable")
        
        await queryRunner.query(`
            CREATE TABLE "users" (
            "id" UUID DEFAULT uuid_generate_v7(),
            "email" VARCHAR(255) NOT NULL, 
            "password" VARCHAR(255) NULL, 
            "provider" VARCHAR(50) NOT NULL DEFAULT 'local', 
            "providerId" VARCHAR(255) NULL, 
            "isActive" BOOLEAN NOT NULL DEFAULT false, 
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
            CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
            ) 
    `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_USERS_EMAIL" ON "users" ("email")
            `);
        }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting migration: CreateUsersTable");
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_USERS_EMAIL"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    
    }

}
