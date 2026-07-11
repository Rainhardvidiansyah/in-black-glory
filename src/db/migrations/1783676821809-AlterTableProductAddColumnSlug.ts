import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableProductAddColumnSlug1783676821809 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log(`Running migration: AlterTableProductAddColumn`);
        await queryRunner.query(
            `ALTER TABLE "products" 
            ADD COLUMN "slug" VARCHAR(255)`
        );

        await queryRunner.query(`
            UPDATE "products"
            SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g'))
            WHERE "slug" IS NULL
        `);

        await queryRunner.query(`
            WITH duplicates AS (
                SELECT id, slug,
                       ROW_NUMBER() OVER (PARTITION BY slug ORDER BY "createdAt") AS rn
                FROM "products"
            )
            UPDATE "products" p
            SET "slug" = p."slug" || '-' || duplicates.rn
            FROM duplicates
            WHERE p.id = duplicates.id AND duplicates.rn > 1
        `);

        await queryRunner.query(
            `ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL`
        );

        await queryRunner.query(
            `ALTER TABLE "products" ADD CONSTRAINT "UQ_products_slug" UNIQUE ("slug")`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log(`Running migration: Reverting alter table products to drop column slug`);
        await queryRunner.query(
            `ALTER TABLE "products" 
            DROP COLUMN "slug"`
        );
    }

}
