import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToProductsTable1783735596660 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log(`Running migration: AddSoftDeleteToProducts`);
        await queryRunner.query(`
            ALTER TABLE "products" 
            ADD COLUMN "deletedAt" TIMESTAMP NULL DEFAULT NULL
            
            `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting alter table add deleteAt column");
        await queryRunner.query(`
            ALTER TABLE "products" 
            DROP COLUMN "deletedAt"
        `)
    }

}
