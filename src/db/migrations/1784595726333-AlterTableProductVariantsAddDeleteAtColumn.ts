import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableProductVariantsAddDeleteAtColumn1784595726333 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log(`Migrating alter table product_variants`);
        await queryRunner.query(`
            ALTER TABLE "product_variants" ADD COLUMN "deletedAt" TIMESTAMP NULL DEFAULT NULL
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log(`Reverting alter table product variants`);
        await queryRunner.query(`
            ALTER TABLE "product_variants" DROP COLUMN "deletedAt"
            `);
    }

}
