import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1783495758034 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    console.log("Running migration: CreateProductsTable");

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" UUID DEFAULT uuid_generate_v7(),
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NULL DEFAULT NULL,
        "basePrice" NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_products_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_PRODUCTS_NAME" ON "products" ("name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log("Reverting migration: CreateProductsTable");
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_NAME"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }

}
