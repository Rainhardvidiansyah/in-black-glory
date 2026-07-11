import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConstrainInProductVariantTable1783741104336 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log(`Running migration: AddConstrainInProductVariantTable`);
        await queryRunner.query(`
            ALTER TABLE "product_variants" ADD CONSTRAINT
            "UQ_product_variants_sku" UNIQUE ("sku");
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log(`Reverting migration: AddConstrainInProductVariantTable`);
        await queryRunner.query(`
            ALTER TABLE "product_variants" DROP CONSTRAINT "UQ_product_variants_sku"
        `);
    }

}
