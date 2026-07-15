import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductVariantImagesTable1784010269583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log(`Running migration createProductVariantImages ✅✅✅`);
        
        await queryRunner.query(`
            CREATE TABLE "product_variant_images"(
            "id" UUID DEFAULT uuid_generate_v7(),
            "productVariantId" UUID NOT NULL,
            "url" VARCHAR(500) NOT NULL,
            "isPrimary" BOOLEAN NOT NULL DEFAULT false,
            "sortOrder" INT NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_product_variant_images_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_product_variant_images_variant"
            FOREIGN KEY ("productVariantId") REFERENCES "product_variants"("id") ON DELETE CASCADE
            )
        `);


        await queryRunner.query(`
            CREATE INDEX "IDX_product_variant_images_variantId"
            ON "product_variant_images" ("productVariantId")
        `);
    }

    

    public async down(queryRunner: QueryRunner): Promise<void> {

        console.log(`Reverting migration createProductVariantImages ❌❌❌`);

        await queryRunner.query(`
            DROP INDEX "IDX_product_variant_images_variantId"
        `);

        await queryRunner.query(`
            DROP TABLE "product_variant_images"
        `);
    }

}
