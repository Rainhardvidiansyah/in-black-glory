import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableProductVariantImageAddDeleteAtColumn1784687176643 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log(`Migrating alter table product_variants_images`);
        await queryRunner.query(`
            ALTER TABLE "product_variant_images" ADD COLUMN "deletedAt" TIMESTAMP NULL DEFAULT NULL
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log(`Reverting alter table product_variant_images`);
        await queryRunner.query(`
            ALTER TABLE "product_variant_images" DROP COLUMN "deletedAt"
            `);
    }

}
