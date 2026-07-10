import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProductTable1783659199342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("seeding product table...");
        await queryRunner.query(`
            INSERT INTO "products"
            ("name", "description", "basePrice", "isActive")
            VALUES
            ('Basic T-Shirt Black', 'Premium cotton basic t-shirt - Black', 99000.00, true),
            ('Basic T-Shirt White', 'Premium cotton basic t-shirt - White', 99000.00, true),
            ('Oversized T-Shirt Beige', 'Oversized cotton t-shirt - Beige', 129000.00, true),
            ('Oversized T-Shirt Navy', 'Oversized cotton t-shirt - Navy', 129000.00, true),
            ('Graphic T-Shirt Mountain', 'Graphic tee with mountain illustration', 149000.00, true),
            ('Graphic T-Shirt Tokyo', 'Graphic tee inspired by Tokyo streetwear', 159000.00, true),
            ('Long Sleeve T-Shirt Black', 'Long sleeve premium cotton t-shirt', 139000.00, true),
            ('Polo Shirt Navy', 'Classic polo shirt with embroidered logo', 179000.00, true),
            ('Zip Hoodie Gray', 'Fleece zip hoodie for casual wear', 299000.00, true),
            ('Crewneck Sweatshirt Olive', 'Comfortable crewneck sweatshirt', 249000.00, true);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        console.log(`Reverting seed for product table...`);

        await queryRunner.query(`

            DELETE FROM "products" WHERE "name" IN(
                'Basic T-Shirt Black',
                'Basic T-Shirt White',
                'Oversized T-Shirt Beige',
                'Oversized T-Shirt Navy',
                'Graphic T-Shirt Mountain',
                'Graphic T-Shirt Tokyo',
                'Long Sleeve T-Shirt Black',
                'Polo Shirt Navy',
                'Zip Hoodie Gray',
                'Crewneck Sweatshirt Olive'
            )`
        )
    }

}
