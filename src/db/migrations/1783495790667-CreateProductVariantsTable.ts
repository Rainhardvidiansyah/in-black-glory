import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductVariantsTable1783495790667 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Running migration: CreateProductVariantsTable");
    
    await queryRunner.query(`
      CREATE TABLE "product_variants" (
        "id" UUID DEFAULT uuid_generate_v7(),
        "productId" UUID NOT NULL,
        "sku" VARCHAR(255) NOT NULL,
        "size" VARCHAR(50) NOT NULL,
        "color" VARCHAR(50) NOT NULL,
        "priceOverride" NUMERIC(10, 2) NULL,
        "quantity" INT NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_product_variants_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_variants_product"
          FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_PRODUCT_VARIANTS_SKU" ON "product_variants" ("sku")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_PRODUCT_VARIANTS_COMBO" ON "product_variants" ("productId", "size", "color")
    `);
  }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting migration: CreateProductVariantsTable");
        
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCT_VARIANTS_COMBO"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCT_VARIANTS_SKU"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_variants"`);
  }

}
